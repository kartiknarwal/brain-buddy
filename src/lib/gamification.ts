const STATS_KEY = "brainvault_stats";

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  totalBookmarks: number;
  totalSnippets: number;
  totalRecalls: number;
  categoriesCovered: string[];
  badges: Badge[];
  dailyActivity: Record<string, number>; // "YYYY-MM-DD" -> count
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

const BADGE_DEFS: { id: string; name: string; description: string; icon: string; check: (s: UserStats) => boolean }[] = [
  { id: "first_save", name: "First Save", description: "Save your first bookmark", icon: "🔖", check: (s) => s.totalBookmarks >= 1 },
  { id: "collector_10", name: "Collector", description: "Save 10 bookmarks", icon: "📚", check: (s) => s.totalBookmarks >= 10 },
  { id: "curator_25", name: "Curator", description: "Save 25 bookmarks", icon: "🏛️", check: (s) => s.totalBookmarks >= 25 },
  { id: "code_warrior", name: "Code Warrior", description: "Save 5 code snippets", icon: "⚔️", check: (s) => s.totalSnippets >= 5 },
  { id: "recall_master", name: "Recall Master", description: "Complete 10 recall sessions", icon: "🧠", check: (s) => s.totalRecalls >= 10 },
  { id: "streak_3", name: "On Fire", description: "3-day streak", icon: "🔥", check: (s) => s.streak >= 3 },
  { id: "streak_7", name: "Unstoppable", description: "7-day streak", icon: "⚡", check: (s) => s.streak >= 7 },
  { id: "streak_30", name: "Legend", description: "30-day streak", icon: "👑", check: (s) => s.streak >= 30 },
  { id: "diverse_5", name: "Explorer", description: "Cover 5 different categories", icon: "🗺️", check: (s) => s.categoriesCovered.length >= 5 },
  { id: "xp_500", name: "Rising Star", description: "Earn 500 XP", icon: "⭐", check: (s) => s.xp >= 500 },
  { id: "xp_2000", name: "Brain Lord", description: "Earn 2000 XP", icon: "💎", check: (s) => s.xp >= 2000 },
];

function defaultStats(): UserStats {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: "",
    totalBookmarks: 0,
    totalSnippets: 0,
    totalRecalls: 0,
    categoriesCovered: [],
    badges: [],
    dailyActivity: {},
  };
}

export function getStats(): UserStats {
  const raw = localStorage.getItem(STATS_KEY);
  return raw ? JSON.parse(raw) : defaultStats();
}

function saveStats(stats: UserStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function calcLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function xpForLevel(level: number): number {
  return (level - 1) * 100;
}

export function xpProgress(stats: UserStats): { current: number; needed: number; percent: number } {
  const currentLevelXp = xpForLevel(stats.level);
  const nextLevelXp = xpForLevel(stats.level + 1);
  const current = stats.xp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  return { current, needed, percent: Math.min((current / needed) * 100, 100) };
}

function updateStreak(stats: UserStats): UserStats {
  const t = today();
  if (stats.lastActiveDate === t) return stats;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak = stats.lastActiveDate === yesterdayStr ? stats.streak + 1 : 1;
  return { ...stats, streak: newStreak, lastActiveDate: t };
}

function checkBadges(stats: UserStats): UserStats {
  const unlockedIds = new Set(stats.badges.map((b) => b.id));
  const newBadges = [...stats.badges];
  for (const def of BADGE_DEFS) {
    if (!unlockedIds.has(def.id) && def.check(stats)) {
      newBadges.push({ id: def.id, name: def.name, description: def.description, icon: def.icon, unlockedAt: new Date().toISOString() });
    }
  }
  return { ...stats, badges: newBadges };
}

function recordActivity(stats: UserStats): UserStats {
  const t = today();
  const daily = { ...stats.dailyActivity };
  daily[t] = (daily[t] || 0) + 1;
  return { ...stats, dailyActivity: daily };
}

export function trackBookmarkAdded(tags: string[]): UserStats {
  let stats = getStats();
  stats.xp += 15;
  stats.totalBookmarks += 1;
  const cats = new Set(stats.categoriesCovered);
  tags.forEach((t) => cats.add(t));
  stats.categoriesCovered = Array.from(cats);
  stats.level = calcLevel(stats.xp);
  stats = updateStreak(stats);
  stats = recordActivity(stats);
  stats = checkBadges(stats);
  saveStats(stats);
  return stats;
}

export function trackSnippetAdded(): UserStats {
  let stats = getStats();
  stats.xp += 10;
  stats.totalSnippets += 1;
  stats.level = calcLevel(stats.xp);
  stats = updateStreak(stats);
  stats = recordActivity(stats);
  stats = checkBadges(stats);
  saveStats(stats);
  return stats;
}

export function trackRecallCompleted(): UserStats {
  let stats = getStats();
  stats.xp += 20;
  stats.totalRecalls += 1;
  stats.level = calcLevel(stats.xp);
  stats = updateStreak(stats);
  stats = recordActivity(stats);
  stats = checkBadges(stats);
  saveStats(stats);
  return stats;
}

export function trackSummaryGenerated(): UserStats {
  let stats = getStats();
  stats.xp += 25;
  stats.level = calcLevel(stats.xp);
  stats = updateStreak(stats);
  stats = recordActivity(stats);
  stats = checkBadges(stats);
  saveStats(stats);
  return stats;
}

export function getActivityHeatmap(): { date: string; count: number }[] {
  const stats = getStats();
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push({ date: key, count: stats.dailyActivity[key] || 0 });
  }
  return result;
}

export function getAllBadgeDefs() {
  return BADGE_DEFS.map((d) => ({ id: d.id, name: d.name, description: d.description, icon: d.icon }));
}
