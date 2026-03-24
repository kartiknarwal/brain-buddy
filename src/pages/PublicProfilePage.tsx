import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Bookmark as BookmarkIcon, Code2, Trophy, Flame, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { fetchProfileByUsername, fetchPublicBookmarks, fetchPublicCollections, fetchPublicStats } from "@/lib/api";
import { xpProgress, getAllBadgeDefs, UserStats } from "@/lib/gamification";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collection } from "@/types/brain";

const defaultStats: UserStats = { xp: 0, level: 1, streak: 0, lastActiveDate: "", totalBookmarks: 0, totalSnippets: 0, totalRecalls: 0, categoriesCovered: [], badges: [], dailyActivity: {} };

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetchProfileByUsername(username)
      .then(async (p) => {
        setProfile(p);
        const [statsData, bookmarks, cols] = await Promise.all([
          fetchPublicStats(p.id),
          fetchPublicBookmarks(p.id),
          fetchPublicCollections(p.id),
        ]);
        if (statsData) setStats(statsData as UserStats);
        setBookmarkCount(bookmarks.length);
        setCollections(cols);
        setLoading(false);
      })
      .catch(() => {
        setError("Profile not found or is private.");
        setLoading(false);
      });
  }, [username]);

  const progress = xpProgress(stats);
  const allBadges = getAllBadgeDefs();
  const unlockedIds = new Set(stats.badges.map((b: any) => b.id));
  const unlockedBadges = allBadges.filter((b) => unlockedIds.has(b.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
        <Brain className="h-12 w-12 text-primary animate-pulse-neon" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-mono font-bold text-xl text-foreground mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <header className="flex items-center justify-center px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-foreground">BrainVault</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass neon-border rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-mono font-bold text-primary">L{stats.level}</span>
            </div>
            <h1 className="font-mono font-bold text-2xl text-foreground mb-1">{profile.display_name}</h1>
            <p className="text-xs text-muted-foreground font-mono mb-1">@{profile.username}</p>
            {profile.bio && <p className="text-sm text-muted-foreground font-mono italic mb-4">{profile.bio}</p>}
            <div className="max-w-sm mx-auto">
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-muted-foreground">Level {stats.level}</span>
                <span className="font-mono text-xs text-primary">{stats.xp} XP</span>
              </div>
              <Progress value={progress.percent} className="h-2 bg-secondary" />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Star, label: "Total XP", value: stats.xp, color: "text-primary" },
            { icon: Flame, label: "Day Streak", value: stats.streak, color: "text-orange-400" },
            { icon: BookmarkIcon, label: "Bookmarks", value: bookmarkCount, color: "text-accent" },
            { icon: Trophy, label: "Badges", value: stats.badges.length, color: "text-purple-400" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass rounded-xl p-5 text-center">
              <s.icon className={`h-6 w-6 ${s.color} mx-auto mb-2`} />
              <div className="font-mono font-bold text-2xl text-foreground">{s.value}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        {unlockedBadges.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">🏆 Badges</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {unlockedBadges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div className="glass neon-border rounded-lg p-4 text-center">
                      <span className="text-2xl block mb-2">{badge.icon}</span>
                      <span className="font-mono text-xs text-foreground block">{badge.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="font-mono text-xs">{badge.description}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Collections */}
        {collections.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">📂 Learning Paths</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collections.map((c) => (
                <div key={c.id} className="glass-hover rounded-lg px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">{c.emoji}</span>
                  <span className="font-mono text-sm text-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.categoriesCovered.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">🗺️ Categories</h3>
            <div className="flex flex-wrap gap-2">
              {stats.categoriesCovered.map((cat: string) => (
                <span key={cat} className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20">#{cat}</span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground font-mono">Powered by <span className="text-primary">BrainVault</span></p>
        </div>
      </div>
    </div>
  );
}
