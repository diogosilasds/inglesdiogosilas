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
      <div className="relative border border-border bg-card/70 p-6 backdrop-blur-md">
        <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
        <div className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          // Complete a lacuna
        </div>
        <p className="text-2xl font-semibold leading-snug text-foreground">{question.template}</p>
        <p className="mt-3 font-mono text-xs italic text-muted-foreground">
          [hint] {question.hintPt}
        </p>
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
          className="h-12 rounded-none border-border bg-card/60 font-mono text-lg backdrop-blur-md"
        />
        <Button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="h-12 rounded-none border border-primary bg-primary px-6 font-display font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
        >
          Responder
        </Button>
      </div>
    </div>
  );
}
