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

export function QuizSummary({
  log,
  questions,
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
    const correctTimes = log.filter((l) => l.correct).map((l) => l.timeMs);
    const avgCorrectTime = correctTimes.length
      ? correctTimes.reduce((s, n) => s + n, 0) / correctTimes.length
      : 0;

    // By kind
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

    // Radar data — fill kinds not present with 0
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

    // Timeline
    const timeline = log.map((l, i) => ({
      q: i + 1,
      result: l.correct ? 100 : 0,
      time: Math.round(l.timeMs / 100) / 10,
    }));

    // Pie
    const pie = [
      { name: "Acertos", value: correct },
      { name: "Erros", value: total - correct },
    ];

    // Streak
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

    return {
      total,
      correct,
      ratio,
      avgTime,
      avgCorrectTime,
      byKind,
      radar,
      timeline,
      pie,
      maxStreak,
    };
  }, [log]);

  const missed = log.filter((l) => !l.correct);
  const trophy = stats.ratio >= 0.9 ? "🏆" : stats.ratio >= 0.7 ? "🎉" : stats.ratio >= 0.5 ? "👍" : "💪";
  const message =
    stats.ratio >= 0.9
      ? "Excelente!"
      : stats.ratio >= 0.7
      ? "Muito bem!"
      : stats.ratio >= 0.5
      ? "Bom começo, continue!"
      : "Bora revisar e tentar de novo!";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <div className="mb-6 rounded-2xl border border-border bg-card/70 p-6 text-center backdrop-blur-md shadow-[0_0_40px_hsl(var(--primary)/0.12)]">
        <div className="text-6xl">{trophy}</div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{message}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumo do seu desempenho</p>
        {stars > 0 && (
          <div className="mt-3 text-2xl">
            {"⭐".repeat(stars)}
            <span className="opacity-30">{"☆".repeat(3 - stars)}</span>
          </div>
        )}
        {unlockedNext && nextTextId && (
          <div className="mt-3 inline-block rounded-xl bg-success-soft px-4 py-2 text-sm text-success">
            🎁 Texto {String(nextTextId).padStart(2, "0")} desbloqueado!
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi icon={<Target className="h-4 w-4 text-primary" />} label="Precisão" value={`${Math.round(stats.ratio * 100)}%`} />
        <Kpi icon={<Award className="h-4 w-4 text-accent" />} label="Acertos" value={`${stats.correct}/${stats.total}`} />
        <Kpi icon={<Zap className="h-4 w-4 text-warning" />} label="XP ganho" value={`+${earnedXp}`} />
        <Kpi icon={<TrendingUp className="h-4 w-4 text-success" />} label="Melhor sequência" value={`${stats.maxStreak}`} />
      </div>

      {/* Radar + Pie */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <ChartCard title="Habilidades" subtitle="Precisão (%) por tipo de exercício">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={stats.radar} outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <Radar
                name="Precisão"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.35}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Acertos vs Erros" subtitle="Distribuição geral da sessão">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats.pie}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                <Cell fill="hsl(var(--success))" />
                <Cell fill="hsl(var(--destructive))" />
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bar by kind */}
      {stats.byKind.length > 0 && (
        <ChartCard title="Precisão por tipo de exercício" subtitle="Onde você brilhou e onde pode melhorar" className="mb-6">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.byKind}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="kind" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
                formatter={(v: number) => [`${v}%`, "Precisão"]}
              />
              <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
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
        title="Linha do tempo"
        subtitle={
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Tempo médio por resposta: {(stats.avgTime / 1000).toFixed(1)}s
          </span>
        }
        className="mb-6"
      >
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stats.timeline}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="q" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
              }}
              formatter={(v: number, _n, p) => {
                const payload = (p as { payload?: { time?: number } }).payload;
                const t = payload?.time;
                return [v === 100 ? "Acerto" : "Erro", t !== undefined ? `${t}s` : ""];
              }}
              labelFormatter={(q) => `Questão ${q}`}
            />
            <Bar dataKey="result" radius={[6, 6, 0, 0]}>
              {stats.timeline.map((d, i) => (
                <Cell key={i} fill={d.result === 100 ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Review */}
      {missed.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-md">
          <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Frases para revisar ({missed.length})
          </h3>
          <ul className="space-y-1 text-sm">
            {missed.map((l, i) => (
              <li key={i} className="border-b border-border/60 py-2 last:border-0 text-muted-foreground">
                • {l.pairKey}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1" onClick={onExit}>
          Sair
        </Button>
        <Button className="flex-1 gradient-primary text-primary-foreground" onClick={onRetry}>
          Refazer
        </Button>
        {unlockedNext && nextTextId && (
          <Button className="flex-1" onClick={() => navigate(`/texto/${nextTextId}`)}>
            Próximo texto
          </Button>
        )}
      </div>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-3 text-center backdrop-blur-md">
      <div className="mb-1 flex items-center justify-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-md ${className ?? ""}`}>
      <div className="mb-3">
        <h3 className="font-display text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
