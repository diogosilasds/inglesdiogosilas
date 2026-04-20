import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, Home, Map, Shuffle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/biblioteca", label: "Textos", icon: BookOpen },
  { to: "/trilha", label: "Trilha", icon: Map },
  { to: "/quiz-aleatorio", label: "Treino", icon: Shuffle },
  { to: "/progresso", label: "Progresso", icon: BarChart3 },
];

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Outlet />
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur sm:top-0 sm:bottom-auto sm:border-b sm:border-t-0">
        <div className="mx-auto flex max-w-3xl items-stretch justify-around">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors sm:flex-row sm:gap-2 sm:py-3 sm:text-sm",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
