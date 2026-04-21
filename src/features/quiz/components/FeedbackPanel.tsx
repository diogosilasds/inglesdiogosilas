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
        "fixed inset-x-0 bottom-0 z-40 animate-slide-up rounded-t-3xl border-t-4 p-5 shadow-pop sm:p-6",
        correct
          ? "border-success bg-success-soft"
          : "border-destructive bg-destructive-soft",
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <div className="flex items-center gap-3">
          {correct ? (
            <CheckCircle2 className="h-7 w-7 text-success" />
          ) : (
            <XCircle className="h-7 w-7 text-destructive" />
          )}
          <h3 className={cn("text-xl font-bold", correct ? "text-success" : "text-destructive")}>
            {correct ? "Boa! 🎉" : "Quase lá!"}
          </h3>
        </div>
        <div className="rounded-xl bg-card/80 p-3 text-sm">
          <p className="font-semibold">{ans.en}</p>
          <p className="text-muted-foreground">{ans.pt}</p>
          {ans.note && (
            <p className="mt-2 border-t border-border pt-2 text-xs italic text-muted-foreground">
              💡 {ans.note}
            </p>
          )}
        </div>
        <Button
          size="lg"
          onClick={onNext}
          autoFocus
          className={cn(
            "h-12 w-full text-base font-semibold",
            correct ? "bg-success hover:bg-success/90 text-success-foreground" : "",
          )}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
