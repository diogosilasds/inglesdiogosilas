import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question } from "../engine/quizGenerator";

interface Props {
  question: Question;
  correct: boolean;
  onNext: () => void;
}

function expectedAnswer(q: Question): { en: string; pt: string; note?: string } {
  return { en: q.pair.en, pt: q.pair.pt, note: q.pair.note };
}

export function FeedbackPanel({ question, correct, onNext }: Props) {
  const ans = expectedAnswer(question);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 animate-slide-up border-t-2 bg-background/95 p-5 backdrop-blur-md sm:p-6",
        correct ? "border-success" : "border-destructive",
      )}
      style={{
        boxShadow: correct
          ? "0 -4px 24px hsl(var(--success) / 0.25)"
          : "0 -4px 24px hsl(var(--destructive) / 0.25)",
      }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <div className="flex items-center gap-3">
          {correct ? (
            <CheckCircle2 className="h-6 w-6 text-success" />
          ) : (
            <XCircle className="h-6 w-6 text-destructive" />
          )}
          <h3
            className={cn(
              "font-display text-lg font-bold uppercase tracking-[0.2em]",
              correct ? "text-success" : "text-destructive",
            )}
          >
            {correct ? "// Correto" : "// Quase lá"}
          </h3>
        </div>
        <div className="border border-border bg-card/80 p-3 text-sm">
          <p className="font-medium text-foreground">{ans.en}</p>
          <p className="text-muted-foreground">{ans.pt}</p>
          {ans.note && (
            <p className="mt-2 border-t border-border pt-2 font-mono text-xs italic text-muted-foreground">
              // {ans.note}
            </p>
          )}
        </div>
        <Button
          size="lg"
          onClick={onNext}
          autoFocus
          className={cn(
            "h-12 w-full rounded-none border font-display text-base font-bold uppercase tracking-widest",
            correct
              ? "border-success bg-success text-success-foreground hover:bg-success/90"
              : "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          Continuar ▶
        </Button>
      </div>
    </div>
  );
}
