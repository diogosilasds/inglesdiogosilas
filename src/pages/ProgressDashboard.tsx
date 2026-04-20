import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProgress } from "@/features/progress/progressStore";
import { TEXTS } from "@/data/texts";

export default function ProgressDashboard() {
  const { global, texts, reset } = useProgress();
  const completed = Object.values(texts).filter((t) => t.status === "COMPLETED").length;
  const acc = global.totalAnswered ? Math.round((global.totalCorrect / global.totalAnswered) * 100) : 0;

  // Top missed sentences across all texts
  const missed = Object.entries(texts)
    .flatMap(([tid, p]) =>
      Object.entries(p.mistakes).map(([sentence, count]) => ({ tid: Number(tid), sentence, count })),
    )
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Activity sparkline (last 14 days)
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10);
    const a = global.activity.find((x) => x.date === d);
    return { d, answered: a?.answered ?? 0 };
  });
  const max = Math.max(1, ...days.map((d) => d.answered));

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:pt-24">
      <h1 className="mb-1 text-2xl font-bold">Meu progresso</h1>
      <p className="mb-6 text-sm text-muted-foreground">Suas estatísticas locais (salvas neste navegador).</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card label="XP" value={String(global.xp)} />
        <Card label="Ofensiva" value={`${global.streak}d`} />
        <Card label="Precisão" value={`${acc}%`} />
        <Card label="Concluídos" value={`${completed}/${TEXTS.length}`} />
      </div>

      <section className="mt-6 rounded-2xl bg-card p-4 shadow-card">
        <h2 className="mb-3 text-sm font-semibold">Atividade — 14 dias</h2>
        <div className="flex h-24 items-end gap-1">
          {days.map((d) => (
            <div key={d.d} className="flex-1" title={`${d.d}: ${d.answered}`}>
              <div
                className="w-full rounded-t bg-primary"
                style={{ height: `${(d.answered / max) * 100}%`, minHeight: d.answered ? "4px" : "1px" }}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Total de questões respondidas: {global.totalAnswered}</p>
      </section>

      {missed.length > 0 && (
        <section className="mt-6 rounded-2xl bg-card p-4 shadow-card">
          <h2 className="mb-2 text-sm font-semibold">Frases que você mais errou</h2>
          <ul className="space-y-1 text-sm">
            {missed.map((m) => (
              <li key={`${m.tid}-${m.sentence}`} className="flex items-start justify-between gap-2 border-b border-border py-2 last:border-0">
                <span>{m.sentence}</span>
                <span className="shrink-0 rounded-full bg-destructive-soft px-2 py-0.5 text-xs text-destructive">×{m.count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:text-destructive">Resetar progresso</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar todo o seu progresso?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso vai zerar XP, ofensiva, estrelas, textos concluídos e estatísticas. Não dá para desfazer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => reset()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Resetar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Conteúdo educacional baseado nos textos de{" "}
        <a className="underline" href="https://www.mairovergara.com/category/textos-com-audio/" target="_blank" rel="noreferrer">
          Mairo Vergara
        </a>.
      </p>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 text-center shadow-card">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
