import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalize } from "@/utils/stringUtils";
import type { GapFillQ } from "../engine/quizGenerator";

interface Props {
  question: GapFillQ;
  disabled: boolean;
  onAnswer: (correct: boolean, payload: { value: string }) => void;
}

export function GapFill({ question, disabled, onAnswer }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    inputRef.current?.focus();
  }, [question.id]);

  const submit = () => {
    if (disabled) return;
    onAnswer(normalize(value) === normalize(question.answer), { value });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card p-6 shadow-card">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Complete a lacuna
        </div>
        <p className="text-2xl font-semibold leading-snug">{question.template}</p>
        <p className="mt-3 text-sm italic text-muted-foreground">Dica (PT): {question.hintPt}</p>
      </div>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Digite a palavra que falta…"
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-12 text-lg"
        />
        <Button onClick={submit} disabled={disabled || !value.trim()} className="h-12 px-6">
          Responder
        </Button>
      </div>
    </div>
  );
}
