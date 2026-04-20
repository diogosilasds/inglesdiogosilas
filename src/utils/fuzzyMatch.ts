import { normalize } from "./stringUtils";

// Levenshtein distance (iterative, O(n*m))
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1).fill(0).map((_, i) => i);
  const v1 = new Array(b.length + 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j < v0.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

export interface MatchResult {
  exact: boolean;
  accepted: boolean;
  similarity: number;
}

export function similarity(user: string, expected: string): number {
  const a = normalize(user);
  const b = normalize(expected);
  if (!a && !b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (!maxLen) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

export function checkAnswer(user: string, expected: string, threshold = 0.85): MatchResult {
  const a = normalize(user);
  const b = normalize(expected);
  if (a === b) return { exact: true, accepted: true, similarity: 1 };
  const sim = similarity(user, expected);
  return { exact: false, accepted: sim >= threshold, similarity: sim };
}
