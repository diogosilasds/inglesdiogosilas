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
      <div className="rounded-2xl bg-card p-6 shadow-card">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Traduza para o inglês
        </div>
        <p className="text-2xl font-semibold leading-snug">{question.prompt}</p>
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
        className="text-lg"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Pequenos erros de digitação são tolerados (≥{Math.round(FUZZY_ACCEPT * 100)}% de similaridade).
        </span>
        <Button onClick={submit} disabled={disabled || !value.trim()}>
          Verificar
        </Button>
      </div>
    </div>
  );
}
