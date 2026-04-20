import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Star, CheckCircle2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TEXTS } from "@/data/texts";
import { useProgress } from "@/features/progress/progressStore";
import { cn } from "@/lib/utils";

type Filter = "ALL" | "IN_PROGRESS" | "DONE" | "NEW";

export default function Library() {
  const { texts, ensureUnlocked } = useProgress();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  // Always allow opening any text from the library (study mode)
  const list = useMemo(() => {
    return TEXTS.filter((t) => {
      const p = texts[t.id];
      if (filter === "DONE" && p?.status !== "COMPLETED") return false;
      if (filter === "IN_PROGRESS" && (!p || p.status === "COMPLETED")) return false;
      if (filter === "NEW" && p) return false;
      if (query && !`${t.titleEn} ${t.titlePt}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [texts, filter, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-6 pt-6 sm:pt-24">
      <h1 className="mb-1 text-2xl font-bold">Biblioteca</h1>
      <p className="mb-4 text-sm text-muted-foreground">{TEXTS.length} textos para você estudar.</p>

      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar texto…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([
          ["ALL", "Todos"],
          ["NEW", "Não iniciados"],
          ["IN_PROGRESS", "Em andamento"],
          ["DONE", "Concluídos"],
        ] as [Filter, string][]).map(([k, label]) => (
          <Button
            key={k}
            size="sm"
            variant={filter === k ? "default" : "outline"}
            onClick={() => setFilter(k)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {list.map((t) => {
          const p = texts[t.id];
          const status = p?.status ?? "AVAILABLE";
          return (
            <Link
              key={t.id}
              to={`/texto/${t.id}`}
              onClick={() => ensureUnlocked(t.id)}
              className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card transition hover:shadow-pop"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
                {String(t.id).padStart(3, "0")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{t.titleEn}</div>
                <div className="truncate text-xs text-muted-foreground">{t.titlePt || "—"}</div>
              </div>
              <div className="flex items-center gap-1">
                {status === "COMPLETED" && <CheckCircle2 className="h-5 w-5 text-success" />}
                {p && p.stars > 0 && (
                  <span className="flex items-center gap-0.5 text-xs">
                    <Star className={cn("h-4 w-4", "fill-warning text-warning")} />
                    {p.stars}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
        {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhum texto encontrado.</p>}
      </div>
    </div>
  );
}
