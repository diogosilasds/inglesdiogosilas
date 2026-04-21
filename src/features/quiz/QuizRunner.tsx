import { useCallback, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/features/progress/progressStore";
import { MultipleChoice } from "./components/MultipleChoice";
import { GapFill } from "./components/GapFill";
import { TranslateWrite } from "./components/TranslateWrite";
import { WordOrder } from "./components/WordOrder";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { QuizSummary, type AnswerLog } from "./components/QuizSummary";
import type { Question } from "./engine/quizGenerator";

interface QuizSessionProps {
  questions: Question[];
  textId?: number; // undefined = random
  nextTextId?: number;
  onExit: () => void;
}

export function QuizRunner({ questions, textId, nextTextId, onExit }: QuizSessionProps) {
  const { recordSession, recordSingle } = useProgress();
  const [index, setIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [finished, setFinished] = useState<{ earnedXp: number; stars: number; unlocked: boolean } | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const total = questions.length;
  const current = questions[index];

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (showFeedback || !current) return;
      const timeMs = Date.now() - questionStartRef.current;
      setLastCorrect(correct);
      setShowFeedback(true);
      setLog((l) => [
        ...l,
        { questionId: current.id, kind: current.kind, correct, pairKey: current.pair.en, timeMs },
      ]);
      if (textId === undefined) {
        recordSingle(correct);
      }
    },
    [current, showFeedback, recordSingle, textId],
  );

  const next = useCallback(() => {
    setShowFeedback(false);
    if (index + 1 >= total) {
      const finalCorrect = log.filter((l) => l.correct).length;
      if (textId !== undefined) {
        const mistakes = log.filter((l) => !l.correct).map((l) => l.pairKey);
        const r = recordSession(textId, log.length, finalCorrect, mistakes, nextTextId);
        setFinished({ earnedXp: r.earnedXp, stars: r.newStars, unlocked: r.unlockedNext });
      } else {
        setFinished({ earnedXp: 0, stars: 0, unlocked: false });
      }
    } else {
      setIndex((i) => i + 1);
      questionStartRef.current = Date.now();
    }
  }, [index, total, log, recordSession, textId, nextTextId]);

  if (finished) {
    return (
      <QuizSummary
        log={log}
        questions={questions}
        earnedXp={finished.earnedXp}
        stars={finished.stars}
        unlockedNext={finished.unlocked}
        nextTextId={nextTextId}
        onExit={onExit}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-muted-foreground">Não foi possível gerar questões para este conteúdo.</p>
        <Button className="mt-4" onClick={onExit}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background pb-32">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Sair">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Progress value={((index + (showFeedback ? 1 : 0)) / total) * 100} className="h-3" />
          <span className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
            {index + 1}/{total}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div key={current.id} className="animate-pop-in">
          {current.kind === "MULTIPLE_CHOICE" && (
            <MultipleChoice question={current} disabled={showFeedback} onAnswer={(c) => handleAnswer(c)} />
          )}
          {current.kind === "GAP_FILL" && (
            <GapFill question={current} disabled={showFeedback} onAnswer={(c) => handleAnswer(c)} />
          )}
          {current.kind === "TRANSLATE_WRITE" && (
            <TranslateWrite question={current} disabled={showFeedback} onAnswer={(c) => handleAnswer(c)} />
          )}
          {current.kind === "WORD_ORDER" && (
            <WordOrder question={current} disabled={showFeedback} onAnswer={(c) => handleAnswer(c)} />
          )}
        </div>
      </main>

      {showFeedback && <FeedbackPanel question={current} correct={lastCorrect} onNext={next} />}
    </div>
  );
}
