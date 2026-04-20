import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTTS } from "@/features/audio/useTTS";
import { useProgress } from "@/features/progress/progressStore";
import { MultipleChoice } from "./components/MultipleChoice";
import { GapFill } from "./components/GapFill";
import { TranslateWrite } from "./components/TranslateWrite";
import { WordOrder } from "./components/WordOrder";
import { ListenType } from "./components/ListenType";
import { FeedbackPanel } from "./components/FeedbackPanel";
import type { Question } from "./engine/quizGenerator";

interface QuizSessionProps {
  questions: Question[];
  textId?: number; // null = random
  nextTextId?: number;
  onExit: () => void;
}

interface AnswerLog {
  questionId: string;
  correct: boolean;
  pairKey: string; // English sentence key for mistakes
}

export function QuizRunner({ questions, textId, nextTextId, onExit }: QuizSessionProps) {
  const navigate = useNavigate();
  const { stop } = useTTS();
  const { recordSession, recordSingle } = useProgress();
  const [index, setIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [finished, setFinished] = useState<{ correct: number; total: number; earnedXp: number; stars: number; unlocked: boolean } | null>(null);

  const total = questions.length;
  const current = questions[index];

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (showFeedback || !current) return;
      setLastCorrect(correct);
      setShowFeedback(true);
      setLog((l) => [
        ...l,
        { questionId: current.id, correct, pairKey: current.pair.en },
      ]);
      if (textId === undefined) {
        // random session: record per-question for global stats only
        recordSingle(correct);
      }
    },
    [current, showFeedback, recordSingle, textId],
  );

  const next = useCallback(() => {
    stop();
    setShowFeedback(false);
    if (index + 1 >= total) {
      const correct = log.filter((l) => l.correct).length + (lastCorrect ? 0 : 0); // log already includes last
      const finalCorrect = log.filter((l) => l.correct).length;
      if (textId !== undefined) {
        const mistakes = log.filter((l) => !l.correct).map((l) => l.pairKey);
        const r = recordSession(textId, log.length, finalCorrect, mistakes, nextTextId);
        setFinished({ correct: finalCorrect, total: log.length, earnedXp: r.earnedXp, stars: r.newStars, unlocked: r.unlockedNext });
      } else {
        setFinished({ correct: finalCorrect, total: log.length, earnedXp: 0, stars: 0, unlocked: false });
      }
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, total, log, lastCorrect, recordSession, recordSingle, textId, nextTextId, stop]);

  if (finished) {
    const ratio = finished.total ? finished.correct / finished.total : 0;
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-10">
        <div className="text-6xl">{ratio >= 0.9 ? "🏆" : ratio >= 0.7 ? "🎉" : ratio >= 0.5 ? "👍" : "💪"}</div>
        <h1 className="text-3xl font-bold">Sessão concluída</h1>
        <div className="grid w-full grid-cols-3 gap-3">
          <Stat label="Acertos" value={`${finished.correct}/${finished.total}`} />
          <Stat label="Precisão" value={`${Math.round(ratio * 100)}%`} />
          <Stat label="XP" value={`+${finished.earnedXp}`} />
        </div>
        {finished.stars > 0 && (
          <div className="text-2xl">{"⭐".repeat(finished.stars)}{"☆".repeat(3 - finished.stars)}</div>
        )}
        {finished.unlocked && nextTextId && (
          <div className="rounded-xl bg-success-soft px-4 py-2 text-sm text-success">
            🎁 Texto {String(nextTextId).padStart(3, "0")} desbloqueado!
          </div>
        )}
        {log.some((l) => !l.correct) && (
          <div className="w-full rounded-2xl bg-card p-4 shadow-card">
            <h3 className="mb-2 text-sm font-semibold">Frases para revisar</h3>
            <ul className="space-y-1 text-sm">
              {log
                .filter((l) => !l.correct)
                .map((l, i) => (
                  <li key={i} className="text-muted-foreground">• {l.pairKey}</li>
                ))}
            </ul>
          </div>
        )}
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={onExit}>
            Sair
          </Button>
          <Button className="flex-1 gradient-primary text-primary-foreground" onClick={() => window.location.reload()}>
            Refazer
          </Button>
          {finished.unlocked && nextTextId && (
            <Button className="flex-1" onClick={() => navigate(`/texto/${nextTextId}`)}>
              Próximo texto
            </Button>
          )}
        </div>
      </div>
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
          <Button variant="ghost" size="icon" onClick={() => { stop(); onExit(); }} aria-label="Sair">
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
          {current.kind === "LISTEN_TYPE" && (
            <ListenType question={current} disabled={showFeedback} onAnswer={(c) => handleAnswer(c)} />
          )}
        </div>
      </main>

      {showFeedback && <FeedbackPanel question={current} correct={lastCorrect} onNext={next} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 text-center shadow-card">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
