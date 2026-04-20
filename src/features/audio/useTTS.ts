import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "mv80-tts-rate";

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /en[-_]US/i.test(v.lang) && /female|samantha|google/i.test(v.name)) ||
    voices.find((v) => /en[-_]US/i.test(v.lang)) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
  cachedVoice = preferred ?? null;
  return cachedVoice;
}

export interface TTS {
  supported: boolean;
  hasEnglishVoice: boolean;
  rate: number;
  setRate: (r: number) => void;
  speaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
}

export function useTTS(): TTS {
  const [hasEnglishVoice, setHasEnglishVoice] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRateState] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v ? Number(v) : 1;
  });
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    const refresh = () => {
      cachedVoice = null;
      setHasEnglishVoice(!!pickEnglishVoice());
    };
    refresh();
    window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
  }, [supported]);

  const setRate = useCallback((r: number) => {
    setRateState(r);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, String(r));
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickEnglishVoice();
      if (v) u.voice = v;
      u.lang = v?.lang || "en-US";
      u.rate = rate;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utterRef.current = u;
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    },
    [rate, supported],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, hasEnglishVoice, rate, setRate, speaking, speak, stop };
}
