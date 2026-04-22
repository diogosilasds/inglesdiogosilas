import { Link } from "react-router-dom";
import { BookOpen, Map, Shuffle } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-6 pt-6">
      <header className="mb-8 border-l-2 border-primary pl-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          // SYS.MV_80
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Aprenda inglês praticando.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quiz baseado nos textos do Mairo Vergara — para brasileiros que querem destravar o inglês.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <BigCard
          to="/biblioteca"
          icon={<BookOpen className="h-7 w-7" />}
          title="Biblioteca"
          desc="Veja todos os textos disponíveis"
          tag="01"
        />
        <BigCard
          to="/trilha"
          icon={<Map className="h-7 w-7" />}
          title="Trilha"
          desc="Marque seu progresso"
          tag="02"
        />
        <BigCard
          to="/quiz-aleatorio"
          icon={<Shuffle className="h-7 w-7" />}
          title="Treino rápido"
          desc="Questões aleatórias"
          tag="03"
        />
      </div>
    </div>
  );
}

function BigCard({
  to, icon, title, desc, tag,
}: { to: string; icon: React.ReactNode; title: string; desc: string; tag: string }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-md border border-border bg-card p-5 text-foreground shadow-card transition hover:border-primary hover:shadow-neon"
    >
      <span className="absolute right-3 top-3 font-display text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
        /{tag}
      </span>
      <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
      <span className="absolute bottom-0 right-0 h-8 w-px bg-primary/60" />
      <div className="mb-3 text-primary">{icon}</div>
      <h3 className="font-display text-lg font-bold uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
