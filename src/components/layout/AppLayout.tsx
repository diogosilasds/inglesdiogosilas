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

        {/* Mobile fullscreen menu overlay */}
        {open && (
          <div className="fixed inset-x-0 bottom-0 top-[57px] z-50 flex flex-col bg-background/98 backdrop-blur-xl md:hidden">
            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-6">
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
                      "group relative flex items-center justify-between border px-4 py-5 font-display text-base font-semibold uppercase tracking-wider transition",
                      active
                        ? "border-primary bg-primary/10 text-primary shadow-neon"
                        : "border-border bg-card/40 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-primary" />
                    <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-primary" />
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {label}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-warning opacity-80">/{tag}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="border-t border-border px-4 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // mv_80 :: end_of_menu
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
