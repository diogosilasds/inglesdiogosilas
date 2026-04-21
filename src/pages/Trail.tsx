import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Play, Star } from "lucide-react";
import { TEXTS } from "@/data/texts";
import { useProgress } from "@/features/progress/progressStore";
import { cn } from "@/lib/utils";

export default function Trail() {
  const { texts, toggleCompleted } = useProgress();
  const completed = TEXTS.filter((t) => texts[t.id]?.status === "COMPLETED").length;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 sm:pt-24">
      <h1 className="mb-1 text-2xl font-bold">Trilha</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Todos os 80 textos estão liberados. Marque cada um como concluído quando terminar.
      </p>

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-3 text-sm backdrop-blur-md">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Progresso</div>
          <div className="font-semibold tabular-nums">
            {completed} / {TEXTS.length} concluídos
          </div>
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full gradient-primary transition-all"
            style={{ width: `${(completed / TEXTS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {TEXTS.map((t) => {
          const p = texts[t.id];
          const done = p?.status === "COMPLETED";
          const num = String(t.id).padStart(2, "0");
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3 transition-all",
                done
                  ? "border-success/60 bg-success-soft/40 shadow-[0_0_24px_hsl(var(--success)/0.15)]"
                  : "border-border bg-card/70 backdrop-blur-md hover:border-primary/60",
              )}
            >
              <button
                type="button"
                onClick={() => toggleCompleted(t.id)}
                aria-label={done ? "Desmarcar como concluído" : "Marcar como concluído"}
                aria-pressed={done}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition",
                  done
                    ? "border-success bg-success text-success-foreground shadow-[0_0_16px_hsl(var(--success)/0.5)]"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>

              <Link to={`/texto/${t.id}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{num}</span>
                  <span className={cn("truncate font-semibold", done && "line-through opacity-70")}>
                    {t.titleEn}
                  </span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{t.titlePt || "—"}</div>
              </Link>

              {p && p.stars > 0 && (
                <div className="hidden items-center text-warning sm:flex">
                  {Array.from({ length: 3 }).map((_, k) => (
                    <Star key={k} className={cn("h-4 w-4", k < p.stars ? "fill-warning" : "opacity-30")} />
                  ))}
                </div>
              )}

              <Link
                to={`/quiz/${t.id}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary transition hover:bg-primary hover:text-primary-foreground"
                aria-label="Iniciar quiz"
              >
                <Play className="h-4 w-4 fill-current" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
