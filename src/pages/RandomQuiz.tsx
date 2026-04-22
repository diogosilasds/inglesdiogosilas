import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEXTS } from "@/data/texts";
import { generateRandom, generateForText, type Question, type QuestionKind } from "@/features/quiz/engine/quizGenerator";
import { QuizRunner } from "@/features/quiz/QuizRunner";
import { cn } from "@/lib/utils";

const KINDS: { id: QuestionKind; label: string }[] = [
  { id: "MULTIPLE_CHOICE", label: "Múltipla escolha" },
  { id: "GAP_FILL", label: "Lacuna" },
  { id: "TRANSLATE_WRITE", label: "Traduzir" },
  { id: "WORD_ORDER", label: "Ordenar palavras" },
];

const SIZE_OPTIONS = [5, 10, 15, 20, 30];

export default function RandomQuiz() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [selectedKinds, setSelectedKinds] = useState<QuestionKind[]>([]);
  const [selectedTexts, setSelectedTexts] = useState<number[]>([]);
  const [size, setSize] = useState<number>(10);

  const questions = useMemo<Question[]>(() => {
    if (!started) return [];
    const kinds = selectedKinds.length ? selectedKinds : undefined;
    if (selectedTexts.length === 0) {
      return generateRandom(TEXTS, { size, kinds });
    }
    // Build pool from selected texts
    const pool = TEXTS.filter((t) => selectedTexts.includes(t.id));
    if (selectedTexts.length === 1) {
      return generateForText(pool[0], { size, kinds });
    }
    return generateRandom(pool, { size, kinds });
  }, [started, selectedKinds, selectedTexts, size]);

  if (started) {
    return <QuizRunner questions={questions} onExit={() => navigate("/")} />;
  }

  const toggleText = (id: number) =>
    setSelectedTexts((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 sm:pt-24">
      <header className="mb-6 border-l-2 border-primary pl-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          // TRAINING.MODE
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight">Treino aleatório</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure sua sessão de prática.
        </p>
      </header>

      {/* Quantity */}
      <Section title="Quantidade de questões" tag="01">
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((n) => {
            const active = size === n;
            return (
              <button
                key={n}
                onClick={() => setSize(n)}
                className={cn(
                  "min-w-[56px] border px-3 py-1.5 font-display text-sm font-semibold transition",
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-neon"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Question types */}
      <Section title="Tipos de questão (opcional)" tag="02">
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => {
            const active = selectedKinds.includes(k.id);
            return (
              <button
                key={k.id}
                onClick={() =>
                  setSelectedKinds((s) =>
                    s.includes(k.id) ? s.filter((x) => x !== k.id) : [...s, k.id],
                  )
                }
                className={cn(
                  "border px-3 py-1.5 text-xs font-medium transition",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50",
                )}
              >
                {k.label}
              </button>
            );
          })}
        </div>
        {selectedKinds.length > 0 && (
          <Button variant="ghost" size="sm" className="mt-2 h-7 px-2 text-xs" onClick={() => setSelectedKinds([])}>
            Limpar
          </Button>
        )}
      </Section>

      {/* Texts multi-select */}
      <Section
        title="Textos (opcional — vazio = todos)"
        tag="03"
        right={
          <span className="font-display text-xs text-muted-foreground">
            {selectedTexts.length}/{TEXTS.length}
          </span>
        }
      >
        <div className="mb-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-none border-border px-2 text-xs"
            onClick={() => setSelectedTexts(TEXTS.map((t) => t.id))}
          >
            Selecionar todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-none border-border px-2 text-xs"
            onClick={() => setSelectedTexts([])}
          >
            Limpar
          </Button>
        </div>
        <div className="max-h-72 overflow-y-auto border border-border bg-background/40">
          <ul className="divide-y divide-border">
            {TEXTS.map((t) => {
              const active = selectedTexts.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    onClick={() => toggleText(t.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-card",
                      active && "bg-primary/5",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center border",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card",
                      )}
                    >
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="font-display text-xs text-muted-foreground tabular-nums">
                      {String(t.id).padStart(3, "0")}
                    </span>
                    <span className="flex-1 truncate text-sm text-foreground">{t.titleEn}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Button
        size="lg"
        className="mt-6 h-14 w-full rounded-none border border-primary bg-primary font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-neon hover:bg-primary/90"
        onClick={() => setStarted(true)}
      >
        ▶ Iniciar treino
      </Button>
    </div>
  );
}

function Section({
  title,
  tag,
  right,
  children,
}: {
  title: string;
  tag: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mb-4 border border-border bg-card p-4 shadow-card">
      <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
          <span className="text-primary">/{tag}</span> {title}
        </h2>
        {right}
      </div>
      {children}
    </div>
  );
}
