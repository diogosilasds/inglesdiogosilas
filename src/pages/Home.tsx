import { Link } from "react-router-dom";
import { BookOpen, Map, Shuffle } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-8">
      {/* Editorial hero / front-page lead */}
      <header className="mb-10 border-b border-foreground/80 pb-8 text-center">
        <p className="kicker">Edição especial</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Aprenda inglês lendo, traduzindo e praticando como um leitor atento.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base italic text-muted-foreground sm:text-lg">
          Quiz baseado nos 80 textos com áudio do Mairo Vergara — para brasileiros
          que querem destravar o inglês com profundidade editorial.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>Por The 80 Texts Times</span>
          <span className="h-px w-6 bg-border" />
          <span>Seção: Estudo</span>
        </div>
      </header>

      {/* Three columns — like NYT front page sections */}
      <section className="grid gap-6 md:grid-cols-3 md:gap-8">
        <BigCard
          to="/biblioteca"
          icon={<BookOpen className="h-5 w-5" />}
          kicker="Acervo"
          title="Biblioteca"
          desc="Veja todos os 80 textos disponíveis para leitura e prática."
          n="01"
        />
        <BigCard
          to="/trilha"
          icon={<Map className="h-5 w-5" />}
          kicker="Progresso"
          title="Trilha"
          desc="Marque quais textos você já dominou ao longo da sua jornada."
          n="02"
        />
        <BigCard
          to="/quiz-aleatorio"
          icon={<Shuffle className="h-5 w-5" />}
          kicker="Prática"
          title="Treino rápido"
          desc="Questões aleatórias para fixar vocabulário e tradução."
          n="03"
        />
      </section>
    </div>
  );
}

function BigCard({
  to,
  icon,
  kicker,
  title,
  desc,
  n,
}: {
  to: string;
  icon: React.ReactNode;
  kicker: string;
  title: string;
  desc: string;
  n: string;
}) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col border-t-2 border-foreground bg-card p-5 text-foreground shadow-card transition hover:shadow-pop"
    >
      <div className="flex items-center justify-between">
        <p className="kicker">{kicker}</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          № {n}
        </span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-bold leading-tight group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-2 text-sm italic leading-relaxed text-foreground/75">
        {desc}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground">
        {icon}
        Ler mais →
      </span>
    </Link>
  );
}
