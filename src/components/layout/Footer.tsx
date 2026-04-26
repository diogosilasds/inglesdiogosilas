import { ExternalLink, Heart } from "lucide-react";
import { useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();
  if (location.pathname.includes("/quiz")) return null;

  return (
    <footer className="mx-auto mt-16 max-w-5xl px-4 pb-12 pt-8">
      <div className="border-t-2 border-foreground pt-8">
        {/* Masthead-style title */}
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-black tracking-tight">
            The 80 Texts Times
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Companion Edition · Mairo Vergara
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <FooterSection kicker="Sobre" title="O projeto">
            Aplicativo de prática de inglês baseado nos 80 textos com áudio do
            Mairo Vergara. Ferramenta complementar de estudo, sem fins lucrativos
            e independente.
          </FooterSection>

          <FooterSection kicker="Perfil" title="Mairo Vergara">
            Professor brasileiro e referência no ensino de inglês para falantes
            de português. Criador do método e do canal Mairo Vergara, com mais de
            uma década dedicada a ajudar brasileiros a destravarem o idioma.
          </FooterSection>

          <div>
            <p className="kicker mb-2">Seções</p>
            <h3 className="mb-3 font-display text-lg font-bold">Links</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink href="https://www.mairovergara.com">
                Site oficial
              </FooterLink>
              <FooterLink href="https://www.mairovergara.com/category/textos-com-audio/">
                80 textos originais (com áudio)
              </FooterLink>
              <FooterLink href="https://www.mairovergara.com/sobre/">
                Sobre o autor
              </FooterLink>
              <FooterLink href="https://www.mairovergara.com/loja/">
                Curso oficial
              </FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-5 text-xs text-muted-foreground">
          <p className="italic">
            Aviso legal: os textos pertencem aos seus autores originais. Este app
            é uma ferramenta educacional independente de prática e não substitui
            o material original com áudio publicado em mairovergara.com.
          </p>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] uppercase tracking-[0.25em]">
            <span>© 2026 — Feito com</span>
            <Heart className="h-3 w-3 fill-accent text-accent" />
            <span>para brasileiros aprendendo inglês.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="kicker mb-2">{kicker}</p>
      <h3 className="mb-3 font-display text-lg font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/80">{children}</p>
    </section>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 border-b border-border pb-0.5 text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    </li>
  );
}
