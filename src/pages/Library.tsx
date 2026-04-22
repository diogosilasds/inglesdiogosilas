import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TEXTS } from "@/data/texts";
import { useProgress } from "@/features/progress/progressStore";
import { cn } from "@/lib/utils";

type Filter = "ALL" | "IN_PROGRESS" | "DONE" | "NEW";

const FILTERS: [Filter, string][] = [
  ["ALL", "Todos"],
  ["NEW", "Não iniciados"],
  ["IN_PROGRESS", "Em andamento"],
  ["DONE", "Concluídos"],
];

export default function Library() {
  const { texts, ensureUnlocked } = useProgress();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

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
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6">
      <header className="mb-6 border-l-2 border-primary pl-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          // LIBRARY.IDX
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight">Biblioteca</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {TEXTS.length} textos disponíveis para estudo.
        </p>
      </header>

      {/* Search */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar texto…"
            className="rounded-none border-border bg-card/60 pl-9 font-mono text-sm backdrop-blur-md"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map(([k, label]) => {
          const active = filter === k;
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "border px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.15em] transition",
                active
                  ? "border-primary bg-primary/10 text-primary shadow-neon"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {list.map((t) => {
          const p = texts[t.id];
          const status = p?.status ?? "AVAILABLE";
          return (
            <Link
              key={t.id}
              to={`/texto/${t.id}`}
              onClick={() => ensureUnlocked(t.id)}
              className="group relative flex items-center gap-3 border border-border bg-card/60 p-3 backdrop-blur-md transition hover:border-primary hover:shadow-neon"
            >
              <span className="absolute left-0 top-0 h-px w-6 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background font-display text-xs font-bold tabular-nums text-primary">
                {String(t.id).padStart(3, "0")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-foreground">{t.titleEn}</div>
                <div className="truncate text-xs text-muted-foreground">{t.titlePt || "—"}</div>
              </div>
              {status === "COMPLETED" && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              )}
            </Link>
          );
        })}
        {list.length === 0 && (
          <p className="font-mono text-sm text-muted-foreground sm:col-span-2">
            // Nenhum texto encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
