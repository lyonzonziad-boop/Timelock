function toHex(buf: ArrayBuffer | Uint8Array): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomSalt(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

/**
 * Hachage SHA-256 avec sel, via Web Crypto (disponible en HTTPS ou sur localhost).
 * Suffisant pour un usage local ; un serveur devrait utiliser bcrypt ou argon2.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${password}`));
  return toHex(digest);
}
