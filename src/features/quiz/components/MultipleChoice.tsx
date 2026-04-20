import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/features/audio/SpeakButton";
import { cn } from "@/lib/utils";
import type { MultipleChoiceQ } from "../engine/quizGenerator";

interface Props {
  question: MultipleChoiceQ;
  disabled: boolean;
  onAnswer: (correct: boolean, payload: { selected: number }) => void;
}

export function MultipleChoice({ question, disabled, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => setSelected(null), [question.id]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (disabled) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= question.options.length) {
        const idx = n - 1;
        setSelected(idx);
        onAnswer(idx === question.correctIndex, { selected: idx });
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [disabled, question, onAnswer]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card p-6 shadow-card">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Qual a tradução?
        </div>
        <div className="flex items-start gap-3">
          <p className="text-2xl font-semibold leading-snug">{question.prompt}</p>
          <SpeakButton text={question.prompt} />
        </div>
      </div>
      <div className="grid gap-3">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correctIndex;
          let stateCls = "bg-card hover:bg-secondary border-border";
          if (disabled && isCorrect) stateCls = "bg-success-soft border-success text-success-foreground/90";
          else if (disabled && isSelected && !isCorrect)
            stateCls = "bg-destructive-soft border-destructive text-destructive";
          else if (isSelected) stateCls = "bg-accent-soft border-accent";
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => {
                setSelected(idx);
                onAnswer(idx === question.correctIndex, { selected: idx });
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 text-left text-base transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                stateCls,
                disabled && "cursor-default",
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-secondary-foreground">
                {idx + 1}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
