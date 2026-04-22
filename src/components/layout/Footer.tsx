import { ExternalLink, Heart, Terminal } from "lucide-react";
import { useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();
  // Hide on quiz routes for an immersive experience
  if (location.pathname.includes("/quiz")) return null;

  return (
    <footer className="mx-auto mt-16 max-w-5xl px-4 pb-10 pt-8">
      <div className="relative border border-border bg-card/60 p-6 backdrop-blur-md sm:p-8">
        {/* cyber corner brackets */}
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-primary" />
        <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-primary" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-primary" />

        <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            // SYSTEM_INFO
          </span>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <FooterSection tag="01" title="Sobre o projeto">
            Aplicativo de prática de inglês baseado nos 80 textos com áudio do Mairo Vergara.
            Ferramenta complementar de estudo, sem fins lucrativos e independente.
          </FooterSection>

          <FooterSection tag="02" title="Mairo Vergara">
            Professor brasileiro e referência no ensino de inglês para falantes de português.
            Criador do método e do canal Mairo Vergara, com mais de uma década dedicada a ajudar
            brasileiros a destravarem o idioma.
          </FooterSection>

          <div>
            <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-foreground">
              <span className="text-primary">/03</span> Links
            </h3>
            <ul className="space-y-1.5 text-sm">
              <FooterLink href="https://www.mairovergara.com">Site oficial</FooterLink>
              <FooterLink href="https://www.mairovergara.com/category/textos-com-audio/">
                80 textos originais (com áudio)
              </FooterLink>
              <FooterLink href="https://www.mairovergara.com/sobre/">Sobre o autor</FooterLink>
              <FooterLink href="https://www.mairovergara.com/loja/">Curso oficial</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          <p>
            <span className="font-display text-primary">[!]</span> Aviso legal: os textos pertencem aos seus
            autores originais. Este app é uma ferramenta educacional independente de prática e não substitui
            o material original com áudio publicado em mairovergara.com.
          </p>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-display tracking-wider">
            <span>© 2026 — Feito com</span>
            <Heart className="h-3 w-3 fill-destructive text-destructive" />
            <span>para brasileiros aprendendo inglês.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-foreground">
        <span className="text-primary">/{tag}</span> {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 border-b border-transparent text-foreground/90 transition-colors hover:border-primary hover:text-primary"
      >
        <span className="text-primary/60">›</span>
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    </li>
  );
}
