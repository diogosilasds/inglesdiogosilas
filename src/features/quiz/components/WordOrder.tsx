import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/features/audio/SpeakButton";
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
      <div className="rounded-2xl bg-card p-6 shadow-card">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ordene as palavras
        </div>
        <p className="text-xl font-semibold leading-snug">{question.prompt}</p>
      </div>

      <div className="min-h-[80px] rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-3">
        <div className="flex flex-wrap gap-2">
          {picked.map((chip) => (
            <button
              key={chip.id}
              onClick={() => onUnpick(chip)}
              disabled={disabled}
              className="rounded-lg border-2 border-accent bg-accent-soft px-3 py-2 text-sm font-medium transition hover:bg-accent/20"
            >
              {chip.word}
            </button>
          ))}
          {picked.length === 0 && (
            <span className="self-center text-sm text-muted-foreground">Toque nas palavras abaixo na ordem correta…</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {pool.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onPick(chip)}
            disabled={disabled}
            className={cn(
              "rounded-lg border-2 border-border bg-card px-3 py-2 text-sm font-medium shadow-card transition",
              "hover:border-primary hover:text-primary",
              disabled && "opacity-60",
            )}
          >
            {chip.word}
          </button>
        ))}
      </div>

      {disabled && (
        <div className="flex items-center justify-end gap-2">
          <SpeakButton text={question.fullEn} variant="outline" size="sm" label="Ouvir frase" />
        </div>
      )}
    </div>
  );
}
