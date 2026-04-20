import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/features/audio/SpeakButton";
import { useTTS } from "@/features/audio/useTTS";
import { TEXTS } from "@/data/texts";
import { useProgress } from "@/features/progress/progressStore";

export default function TextDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const text = useMemo(() => TEXTS.find((t) => String(t.id) === String(id)), [id]);
  const { ensureUnlocked, texts } = useProgress();
  const { speak, rate, setRate, supported, hasEnglishVoice } = useTTS();
  const [columnsView, setColumnsView] = useState(true);

  useEffect(() => {
    if (text) ensureUnlocked(text.id);
  }, [text, ensureUnlocked]);

  if (!text) {
    return (
      <div className="p-6">
        <p>Texto não encontrado.</p>
        <Button asChild className="mt-3"><Link to="/biblioteca">Voltar</Link></Button>
      </div>
    );
  }

  const p = texts[text.id];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-4 sm:pt-24">
      <div className="mb-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-xs font-medium text-muted-foreground">
          Texto {String(text.id).padStart(3, "0")}
        </span>
      </div>

      <h1 className="text-3xl font-bold leading-tight">{text.titleEn}</h1>
      {text.titlePt && <p className="text-muted-foreground">{text.titlePt}</p>}

      {supported && !hasEnglishVoice && (
        <div className="mt-3 rounded-xl bg-warning-soft p-3 text-xs text-warning-foreground">
          🔇 Não foi possível carregar a voz em inglês do navegador. As questões de áudio ficarão indisponíveis.
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          onClick={() => speak(text.fullEn || text.pairs.map((p) => p.en).join(" "))}
          className="gap-2"
        >
          <Volume2 className="h-4 w-4" /> Ouvir tudo
        </Button>
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1 text-xs">
          {[0.75, 1, 1.25].map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`rounded-md px-2 py-1 ${rate === r ? "bg-card text-foreground shadow-card" : "text-muted-foreground"}`}
            >
              {r}x
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setColumnsView((v) => !v)}
        >
          {columnsView ? "Ver linha a linha" : "Ver em colunas"}
        </Button>
      </div>

      {columnsView && (text.fullEn || text.fullPt) ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl bg-card p-4 shadow-card">
            <h2 className="mb-2 text-xs font-bold uppercase text-primary">English</h2>
            <p className="leading-relaxed">{text.fullEn || text.pairs.map((p) => p.en).join(" ")}</p>
          </article>
          <article className="rounded-2xl bg-card p-4 shadow-card">
            <h2 className="mb-2 text-xs font-bold uppercase text-accent">Português</h2>
            <p className="leading-relaxed">{text.fullPt || text.pairs.map((p) => p.pt).join(" ")}</p>
          </article>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {text.pairs.map((pair, i) => (
            <div key={i} className="rounded-xl bg-card p-3 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{pair.en}</p>
                <SpeakButton text={pair.en} />
              </div>
              <p className="text-sm text-muted-foreground">{pair.pt}</p>
              {pair.note && (
                <p className="mt-1 border-t border-border pt-1 text-xs italic text-muted-foreground">
                  💡 {pair.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {text.focus && (
        <div className="mt-6 rounded-2xl bg-accent-soft p-4 text-sm">
          <h3 className="mb-1 font-bold text-accent">Foco do texto</h3>
          <pre className="whitespace-pre-wrap font-sans text-foreground/80">{text.focus.split("\n").slice(0, 8).join("\n")}</pre>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border bg-background/95 p-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto max-w-3xl">
          <Button
            size="lg"
            className="h-14 w-full gap-2 gradient-primary text-base font-semibold text-primary-foreground shadow-pop"
            onClick={() => navigate(`/quiz/${text.id}`)}
          >
            <Play className="h-5 w-5" /> Começar quiz deste texto
          </Button>
          {p && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Recorde: {p.highScore}% • Tentativas: {p.attempts} • Estrelas: {"⭐".repeat(p.stars)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
