import { useEffect, useState } from "react";
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
      <div className="relative border border-border bg-card/70 p-6 backdrop-blur-md">
        <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
        <div className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          // Qual a tradução?
        </div>
        <p className="text-2xl font-semibold leading-snug text-foreground">{question.prompt}</p>
      </div>
      <div className="grid gap-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correctIndex;
          let stateCls = "border-border bg-card/60 hover:border-primary/60";
          if (disabled && isCorrect) stateCls = "border-success bg-success/10 text-foreground";
          else if (disabled && isSelected && !isCorrect)
            stateCls = "border-destructive bg-destructive/10 text-foreground";
          else if (isSelected) stateCls = "border-primary bg-primary/10 text-foreground";
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => {
                setSelected(idx);
                onAnswer(idx === question.correctIndex, { selected: idx });
              }}
              className={cn(
                "flex items-center gap-3 border p-4 text-left text-base backdrop-blur-md transition-all",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                stateCls,
                disabled && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center border font-display text-xs font-bold tabular-nums",
                  disabled && isCorrect
                    ? "border-success text-success"
                    : disabled && isSelected && !isCorrect
                    ? "border-destructive text-destructive"
                    : isSelected
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
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
