import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TEXTS } from "@/data/texts";
import { generateRandom, type QuestionKind } from "@/features/quiz/engine/quizGenerator";
import { QuizRunner } from "@/features/quiz/QuizRunner";
import { useTTS } from "@/features/audio/useTTS";
import { cn } from "@/lib/utils";

const KINDS: { id: QuestionKind; label: string }[] = [
  { id: "MULTIPLE_CHOICE", label: "Múltipla escolha" },
  { id: "GAP_FILL", label: "Lacuna" },
  { id: "TRANSLATE_WRITE", label: "Traduzir" },
  { id: "WORD_ORDER", label: "Ordenar palavras" },
  { id: "LISTEN_TYPE", label: "Listen & type" },
];

export default function RandomQuiz() {
  const navigate = useNavigate();
  const { hasEnglishVoice, supported } = useTTS();
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<QuestionKind[]>([]);

  const questions = useMemo(
    () => (started ? generateRandom(TEXTS, { audioAvailable: supported && hasEnglishVoice, kinds: selected.length ? selected : undefined }) : []),
    [started, selected, supported, hasEnglishVoice],
  );

  if (started) {
    return <QuizRunner questions={questions} onExit={() => navigate("/")} />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 sm:pt-24">
      <h1 className="mb-1 text-2xl font-bold">Treino aleatório</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        10 questões sorteadas dos {TEXTS.length} textos disponíveis.
      </p>

      <div className="rounded-2xl bg-card p-4 shadow-card">
        <h2 className="mb-2 text-sm font-semibold">Filtrar por tipo de questão (opcional)</h2>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => {
            const active = selected.includes(k.id);
            return (
              <button
                key={k.id}
                onClick={() =>
                  setSelected((s) => (s.includes(k.id) ? s.filter((x) => x !== k.id) : [...s, k.id]))
                }
                className={cn(
                  "rounded-full border-2 px-3 py-1.5 text-xs font-medium transition",
                  active ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground",
                )}
              >
                {k.label}
              </button>
            );
          })}
        </div>
        {selected.length > 0 && (
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelected([])}>
            Limpar
          </Button>
        )}
      </div>

      <Button
        size="lg"
        className="mt-6 h-14 w-full gradient-primary text-base font-semibold text-primary-foreground shadow-pop"
        onClick={() => setStarted(true)}
      >
        Começar treino
      </Button>
    </div>
  );
}
