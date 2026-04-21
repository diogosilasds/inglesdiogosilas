import { ExternalLink, Heart } from "lucide-react";
import { useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();
  // Hide on quiz routes for an immersive experience
  if (location.pathname.includes("/quiz")) return null;

  return (
    <footer className="mx-auto mt-16 max-w-5xl px-4 pb-8 pt-10">
      <div className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-card backdrop-blur-md sm:p-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <section>
            <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
              Sobre o projeto
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aplicativo de prática de inglês baseado nos 80 textos com áudio do Mairo Vergara.
              Ferramenta complementar de estudo, sem fins lucrativos e independente.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
              Mairo Vergara
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Professor brasileiro e referência no ensino de inglês para falantes de português.
              Criador do método e do canal Mairo Vergara, com mais de uma década dedicada a ajudar
              brasileiros a destravarem o idioma.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
              Links úteis
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.mairovergara.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-foreground/90 transition-colors hover:text-primary"
                >
                  Site oficial <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mairovergara.com/category/textos-com-audio/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-foreground/90 transition-colors hover:text-primary"
                >
                  80 textos originais (com áudio) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mairovergara.com/sobre/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-foreground/90 transition-colors hover:text-primary"
                >
                  Sobre o autor <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mairovergara.com/loja/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-foreground/90 transition-colors hover:text-primary"
                >
                  Curso oficial <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <p>
            Aviso legal: os textos pertencem aos seus autores originais. Este app é uma
            ferramenta educacional independente de prática e não substitui o material original
            com áudio publicado em mairovergara.com.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center">
            <span>© 2026 — Feito com</span>
            <Heart className="h-3 w-3 fill-destructive text-destructive" />
            <span>para brasileiros aprendendo inglês.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
