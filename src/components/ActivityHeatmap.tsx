import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { fetchStats } from "@/lib/api";

export function ActivityHeatmap() {
  const { user } = useAuth();
  const [dailyActivity, setDailyActivity] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    fetchStats(user.id).then((s) => {
      if (s) setDailyActivity(s.dailyActivity || {});
    }).catch(console.error);
  }, [user]);

  const data: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    data.push({ date: key, count: dailyActivity[key] || 0 });
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-secondary";
    if (count <= 2) return "bg-primary/30";
    if (count <= 5) return "bg-primary/60";
    return "bg-primary";
  };

  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];
  data.forEach((d, i) => {
    const day = new Date(d.date).getDay();
    if (day === 0 && i > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(d);
  });
  if (currentWeek.length) weeks.push(currentWeek);

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Activity — Last 90 Days</h3>
      <div className="flex gap-[3px] overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <div className={`w-3 h-3 rounded-[2px] ${getColor(day.count)} transition-colors hover:ring-1 hover:ring-primary/50`} />
                </TooltipTrigger>
                <TooltipContent className="font-mono text-xs">
                  {day.date}: {day.count} action{day.count !== 1 ? "s" : ""}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
