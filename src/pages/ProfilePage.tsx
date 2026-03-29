import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Bookmark as BookmarkIcon, Code2, Trophy, Flame, Star, Share2, Copy, Check, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchStats, fetchProfile, updateProfile, fetchBookmarks, fetchCollections } from "@/lib/api";
import { xpProgress, getAllBadgeDefs, UserStats } from "@/lib/gamification";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Collection } from "@/types/brain";

const MOTIVATIONAL_QUOTES = [
  "Knowledge compounds. Keep stacking. 🧱",
  "Your second brain is getting stronger. 🧠",
  "Every bookmark is a seed of mastery. 🌱",
  "Consistency beats intensity. Stay on track. 🏃",
  "The best developers never stop learning. 📖",
];

const defaultStats: UserStats = { xp: 0, level: 1, streak: 0, lastActiveDate: "", totalBookmarks: 0, totalSnippets: 0, totalRecalls: 0, categoriesCovered: [], badges: [], dailyActivity: {} };

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [profile, setProfile] = useState<any>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [snippetCount, setSnippetCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    if (!user) return;
    fetchStats(user.id).then((s) => s && setStats(s as UserStats)).catch(console.error);
    fetchProfile(user.id).then((p) => {
      setProfile(p);
      setUsername(p?.username || "");
      setDisplayName(p?.display_name || "");
      setBio(p?.bio || "");
      setIsPublic(p?.is_public || false);
    }).catch(console.error);
    fetchBookmarks().then((b) => setBookmarkCount(b.length)).catch(console.error);
    fetchCollections().then(setCollections).catch(console.error);
  }, [user]);

  const progress = xpProgress(stats);
  const allBadges = getAllBadgeDefs();
  const unlockedIds = new Set(stats.badges.map((b: any) => b.id));

  const handleShare = () => {
    const shareUrl = profile?.username ? `${window.location.origin}/u/${profile.username}` : "";
    const text = `🧠 BrainVault Stats\n⭐ Level ${stats.level} • ${stats.xp} XP\n🔥 ${stats.streak}-day streak\n📌 ${bookmarkCount} bookmarks\n🏆 ${stats.badges.length} badges\n${shareUrl ? `\n🔗 ${shareUrl}` : ""}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user.id, { username, display_name: displayName, bio, is_public: isPublic });
      setProfile({ ...profile, username, display_name: displayName, bio, is_public: isPublic });
      setEditingProfile(false);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] top-[-200px] right-[-100px] bg-primary/5" />
      <div className="orb w-[400px] h-[400px] bottom-[-150px] left-[-100px] bg-accent/5" />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/40 glass">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">Profile</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditingProfile(!editingProfile)} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl">
            <Settings className="h-4 w-4" /> {editingProfile ? "Cancel" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl">
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share"}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-7 relative z-10">
        {/* Profile edit section */}
        {editingProfile && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass neon-border rounded-2xl p-7 space-y-5">
            <h3 className="text-sm font-semibold text-foreground">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-secondary/50 border-border/50 text-sm mt-1.5 h-11 rounded-xl" placeholder="your_username" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-secondary/50 border-border/50 text-sm mt-1.5 h-11 rounded-xl" placeholder="Your Name" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Bio</label>
              <Input value={bio} onChange={(e) => setBio(e.target.value)} className="bg-secondary/50 border-border/50 text-sm mt-1.5 h-11 rounded-xl" placeholder="A short bio about yourself..." />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Public Profile</span>
                <span className="text-xs text-muted-foreground font-light">(anyone can view your collections & stats)</span>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
            {isPublic && username && (
              <p className="text-xs text-primary font-mono">🔗 Public URL: {window.location.origin}/u/{username}</p>
            )}
            <Button onClick={handleSaveProfile} className="pill-btn bg-primary text-primary-foreground font-semibold">Save Changes</Button>
          </motion.div>
        )}

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass holo-shimmer neon-border rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/25 flex items-center justify-center mx-auto mb-5 neo-raised animate-glow-pulse">
              <span className="text-3xl font-mono font-bold text-primary">L{stats.level}</span>
            </motion.div>
            <h1 className="font-bold text-2xl text-foreground mb-1 tracking-tight">{profile?.display_name || "Brain Vault User"}</h1>
            {profile?.username && <p className="text-xs text-muted-foreground font-mono mb-1">@{profile.username}</p>}
            <p className="text-sm text-muted-foreground italic mb-7 font-light">{bio || quote}</p>
            <div className="max-w-sm mx-auto">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-muted-foreground font-medium">Level {stats.level}</span>
                <span className="text-xs text-primary font-mono">{progress.current} / {progress.needed} XP</span>
              </div>
              <Progress value={progress.percent} className="h-2 bg-secondary/60 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Star, label: "Total XP", value: stats.xp, color: "text-primary", bg: "bg-primary/10 border-primary/15" },
            { icon: Flame, label: "Day Streak", value: stats.streak, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/15" },
            { icon: BookmarkIcon, label: "Bookmarks", value: bookmarkCount, color: "text-accent", bg: "bg-accent/10 border-accent/15" },
            { icon: Code2, label: "Snippets", value: snippetCount, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/15" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass rounded-2xl p-6 text-center">
              <div className={`w-10 h-10 rounded-xl ${s.bg} border flex items-center justify-center mx-auto mb-3`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="font-bold text-2xl text-foreground">{s.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <ActivityHeatmap />

        {/* Badges */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Badges ({stats.badges.length}/{allBadges.length})</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allBadges.map((badge) => {
              const unlocked = unlockedIds.has(badge.id);
              return (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} className={`rounded-xl p-4 text-center transition-all ${unlocked ? "glass neon-border" : "bg-secondary/20 opacity-30 grayscale"}`}>
                      <span className="text-2xl block mb-2">{badge.icon}</span>
                      <span className="text-xs text-foreground block font-medium">{badge.name}</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">{badge.description}{unlocked && " ✅"}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Collections */}
        {collections.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-5">📂 Learning Paths</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collections.map((c) => (
                <motion.div key={c.id} whileHover={{ scale: 1.02 }} className="glass-hover rounded-xl px-5 py-3.5 flex items-center justify-between cursor-pointer" onClick={() => navigate("/dashboard")}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.emoji}</span>
                    <span className="text-sm text-foreground font-medium">{c.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {stats.categoriesCovered.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-5">🗺️ Categories Explored</h3>
            <div className="flex flex-wrap gap-2">
              {stats.categoriesCovered.map((cat: string) => (
                <span key={cat} className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15">#{cat}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
