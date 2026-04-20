import { Link } from "react-router-dom";
import { Lock, Star, CheckCircle2 } from "lucide-react";
import { TEXTS } from "@/data/texts";
import { useProgress } from "@/features/progress/progressStore";
import { cn } from "@/lib/utils";

export default function Trail() {
  const { texts } = useProgress();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 sm:pt-24">
      <h1 className="mb-1 text-2xl font-bold">Trilha</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Conclua cada texto com ≥70% para desbloquear o próximo.
      </p>

      <div className="space-y-3">
        {TEXTS.map((t, i) => {
          const p = texts[t.id];
          // First text is always available; otherwise need previous COMPLETED or already unlocked
          const prev = i > 0 ? texts[TEXTS[i - 1].id] : undefined;
          const unlocked = i === 0 || !!p || prev?.status === "COMPLETED";
          const done = p?.status === "COMPLETED";
          const align = i % 2 === 0 ? "self-start" : "self-end";
          return (
            <div key={t.id} className={cn("flex w-full", i % 2 === 0 ? "justify-start" : "justify-end")}>
              <Link
                to={unlocked ? `/texto/${t.id}` : "#"}
                onClick={(e) => !unlocked && e.preventDefault()}
                className={cn(
                  "flex w-full max-w-md items-center gap-3 rounded-2xl border-2 p-4 shadow-card transition",
                  align,
                  done && "border-success bg-success-soft",
                  !done && unlocked && "border-primary bg-card hover:shadow-pop",
                  !unlocked && "cursor-not-allowed border-border bg-muted opacity-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    done && "bg-success text-success-foreground",
                    !done && unlocked && "gradient-primary text-primary-foreground",
                    !unlocked && "bg-muted-foreground/20 text-muted-foreground",
                  )}
                >
                  {!unlocked ? <Lock className="h-5 w-5" /> : done ? <CheckCircle2 className="h-5 w-5" /> : String(t.id).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{t.titleEn}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.titlePt || "—"}</div>
                </div>
                {p && p.stars > 0 && (
                  <div className="flex items-center text-warning">
                    {Array.from({ length: 3 }).map((_, k) => (
                      <Star key={k} className={cn("h-4 w-4", k < p.stars ? "fill-warning" : "opacity-30")} />
                    ))}
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
