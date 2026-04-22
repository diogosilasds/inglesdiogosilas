import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Map, Shuffle, Menu, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "./Footer";

const items = [
  { to: "/", label: "Início", icon: Home, tag: "00" },
  { to: "/biblioteca", label: "Textos", icon: BookOpen, tag: "01" },
  { to: "/trilha", label: "Trilha", icon: Map, tag: "02" },
  { to: "/quiz-aleatorio", label: "Treino", icon: Shuffle, tag: "03" },
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  const closeMenu = () => setOpen(false);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Top header — desktop nav + mobile hamburger */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/10 text-primary">
              <Terminal className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-sm font-bold uppercase tracking-[0.2em]">
                MV<span className="text-primary">_80</span>
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:block">
                English Practice Terminal
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {items.map(({ to, label, icon: Icon, tag }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2 border px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider transition",
                    isActive
                      ? "border-primary bg-primary/10 text-primary shadow-neon"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                  )
                }
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
                <span className="text-[9px] tracking-[0.15em] opacity-60">/{tag}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile hamburger trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center border border-border bg-card text-foreground transition hover:border-primary hover:text-primary md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="border-t border-border bg-card/95 backdrop-blur md:hidden">
            <nav className="mx-auto flex max-w-5xl flex-col px-4 py-3">
              {items.map(({ to, label, icon: Icon, tag }) => {
                const active =
                  to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center justify-between border-l-2 px-3 py-3 font-display text-sm font-semibold uppercase tracking-wider transition",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] opacity-60">/{tag}</span>
                  </NavLink>
                );
              })}
            </nav>
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
