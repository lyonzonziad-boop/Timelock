import { hashPassword, randomSalt } from "@/lib/crypto";
import { createId } from "@/lib/id";
import { store } from "@/lib/storage";
import { isValidPassword, isValidUsername, normalizeUsername } from "@/lib/validation";
import type { PublicUser, UserRecord } from "@/types";

export type AuthErrorCode = "username_invalid" | "password_short" | "username_taken" | "bad_credentials";

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

const toPublic = (u: UserRecord): PublicUser => ({ id: u.id, username: u.username });

export function currentUser(): PublicUser | null {
  const id = store.session();
  if (!id) return null;
  const user = store.users().find((u) => u.id === id);
  return user ? toPublic(user) : null;
}

export async function signUp(usernameInput: string, password: string): Promise<void> {
  const username = normalizeUsername(usernameInput);
  if (!isValidUsername(username)) throw new AuthError("username_invalid");
  if (!isValidPassword(password)) throw new AuthError("password_short");
  const users = store.users();
  if (users.some((u) => u.username === username)) throw new AuthError("username_taken");
  const salt = randomSalt();
  users.push({
    id: createId("usr"),
    username,
    salt,
    hash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  });
  store.saveUsers(users);
}

export async function signIn(usernameInput: string, password: string): Promise<PublicUser> {
  const username = normalizeUsername(usernameInput);
  const user = store.users().find((u) => u.username === username);
  // Même coût de calcul même si le compte n'existe pas
  const hash = await hashPassword(password, user?.salt ?? "no-such-user");
  if (!user || hash !== user.hash) throw new AuthError("bad_credentials");
  store.saveSession(user.id);
  return toPublic(user);
}

export function signOut(): void {
  store.saveSession(null);
}
