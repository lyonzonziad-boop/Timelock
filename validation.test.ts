import { describe, expect, it } from "vitest";
import { checkFile, isValidPassword, isValidUsername, mediaKindOf, validateCapsule } from "@/lib/validation";

describe("username and password", () => {
  it("accepts simple usernames", () => {
    expect(isValidUsername("camille_42")).toBe(true);
    expect(isValidUsername("  Camille.x  ")).toBe(true);
  });

  it("rejects bad usernames", () => {
    expect(isValidUsername("ab")).toBe(false);
    expect(isValidUsername("bad name")).toBe(false);
    expect(isValidUsername("a".repeat(21))).toBe(false);
  });

  it("requires 10 characters for passwords", () => {
    expect(isValidPassword("1234567890")).toBe(true);
    expect(isValidPassword("short")).toBe(false);
  });
});

describe("capsules", () => {
  const future = "2099-01-01";

  it("needs a title or a message", () => {
    expect(validateCapsule({ title: " ", message: "", unlockDate: future }, Date.now())).toBe("empty");
  });

  it("rejects past or missing dates", () => {
    expect(validateCapsule({ title: "x", message: "", unlockDate: "2000-01-01" }, Date.now())).toBe("date_past");
    expect(validateCapsule({ title: "x", message: "", unlockDate: "" }, Date.now())).toBe("date_missing");
  });

  it("accepts a valid capsule", () => {
    expect(validateCapsule({ title: "x", message: "", unlockDate: future }, Date.now())).toBeNull();
  });
});

describe("files", () => {
  it("detects the media kind, ignoring codec parameters", () => {
    expect(mediaKindOf("audio/webm;codecs=opus")).toBe("audio");
    expect(mediaKindOf("application/pdf")).toBeNull();
  });

  it("accepts supported files and rejects the rest", () => {
    expect(checkFile({ size: 1, type: "image/png" })).toEqual({ kind: "image" });
    expect(checkFile({ size: 1, type: "application/pdf" })).toEqual({ issue: "unsupported" });
    expect(checkFile({ size: 81 * 1024 * 1024, type: "video/mp4" })).toEqual({ issue: "too_large" });
  });
});
