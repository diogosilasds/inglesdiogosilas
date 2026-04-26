import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Map, Shuffle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "./Footer";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/biblioteca", label: "Textos", icon: BookOpen },
  { to: "/trilha", label: "Trilha", icon: Map },
  { to: "/quiz-aleatorio", label: "Treino", icon: Shuffle },
];

function formatToday() {
  try {
    const d = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return d.charAt(0).toUpperCase() + d.slice(1);
  } catch {
    return "";
  }
}

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const today = formatToday();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Editorial masthead */}
      <header className="sticky top-0 z-40 border-b border-foreground/80 bg-background/95 backdrop-blur-sm">
        {/* Top date strip */}
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="hidden sm:inline">{today}</span>
            <span className="sm:hidden">Edição diária</span>
            <span>Edição Brasil · Inglês</span>
          </div>
        </div>

        {/* Masthead */}
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          {/* Mobile hamburger (left) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center border border-border bg-card text-foreground transition hover:border-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            to="/"
            onClick={closeMenu}
            className="mx-auto flex flex-col items-center text-center md:mx-0"
          >
            <span className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
              The 80 Texts Times
            </span>
            <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
              Mairo Vergara · English Practice Edition
            </span>
          </Link>

          {/* Spacer to balance hamburger on mobile */}
          <span className="h-10 w-10 md:hidden" aria-hidden />
        </div>

        {/* Section nav (desktop) */}
        <nav className="hidden border-y border-border md:block">
          <ul className="mx-auto flex max-w-5xl items-center justify-center gap-1 px-4">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] transition",
                      isActive
                        ? "border-accent text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile fullscreen menu overlay */}
        {open && (
          <div className="fixed inset-x-0 bottom-0 top-[97px] z-50 flex flex-col bg-background md:hidden">
            <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
              {items.map(({ to, label, icon: Icon }) => {
                const active =
                  to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center justify-between border-b border-border py-5 font-display text-2xl transition",
                      active ? "text-accent" : "text-foreground hover:text-accent",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {label}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      Seção
                    </span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="border-t border-border px-4 py-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {today}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
