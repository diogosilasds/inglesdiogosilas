import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Play } from "lucide-react";
import { TEXTS } from "@/data/texts";
import { useProgress } from "@/features/progress/progressStore";
import { cn } from "@/lib/utils";

export default function Trail() {
  const { texts, toggleCompleted } = useProgress();
  const completed = TEXTS.filter((t) => texts[t.id]?.status === "COMPLETED").length;
  const pct = Math.round((completed / TEXTS.length) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6">
      <header className="mb-6 border-l-2 border-primary pl-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          // TRAIL.SYS
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight">Trilha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos os 80 textos liberados — marque cada um como concluído quando terminar.
        </p>
      </header>

      {/* Progress panel */}
      <div className="relative mb-6 border border-border bg-card/70 p-4 backdrop-blur-md">
        <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              /Progresso
            </div>
            <div className="font-display text-lg font-bold tabular-nums text-foreground">
              {completed} <span className="text-muted-foreground">/ {TEXTS.length}</span>
            </div>
          </div>
          <div className="flex-1 max-w-[60%]">
            <div className="mb-1 flex items-center justify-between font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>0%</span>
              <span className="text-primary">{pct}%</span>
              <span>100%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden border border-border bg-background">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${pct}%`, boxShadow: "0 0 12px hsl(var(--primary) / 0.6)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Texts list */}
      <div className="space-y-1.5">
        {TEXTS.map((t) => {
          const p = texts[t.id];
          const done = p?.status === "COMPLETED";
          const num = String(t.id).padStart(3, "0");
          return (
            <div
              key={t.id}
              className={cn(
                "group relative flex items-center gap-3 border bg-card/60 p-3 backdrop-blur-md transition",
                done
                  ? "border-primary/60 bg-primary/5"
                  : "border-border hover:border-primary/40",
              )}
            >
              {/* index tag */}
              <span className="font-display text-xs font-semibold tabular-nums text-muted-foreground">
                {num}
              </span>

              {/* title */}
              <Link to={`/texto/${t.id}`} className="min-w-0 flex-1">
                <div
                  className={cn(
                    "truncate font-medium text-foreground transition-colors group-hover:text-primary",
                    done && "line-through opacity-60",
                  )}
                >
                  {t.titleEn}
                </div>
                <div className="truncate text-xs text-muted-foreground">{t.titlePt || "—"}</div>
              </Link>

              {/* play */}
              <Link
                to={`/quiz/${t.id}`}
                className="hidden h-9 w-9 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary sm:flex"
                aria-label="Iniciar quiz"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </Link>

              {/* toggle done */}
              <button
                type="button"
                onClick={() => toggleCompleted(t.id)}
                aria-label={done ? "Desmarcar como concluído" : "Marcar como concluído"}
                aria-pressed={done}
                className={cn(
                  "flex h-9 shrink-0 items-center justify-center gap-1.5 border px-3 font-display text-[10px] font-semibold uppercase tracking-[0.15em] transition",
                  done
                    ? "border-primary bg-primary text-primary-foreground shadow-neon"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{done ? "Concluído" : "Marcar"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
