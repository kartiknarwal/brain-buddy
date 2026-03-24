import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Bookmark, Code2, Zap, Trophy, Flame, Star, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { getStats, xpProgress, getAllBadgeDefs, getActivityHeatmap, UserStats } from "@/lib/gamification";
import { getBookmarks, getCollections, getSnippets } from "@/lib/store";
import { Collection } from "@/types/brain";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MOTIVATIONAL_QUOTES = [
  "Knowledge compounds. Keep stacking. 🧱",
  "Your second brain is getting stronger. 🧠",
  "Every bookmark is a seed of mastery. 🌱",
  "Consistency beats intensity. Stay on track. 🏃",
  "The best developers never stop learning. 📖",
  "Build, save, recall, repeat. 🔄",
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>(getStats());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [copied, setCopied] = useState(false);
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    setStats(getStats());
    setCollections(getCollections());
  }, []);

  const progress = xpProgress(stats);
  const allBadges = getAllBadgeDefs();
  const unlockedIds = new Set(stats.badges.map((b) => b.id));
  const bookmarkCount = getBookmarks().length;
  const snippetCount = getSnippets().length;

  const handleShare = () => {
    const text = `🧠 BrainVault Stats\n⭐ Level ${stats.level} • ${stats.xp} XP\n🔥 ${stats.streak}-day streak\n📌 ${bookmarkCount} bookmarks • 💻 ${snippetCount} snippets\n🏆 ${stats.badges.length} badges unlocked`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="text-muted-foreground hover:text-foreground gap-1 font-mono"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-foreground">Profile</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="border-border text-muted-foreground hover:text-foreground font-mono gap-1.5"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Copied!" : "Share Stats"}
        </Button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass neon-border rounded-2xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-3xl font-mono font-bold text-primary">L{stats.level}</span>
            </motion.div>
            <h1 className="font-mono font-bold text-2xl text-foreground mb-1">Brain Vault User</h1>
            <p className="text-sm text-muted-foreground font-mono italic mb-6">{quote}</p>

            {/* XP bar */}
            <div className="max-w-sm mx-auto">
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-muted-foreground">Level {stats.level}</span>
                <span className="font-mono text-xs text-primary">{progress.current} / {progress.needed} XP</span>
              </div>
              <Progress value={progress.percent} className="h-2 bg-secondary" />
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Star, label: "Total XP", value: stats.xp, color: "text-primary" },
            { icon: Flame, label: "Day Streak", value: stats.streak, color: "text-orange-400" },
            { icon: Bookmark, label: "Bookmarks", value: bookmarkCount, color: "text-accent" },
            { icon: Code2, label: "Snippets", value: snippetCount, color: "text-purple-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass rounded-xl p-5 text-center"
            >
              <s.icon className={`h-6 w-6 ${s.color} mx-auto mb-2`} />
              <div className="font-mono font-bold text-2xl text-foreground">{s.value}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Activity heatmap */}
        <ActivityHeatmap />

        {/* Badges */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-accent" />
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Badges ({stats.badges.length}/{allBadges.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allBadges.map((badge) => {
              const unlocked = unlockedIds.has(badge.id);
              return (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`rounded-lg p-4 text-center transition-all ${
                        unlocked
                          ? "glass neon-border"
                          : "bg-secondary/30 opacity-40 grayscale"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{badge.icon}</span>
                      <span className="font-mono text-xs text-foreground block">{badge.name}</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="font-mono text-xs">
                    {badge.description}
                    {unlocked && " ✅"}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Public Collections */}
        {collections.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
              📂 Learning Paths
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collections.map((c) => {
                const count = getBookmarks().filter((b) => b.collectionId === c.id).length;
                return (
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.02 }}
                    className="glass-hover rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.emoji}</span>
                      <span className="font-mono text-sm text-foreground">{c.name}</span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {count} link{count !== 1 ? "s" : ""}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories covered */}
        {stats.categoriesCovered.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
              🗺️ Categories Explored
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.categoriesCovered.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20"
                >
                  #{cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
