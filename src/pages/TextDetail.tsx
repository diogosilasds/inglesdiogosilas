import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEXTS } from "@/data/texts";
import { useProgress } from "@/features/progress/progressStore";

export default function TextDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const text = useMemo(() => TEXTS.find((t) => String(t.id) === String(id)), [id]);
  const { ensureUnlocked, texts } = useProgress();
  const [columnsView, setColumnsView] = useState(true);

  useEffect(() => {
    if (text) ensureUnlocked(text.id);
  }, [text, ensureUnlocked]);

  if (!text) {
    return (
      <div className="p-6">
        <p className="font-mono text-sm text-muted-foreground">// Texto não encontrado.</p>
        <Button asChild className="mt-3 rounded-none"><Link to="/biblioteca">Voltar</Link></Button>
      </div>
    );
  }

  const p = texts[text.id];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-4">
      <div className="mb-3 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="rounded-none border border-border hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
          // TEXT_{String(text.id).padStart(3, "0")}
        </span>
      </div>

      <header className="border-l-2 border-primary pl-4">
        <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight">
          {text.titleEn}
        </h1>
        {text.titlePt && <p className="mt-1 text-sm text-muted-foreground">{text.titlePt}</p>}
      </header>

      <div className="mt-5 flex justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setColumnsView((v) => !v)}
          className="rounded-none border-border font-display text-[11px] uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
        >
          {columnsView ? "▤ Ver linha a linha" : "▥ Ver em colunas"}
        </Button>
      </div>

      {columnsView && (text.fullEn || text.fullPt) ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <article className="relative border border-border bg-card/70 p-4 backdrop-blur-md">
            <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
            <h2 className="mb-2 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              [EN] English
            </h2>
            <p className="leading-relaxed text-foreground">
              {text.fullEn || text.pairs.map((p) => p.en).join(" ")}
            </p>
          </article>
          <article className="relative border border-border bg-card/70 p-4 backdrop-blur-md">
            <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
            <h2 className="mb-2 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              [PT] Português
            </h2>
            <p className="leading-relaxed text-foreground">
              {text.fullPt || text.pairs.map((p) => p.pt).join(" ")}
            </p>
          </article>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {text.pairs.map((pair, i) => (
            <div
              key={i}
              className="border border-border bg-card/60 p-3 backdrop-blur-md transition hover:border-primary/40"
            >
              <p className="font-medium text-foreground">{pair.en}</p>
              <p className="text-sm text-muted-foreground">{pair.pt}</p>
              {pair.note && (
                <p className="mt-2 border-t border-border pt-2 font-mono text-xs italic text-muted-foreground">
                  // {pair.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {text.focus && (
        <div className="mt-6 border border-primary/40 bg-primary/5 p-4">
          <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">
            ▣ Foco do texto
          </h3>
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/80">
            {text.focus.split("\n").slice(0, 8).join("\n")}
          </pre>
        </div>
      )}

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto max-w-3xl">
          <Button
            size="lg"
            className="h-14 w-full gap-2 rounded-none border border-primary bg-primary font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-neon hover:bg-primary/90"
            onClick={() => navigate(`/quiz/${text.id}`)}
          >
            <Play className="h-5 w-5 fill-current" /> Iniciar quiz
          </Button>
          {p && (
            <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              recorde: {p.highScore}% • tentativas: {p.attempts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
