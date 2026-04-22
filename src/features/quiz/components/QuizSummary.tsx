import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, Clock, Target, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question, QuestionKind } from "../engine/quizGenerator";

export interface AnswerLog {
  questionId: string;
  kind: QuestionKind;
  correct: boolean;
  pairKey: string;
  timeMs: number;
}

interface Props {
  log: AnswerLog[];
  questions: Question[];
  earnedXp: number;
  stars: number;
  unlockedNext: boolean;
  nextTextId?: number;
  onExit: () => void;
  onRetry: () => void;
}

const KIND_LABEL: Record<QuestionKind, string> = {
  MULTIPLE_CHOICE: "Múltipla",
  GAP_FILL: "Lacuna",
  TRANSLATE_WRITE: "Traduzir",
  WORD_ORDER: "Ordenar",
};

const TOOLTIP_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--primary) / 0.4)",
  borderRadius: 0,
  fontFamily: "Space Grotesk, Inter, sans-serif",
  fontSize: 12,
};

export function QuizSummary({
  log,
  earnedXp,
  stars,
  unlockedNext,
  nextTextId,
  onExit,
  onRetry,
}: Props) {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = log.length;
    const correct = log.filter((l) => l.correct).length;
    const ratio = total ? correct / total : 0;
    const totalTime = log.reduce((s, l) => s + l.timeMs, 0);
    const avgTime = total ? totalTime / total : 0;

    const byKindMap = new Map<QuestionKind, { total: number; correct: number; time: number }>();
    for (const l of log) {
      const cur = byKindMap.get(l.kind) ?? { total: 0, correct: 0, time: 0 };
      cur.total += 1;
      cur.correct += l.correct ? 1 : 0;
      cur.time += l.timeMs;
      byKindMap.set(l.kind, cur);
    }
    const byKind = Array.from(byKindMap.entries()).map(([kind, v]) => ({
      kind: KIND_LABEL[kind],
      accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
      total: v.total,
      correct: v.correct,
      avgTime: v.total ? Math.round(v.time / v.total / 100) / 10 : 0,
    }));

    const radarKinds: QuestionKind[] = [
      "MULTIPLE_CHOICE",
      "GAP_FILL",
      "TRANSLATE_WRITE",
      "WORD_ORDER",
    ];
    const radar = radarKinds.map((k) => {
      const v = byKindMap.get(k);
      return {
        skill: KIND_LABEL[k],
        accuracy: v ? Math.round((v.correct / v.total) * 100) : 0,
      };
    });

    const timeline = log.map((l, i) => ({
      q: i + 1,
      result: l.correct ? 100 : 0,
      time: Math.round(l.timeMs / 100) / 10,
    }));

    const pie = [
      { name: "Acertos", value: correct },
      { name: "Erros", value: total - correct },
    ];

    let maxStreak = 0;
    let cur = 0;
    for (const l of log) {
      if (l.correct) {
        cur += 1;
        maxStreak = Math.max(maxStreak, cur);
      } else {
        cur = 0;
      }
    }

    return { total, correct, ratio, avgTime, byKind, radar, timeline, pie, maxStreak };
  }, [log]);

  const missed = log.filter((l) => !l.correct);
  const status =
    stats.ratio >= 0.9
      ? { label: "EXCELENTE", code: "S+", color: "text-success" }
      : stats.ratio >= 0.7
      ? { label: "MUITO BEM", code: "A", color: "text-primary" }
      : stats.ratio >= 0.5
      ? { label: "EM PROGRESSO", code: "B", color: "text-foreground" }
      : { label: "REVISAR", code: "C", color: "text-destructive" };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6">
      {/* Hero */}
      <div className="relative mb-6 border border-border bg-card/70 p-6 backdrop-blur-md">
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-primary" />
        <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-primary" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-primary" />

        <div className="text-center">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-primary">
            // SESSION_REPORT
          </p>
          <div className={`mt-2 font-display text-6xl font-bold tracking-tight ${status.color}`}>
            {status.code}
          </div>
          <h1 className="mt-2 font-display text-xl font-bold uppercase tracking-[0.25em] text-foreground">
            {status.label}
          </h1>
          {stars > 0 && (
            <div className="mt-3 font-display tabular-nums text-primary">
              {"■".repeat(stars)}
              <span className="opacity-30">{"□".repeat(3 - stars)}</span>
            </div>
          )}
          {unlockedNext && nextTextId && (
            <div className="mt-4 inline-block border border-success bg-success/10 px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-success">
              [✓] Texto {String(nextTextId).padStart(3, "0")} desbloqueado
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Kpi icon={<Target className="h-3.5 w-3.5" />} label="Precisão" value={`${Math.round(stats.ratio * 100)}%`} />
        <Kpi icon={<Award className="h-3.5 w-3.5" />} label="Acertos" value={`${stats.correct}/${stats.total}`} />
        <Kpi icon={<Zap className="h-3.5 w-3.5" />} label="XP" value={`+${earnedXp}`} />
        <Kpi icon={<TrendingUp className="h-3.5 w-3.5" />} label="Sequência" value={`${stats.maxStreak}`} />
      </div>

      {/* Radar + Pie */}
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <ChartCard tag="01" title="Habilidades" subtitle="Precisão (%) por tipo de exercício">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={stats.radar} outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "Space Grotesk" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
              />
              <Radar
                name="Precisão"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard tag="02" title="Acertos vs Erros" subtitle="Distribuição da sessão">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats.pie}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                <Cell fill="hsl(var(--success))" />
                <Cell fill="hsl(var(--destructive))" />
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "Space Grotesk" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bar by kind */}
      {stats.byKind.length > 0 && (
        <ChartCard
          tag="03"
          title="Precisão por tipo"
          subtitle="Onde você brilhou e onde pode melhorar"
          className="mb-4"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.byKind}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="kind"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "Space Grotesk" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => [`${v}%`, "Precisão"]}
              />
              <Bar dataKey="accuracy" radius={[0, 0, 0, 0]}>
                {stats.byKind.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      d.accuracy >= 80
                        ? "hsl(var(--success))"
                        : d.accuracy >= 50
                        ? "hsl(var(--primary))"
                        : "hsl(var(--destructive))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Timeline */}
      <ChartCard
        tag="04"
        title="Linha do tempo"
        subtitle={
          <span className="inline-flex items-center gap-1 font-mono">
            <Clock className="h-3 w-3" />
            tempo médio: {(stats.avgTime / 1000).toFixed(1)}s
          </span>
        }
        className="mb-4"
      >
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stats.timeline}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="q"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number, _n, p) => {
                const payload = (p as { payload?: { time?: number } }).payload;
                const t = payload?.time;
                return [v === 100 ? "Acerto" : "Erro", t !== undefined ? `${t}s` : ""];
              }}
              labelFormatter={(q) => `Questão ${q}`}
            />
            <Bar dataKey="result" radius={[0, 0, 0, 0]}>
              {stats.timeline.map((d, i) => (
                <Cell key={i} fill={d.result === 100 ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Review */}
      {missed.length > 0 && (
        <div className="relative mb-6 border border-border bg-card/70 p-4 backdrop-blur-md">
          <span className="absolute left-0 top-0 h-px w-8 bg-destructive" />
          <h3 className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-destructive">
            // Frases para revisar ({missed.length})
          </h3>
          <ul className="divide-y divide-border text-sm">
            {missed.map((l, i) => (
              <li key={i} className="py-2 text-muted-foreground">
                <span className="mr-2 font-mono text-xs text-destructive">›</span>
                {l.pairKey}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1 rounded-none border-border font-display uppercase tracking-wider hover:border-primary hover:text-primary"
          onClick={onExit}
        >
          Sair
        </Button>
        <Button
          className="flex-1 rounded-none border border-primary bg-primary font-display font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
          onClick={onRetry}
        >
          Refazer
        </Button>
        {unlockedNext && nextTextId && (
          <Button
            className="flex-1 rounded-none border border-success bg-success font-display font-bold uppercase tracking-wider text-success-foreground hover:bg-success/90"
            onClick={() => navigate(`/texto/${nextTextId}`)}
          >
            Próximo ▶
          </Button>
        )}
      </div>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="relative border border-border bg-card/70 p-3 text-center backdrop-blur-md">
      <span className="absolute left-0 top-0 h-px w-6 bg-primary" />
      <div className="mb-1 flex items-center justify-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="font-display text-xl font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function ChartCard({
  tag,
  title,
  subtitle,
  children,
  className,
}: {
  tag: string;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative border border-border bg-card/70 p-4 backdrop-blur-md ${className ?? ""}`}>
      <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
      <div className="mb-3">
        <h3 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-foreground">
          <span className="text-primary">/{tag}</span> {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
