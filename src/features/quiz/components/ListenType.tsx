import { useEffect, useRef, useState } from "react";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTTS } from "@/features/audio/useTTS";
import { checkAnswer } from "@/utils/fuzzyMatch";
import { FUZZY_ACCEPT } from "@/config/constants";
import type { ListenTypeQ } from "../engine/quizGenerator";

interface Props {
  question: ListenTypeQ;
  disabled: boolean;
  onAnswer: (correct: boolean, payload: { value: string; similarity: number }) => void;
}

export function ListenType({ question, disabled, onAnswer }: Props) {
  const { speak } = useTTS();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    inputRef.current?.focus();
    // Auto-play on mount
    const t = setTimeout(() => speak(question.audioText), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const submit = () => {
    if (disabled) return;
    const r = checkAnswer(value, question.expected, FUZZY_ACCEPT);
    onAnswer(r.accepted, { value, similarity: r.similarity });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card p-6 shadow-card text-center">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ouça e digite o que ouvir
        </div>
        <Button
          type="button"
          variant="default"
          size="lg"
          className="gradient-primary h-20 w-20 rounded-full p-0 shadow-pop"
          onClick={() => speak(question.audioText)}
          aria-label="Tocar áudio"
        >
          <Headphones className="!h-8 !w-8 text-primary-foreground" />
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Toque para ouvir novamente</p>
      </div>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Type what you hear…"
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-12 text-lg"
        />
        <Button onClick={submit} disabled={disabled || !value.trim()} className="h-12 px-6">
          Verificar
        </Button>
      </div>
    </div>
  );
}
