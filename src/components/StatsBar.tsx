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
      className="glass holo-shimmer neon-border rounded-2xl px-6 py-4 flex items-center gap-7 flex-wrap"
    >
      {/* Level & XP */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center neo-raised">
          <span className="font-mono font-bold text-primary text-sm">L{stats.level}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">XP</span>
            <span className="text-[10px] text-primary font-mono">{progress.current}/{progress.needed}</span>
          </div>
          <Progress value={progress.percent} className="h-1.5 bg-secondary/60 rounded-full" />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
          <Flame className="h-4 w-4 text-orange-400" />
        </div>
        <div>
          <span className="font-semibold text-sm text-foreground block leading-tight">{stats.streak}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">streak</span>
        </div>
      </div>

      {/* XP */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
          <Star className="h-4 w-4 text-primary" />
        </div>
        <div>
          <span className="font-semibold text-sm text-foreground block leading-tight">{stats.xp}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">total XP</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center">
          <Trophy className="h-4 w-4 text-accent" />
        </div>
        <div>
          <span className="font-semibold text-sm text-foreground block leading-tight">{stats.badges.length}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">badges</span>
        </div>
      </div>

      {/* Recent badges */}
      {stats.badges.length > 0 && (
        <div className="flex items-center gap-1.5 ml-auto">
          {stats.badges.slice(-3).map((b) => (
            <motion.span
              key={b.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-lg cursor-default w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center"
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
