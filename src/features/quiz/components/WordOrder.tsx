import { useEffect, useState } from "react";
import { normalize } from "@/utils/stringUtils";
import { cn } from "@/lib/utils";
import type { WordOrderQ } from "../engine/quizGenerator";

interface Props {
  question: WordOrderQ;
  disabled: boolean;
  onAnswer: (correct: boolean, payload: { value: string[] }) => void;
}

export function WordOrder({ question, disabled, onAnswer }: Props) {
  const [pool, setPool] = useState(question.scrambled);
  const [picked, setPicked] = useState<{ id: string; word: string }[]>([]);

  useEffect(() => {
    setPool(question.scrambled);
    setPicked([]);
  }, [question.id]);

  const isCorrect = (arr: { id: string; word: string }[]) =>
    arr.length === question.correctOrder.length &&
    arr.every((p, i) => normalize(p.word) === normalize(question.correctOrder[i]));

  const onPick = (chip: { id: string; word: string }) => {
    if (disabled) return;
    const newPicked = [...picked, chip];
    setPicked(newPicked);
    setPool(pool.filter((c) => c.id !== chip.id));
    if (newPicked.length === question.correctOrder.length) {
      onAnswer(isCorrect(newPicked), { value: newPicked.map((p) => p.word) });
    }
  };

  const onUnpick = (chip: { id: string; word: string }) => {
    if (disabled) return;
    setPicked(picked.filter((c) => c.id !== chip.id));
    setPool([...pool, chip]);
  };

  return (
    <div className="space-y-4">
      <div className="relative border border-border bg-card/70 p-6 backdrop-blur-md">
        <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
        <div className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          // Ordene as palavras
        </div>
        <p className="text-xl font-semibold leading-snug text-foreground">{question.prompt}</p>
      </div>

      {/* Picked area */}
      <div className="cyber-hatch min-h-[80px] border border-dashed border-border bg-background/40 p-3">
        <div className="flex flex-wrap gap-2">
          {picked.map((chip) => (
            <button
              key={chip.id}
              onClick={() => onUnpick(chip)}
              disabled={disabled}
              className="border border-primary bg-primary/15 px-3 py-2 font-mono text-sm font-medium text-foreground transition hover:bg-primary/25"
            >
              {chip.word}
            </button>
          ))}
          {picked.length === 0 && (
            <span className="self-center font-mono text-xs text-muted-foreground">
              // toque nas palavras na ordem correta…
            </span>
          )}
        </div>
      </div>

      {/* Pool */}
      <div className="flex flex-wrap gap-2">
        {pool.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onPick(chip)}
            disabled={disabled}
            className={cn(
              "border border-border bg-card/60 px-3 py-2 font-mono text-sm font-medium text-foreground transition",
              "hover:border-primary hover:text-primary",
              disabled && "opacity-60",
            )}
          >
            {chip.word}
          </button>
        ))}
      </div>
    </div>
  );
}
