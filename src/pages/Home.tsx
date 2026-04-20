import { Link } from "react-router-dom";
import { BookOpen, Map, Shuffle, Flame, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/features/progress/progressStore";
import { TEXTS } from "@/data/texts";

export default function Home() {
  const { global, texts } = useProgress();
  const completed = Object.values(texts).filter((t) => t.status === "COMPLETED").length;
  const acc = global.totalAnswered ? Math.round((global.totalCorrect / global.totalAnswered) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-6 pt-6 sm:pt-24">
      <header className="mb-6">
        <p className="text-sm font-medium text-primary">80 textos com áudio</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Aprenda inglês praticando.</h1>
        <p className="mt-1 text-muted-foreground">
          Quiz baseado nos textos do Mairo Vergara — para brasileiros que querem destravar o inglês.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat icon={<Flame className="h-4 w-4 text-warning" />} label="Ofensiva" value={`${global.streak}d`} />
        <Stat icon={<Trophy className="h-4 w-4 text-primary" />} label="XP" value={String(global.xp)} />
        <Stat icon={<BookOpen className="h-4 w-4 text-accent" />} label="Concluídos" value={`${completed}/${TEXTS.length}`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <BigCard
          to="/biblioteca"
          gradient="gradient-primary"
          icon={<BookOpen className="h-7 w-7" />}
          title="Biblioteca"
          desc="Veja todos os textos disponíveis"
        />
        <BigCard
          to="/trilha"
          gradient="gradient-accent"
          icon={<Map className="h-7 w-7" />}
          title="Trilha"
          desc="Avance um texto por vez"
        />
        <BigCard
          to="/quiz-aleatorio"
          gradient="gradient-warm"
          icon={<Shuffle className="h-7 w-7" />}
          title="Treino rápido"
          desc="10 questões aleatórias"
        />
      </div>

      <div className="mt-6 rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-card">
        💡 <strong className="text-foreground">Dica:</strong> abra um texto, leia/ouça, e depois faça o quiz.
        Você precisa de ≥70% de acertos para desbloquear o próximo na trilha. Precisão geral: <strong>{acc}%</strong>.
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center shadow-card">
      <div className="mb-1 flex items-center justify-center gap-1">{icon}</div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function BigCard({
  to, gradient, icon, title, desc,
}: { to: string; gradient: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className={`${gradient} group relative overflow-hidden rounded-2xl p-5 text-primary-foreground shadow-card transition hover:shadow-pop`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm opacity-90">{desc}</p>
    </Link>
  );
}
