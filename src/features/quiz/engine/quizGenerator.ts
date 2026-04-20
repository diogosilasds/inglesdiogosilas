import type { SentencePair, TextEntry } from "@/data/types";
import { normalize, pickRandom, shuffle, tokenize } from "@/utils/stringUtils";
import { QUESTIONS_PER_SESSION } from "@/config/constants";

export type QuestionKind =
  | "MULTIPLE_CHOICE"
  | "GAP_FILL"
  | "TRANSLATE_WRITE"
  | "WORD_ORDER"
  | "LISTEN_TYPE";

export interface BaseQuestion {
  id: string;
  kind: QuestionKind;
  pair: SentencePair;
  textId: number;
  textTitle: string;
}

export interface MultipleChoiceQ extends BaseQuestion {
  kind: "MULTIPLE_CHOICE";
  prompt: string; // EN
  options: string[]; // PT options
  correctIndex: number;
}

export interface GapFillQ extends BaseQuestion {
  kind: "GAP_FILL";
  template: string; // EN with ___
  answer: string; // missing word
  hintPt: string;
}

export interface TranslateWriteQ extends BaseQuestion {
  kind: "TRANSLATE_WRITE";
  prompt: string; // PT
  expected: string; // EN
}

export interface WordOrderQ extends BaseQuestion {
  kind: "WORD_ORDER";
  prompt: string; // PT
  scrambled: { id: string; word: string }[];
  correctOrder: string[]; // tokens in order (no punctuation)
  fullEn: string;
}

export interface ListenTypeQ extends BaseQuestion {
  kind: "LISTEN_TYPE";
  audioText: string; // EN
  expected: string;
  hintPt: string;
}

export type Question = MultipleChoiceQ | GapFillQ | TranslateWriteQ | WordOrderQ | ListenTypeQ;

const STOP_WORDS = new Set([
  "the","a","an","is","am","are","was","were","be","been","being",
  "i","you","he","she","it","we","they","my","your","his","her","our","their",
  "to","of","in","on","at","for","with","and","or","but","so","if","as","by","from","that","this",
]);

function pickKeyWord(en: string): string | null {
  const tokens = en.replace(/[.,!?;:"“”'’()\[\]\-–—]/g, "").split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  // Prefer the longest non-stopword
  const candidates = tokens
    .filter((w) => !STOP_WORDS.has(w.toLowerCase()) && w.length >= 3)
    .sort((a, b) => b.length - a.length);
  return (candidates[0] || tokens.sort((a, b) => b.length - a.length)[0]) ?? null;
}

function makeMC(pair: SentencePair, distractorPool: SentencePair[], textId: number, title: string): MultipleChoiceQ {
  const distractors = pickRandom(
    distractorPool.filter((p) => p.pt !== pair.pt),
    3,
  ).map((p) => p.pt);
  // If we don't have 3 unique distractors, fill with shuffled fragments
  while (distractors.length < 3) distractors.push(`(opção alternativa ${distractors.length + 1})`);
  const options = shuffle([pair.pt, ...distractors]);
  return {
    id: cryptoRandomId(),
    kind: "MULTIPLE_CHOICE",
    pair,
    textId,
    textTitle: title,
    prompt: pair.en,
    options,
    correctIndex: options.indexOf(pair.pt),
  };
}

function makeGap(pair: SentencePair, textId: number, title: string): GapFillQ | null {
  const word = pickKeyWord(pair.en);
  if (!word) return null;
  // Replace first standalone occurrence with blank, preserve punctuation
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`);
  if (!re.test(pair.en)) return null;
  const template = pair.en.replace(re, "_____");
  return {
    id: cryptoRandomId(),
    kind: "GAP_FILL",
    pair,
    textId,
    textTitle: title,
    template,
    answer: word,
    hintPt: pair.pt,
  };
}

function makeWrite(pair: SentencePair, textId: number, title: string): TranslateWriteQ {
  return {
    id: cryptoRandomId(),
    kind: "TRANSLATE_WRITE",
    pair,
    textId,
    textTitle: title,
    prompt: pair.pt,
    expected: pair.en,
  };
}

function makeOrder(pair: SentencePair, textId: number, title: string): WordOrderQ | null {
  const tokens = tokenize(pair.en);
  if (tokens.length < 3 || tokens.length > 12) return null;
  const scrambled = shuffle(tokens.map((w, i) => ({ id: `${i}-${w}`, word: w })));
  return {
    id: cryptoRandomId(),
    kind: "WORD_ORDER",
    pair,
    textId,
    textTitle: title,
    prompt: pair.pt,
    scrambled,
    correctOrder: tokens,
    fullEn: pair.en,
  };
}

function makeListen(pair: SentencePair, textId: number, title: string): ListenTypeQ {
  return {
    id: cryptoRandomId(),
    kind: "LISTEN_TYPE",
    pair,
    textId,
    textTitle: title,
    audioText: pair.en,
    expected: pair.en,
    hintPt: pair.pt,
  };
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

export interface GenerateOptions {
  size?: number;
  kinds?: QuestionKind[];
  audioAvailable?: boolean;
}

const ALL_KINDS: QuestionKind[] = [
  "MULTIPLE_CHOICE",
  "GAP_FILL",
  "TRANSLATE_WRITE",
  "WORD_ORDER",
  "LISTEN_TYPE",
];

export function generateForText(text: TextEntry, opts: GenerateOptions = {}): Question[] {
  const size = opts.size ?? QUESTIONS_PER_SESSION;
  const audio = opts.audioAvailable ?? true;
  let kinds = opts.kinds && opts.kinds.length ? opts.kinds : ALL_KINDS;
  if (!audio) kinds = kinds.filter((k) => k !== "LISTEN_TYPE");

  const usable = text.pairs.filter((p) => {
    const enLen = p.en.replace(/\s+/g, " ").trim().length;
    const ptLen = p.pt.replace(/\s+/g, " ").trim().length;
    return enLen >= 6 && ptLen >= 4 && enLen <= 200;
  });
  if (!usable.length) return [];

  const seeds = pickRandom(usable, Math.min(size, usable.length));
  const questions: Question[] = [];
  seeds.forEach((pair, i) => {
    const kind = kinds[i % kinds.length];
    let q: Question | null = null;
    switch (kind) {
      case "MULTIPLE_CHOICE":
        q = makeMC(pair, usable, text.id, text.titleEn);
        break;
      case "GAP_FILL":
        q = makeGap(pair, text.id, text.titleEn) || makeMC(pair, usable, text.id, text.titleEn);
        break;
      case "TRANSLATE_WRITE":
        q = makeWrite(pair, text.id, text.titleEn);
        break;
      case "WORD_ORDER":
        q = makeOrder(pair, text.id, text.titleEn) || makeMC(pair, usable, text.id, text.titleEn);
        break;
      case "LISTEN_TYPE":
        q = makeListen(pair, text.id, text.titleEn);
        break;
    }
    if (q) questions.push(q);
  });
  return questions;
}

export function generateRandom(texts: TextEntry[], opts: GenerateOptions = {}): Question[] {
  const size = opts.size ?? QUESTIONS_PER_SESSION;
  const audio = opts.audioAvailable ?? true;
  let kinds = opts.kinds && opts.kinds.length ? opts.kinds : ALL_KINDS;
  if (!audio) kinds = kinds.filter((k) => k !== "LISTEN_TYPE");

  const allPairs: { text: TextEntry; pair: SentencePair }[] = [];
  texts.forEach((t) => {
    t.pairs.forEach((p) => {
      const enLen = p.en.trim().length;
      if (enLen >= 6 && enLen <= 200 && p.pt.trim().length >= 4) {
        allPairs.push({ text: t, pair: p });
      }
    });
  });
  const seeds = pickRandom(allPairs, Math.min(size, allPairs.length));
  const questions: Question[] = [];
  seeds.forEach(({ text, pair }, i) => {
    const kind = kinds[i % kinds.length];
    let q: Question | null = null;
    const sameTextPool = text.pairs;
    switch (kind) {
      case "MULTIPLE_CHOICE":
        q = makeMC(pair, sameTextPool, text.id, text.titleEn);
        break;
      case "GAP_FILL":
        q = makeGap(pair, text.id, text.titleEn) || makeMC(pair, sameTextPool, text.id, text.titleEn);
        break;
      case "TRANSLATE_WRITE":
        q = makeWrite(pair, text.id, text.titleEn);
        break;
      case "WORD_ORDER":
        q = makeOrder(pair, text.id, text.titleEn) || makeMC(pair, sameTextPool, text.id, text.titleEn);
        break;
      case "LISTEN_TYPE":
        q = makeListen(pair, text.id, text.titleEn);
        break;
    }
    if (q) questions.push(q);
  });
  return questions;
}

export function checkQuestion(q: Question, answer: unknown): { correct: boolean; expected: string } {
  switch (q.kind) {
    case "MULTIPLE_CHOICE": {
      const idx = Number(answer);
      return { correct: idx === q.correctIndex, expected: q.options[q.correctIndex] };
    }
    case "GAP_FILL": {
      const a = String(answer ?? "");
      return { correct: normalize(a) === normalize(q.answer), expected: q.answer };
    }
    case "TRANSLATE_WRITE":
    case "LISTEN_TYPE": {
      // handled by component (uses fuzzy)
      const a = String(answer ?? "");
      return { correct: normalize(a) === normalize(q.kind === "TRANSLATE_WRITE" ? q.expected : q.expected), expected: q.kind === "TRANSLATE_WRITE" ? q.expected : q.expected };
    }
    case "WORD_ORDER": {
      const arr = Array.isArray(answer) ? (answer as string[]) : [];
      const ok =
        arr.length === q.correctOrder.length && arr.every((w, i) => normalize(w) === normalize(q.correctOrder[i]));
      return { correct: ok, expected: q.fullEn };
    }
  }
}
