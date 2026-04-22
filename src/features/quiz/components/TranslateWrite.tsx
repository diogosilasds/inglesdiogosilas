import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { checkAnswer } from "@/utils/fuzzyMatch";
import { FUZZY_ACCEPT } from "@/config/constants";
import type { TranslateWriteQ } from "../engine/quizGenerator";

interface Props {
  question: TranslateWriteQ;
  disabled: boolean;
  onAnswer: (correct: boolean, payload: { value: string; similarity: number }) => void;
}

export function TranslateWrite({ question, disabled, onAnswer }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue("");
    ref.current?.focus();
  }, [question.id]);

  const submit = () => {
    if (disabled) return;
    const r = checkAnswer(value, question.expected, FUZZY_ACCEPT);
    onAnswer(r.accepted, { value, similarity: r.similarity });
  };

  return (
    <div className="space-y-4">
      <div className="relative border border-border bg-card/70 p-6 backdrop-blur-md">
        <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
        <div className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          // Traduza para o inglês
        </div>
        <p className="text-2xl font-semibold leading-snug text-foreground">{question.prompt}</p>
      </div>
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
        placeholder="Type your translation in English…"
        disabled={disabled}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        rows={3}
        className="rounded-none border-border bg-card/60 font-mono text-lg backdrop-blur-md"
      />
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[11px] text-muted-foreground">
          // erros pequenos tolerados (≥{Math.round(FUZZY_ACCEPT * 100)}% similaridade)
        </span>
        <Button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="rounded-none border border-primary bg-primary font-display font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
        >
          Verificar
        </Button>
      </div>
    </div>
  );
}
