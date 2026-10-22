export interface Challenge {
  a: number;
  b: number;
}

/** Vérification anti-robot simple, côté client (le mode serveur utiliserait Cloudflare Turnstile). */
export function makeChallenge(random: () => number = Math.random): Challenge {
  return { a: 1 + Math.floor(random() * 9), b: 1 + Math.floor(random() * 9) };
}

export function isCorrect(challenge: Challenge, answer: string): boolean {
  return answer.trim() === String(challenge.a + challenge.b);
}
