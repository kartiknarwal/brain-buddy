import { motion } from "framer-motion";
import { Flame, Zap, Trophy, Star } from "lucide-react";
import { UserStats, xpProgress } from "@/lib/gamification";
import { Progress } from "@/components/ui/progress";

interface StatsBarProps {
  stats: UserStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const progress = xpProgress(stats);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass neon-border rounded-xl px-5 py-3 flex items-center gap-6 flex-wrap"
    >
      {/* Level & XP */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="font-mono font-bold text-primary text-sm">L{stats.level}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">XP</span>
            <span className="font-mono text-[10px] text-primary">{progress.current}/{progress.needed}</span>
          </div>
          <Progress value={progress.percent} className="h-1.5 bg-secondary" />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-400" />
        <span className="font-mono text-sm font-semibold text-foreground">{stats.streak}</span>
        <span className="font-mono text-[10px] text-muted-foreground">streak</span>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-primary" />
        <span className="font-mono text-sm text-foreground">{stats.xp}</span>
        <span className="font-mono text-[10px] text-muted-foreground">total XP</span>
      </div>

      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-accent" />
        <span className="font-mono text-sm text-foreground">{stats.badges.length}</span>
        <span className="font-mono text-[10px] text-muted-foreground">badges</span>
      </div>

      {/* Recent badges */}
      {stats.badges.length > 0 && (
        <div className="flex items-center gap-1 ml-auto">
          {stats.badges.slice(-3).map((b) => (
            <motion.span
              key={b.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-lg cursor-default"
              title={`${b.name}: ${b.description}`}
            >
              {b.icon}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
