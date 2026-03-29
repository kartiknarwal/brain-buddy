import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronLeft, ChevronRight, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "@/types/brain";
import { fetchBookmarks } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchStats, updateStats } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function RecallMode() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchBookmarks().then((all) => {
      setBookmarks(all.filter((b) => b.notes || b.aiSummary));
    }).catch(console.error);
  }, [user]);

  const trackRecall = useCallback(async () => {
    if (!user) return;
    try {
      const stats = await fetchStats(user.id);
      if (!stats) return;
      const today = new Date().toISOString().split("T")[0];
      stats.xp += 20;
      stats.totalRecalls += 1;
      stats.level = Math.floor(stats.xp / 100) + 1;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      stats.streak = stats.lastActiveDate === yesterday.toISOString().split("T")[0] ? stats.streak + 1 : (stats.lastActiveDate === today ? stats.streak : 1);
      stats.lastActiveDate = today;
      stats.dailyActivity = { ...stats.dailyActivity, [today]: (stats.dailyActivity[today] || 0) + 1 };
      await updateStats(user.id, stats);
    } catch (err) { console.error(err); }
  }, [user]);

  const next = useCallback(() => {
    setFlipped(false);
    setCurrent((prev) => {
      const nextIdx = (prev + 1) % bookmarks.length;
      if (nextIdx === 0 && prev !== 0) trackRecall();
      return nextIdx;
    });
  }, [bookmarks.length, trackRecall]);

  const prev = useCallback(() => {
    setFlipped(false);
    setCurrent((prev) => (prev - 1 + bookmarks.length) % bookmarks.length);
  }, [bookmarks.length]);

  const flip = useCallback(() => setFlipped((f) => !f), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "l") next();
      else if (e.key === "ArrowLeft" || e.key === "h") prev();
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, flip]);

  const bookmark = bookmarks[current];

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] top-[-200px] right-[-100px] bg-primary/6" />
      <div className="orb w-[400px] h-[400px] bottom-[-150px] left-[-100px] bg-accent/6" />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/40 glass">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">Recall Mode</span>
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          {bookmarks.length > 0 ? `${current + 1} / ${bookmarks.length}` : "—"}
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
        {bookmarks.length === 0 ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mx-auto mb-5 neo-raised animate-glow-pulse">
              <Brain className="h-9 w-9 text-primary" />
            </div>
            <h2 className="font-bold text-xl mb-2 tracking-tight">No cards to recall</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5 font-light">
              Add bookmarks with notes or generate AI summaries to use recall mode.
            </p>
            <Button onClick={() => navigate("/dashboard")} className="pill-btn bg-primary text-primary-foreground font-semibold">Go to Dashboard</Button>
          </div>
        ) : bookmark ? (
          <>
            <div className="w-full max-w-xl cursor-pointer" onClick={flip} style={{ perspective: "1000px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${current}-${flipped}`}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="glass holo-shimmer neon-border rounded-3xl p-10 min-h-[340px] flex flex-col justify-center"
                >
                  {!flipped ? (
                    <div className="text-center">
                      <img src={bookmark.favicon} alt="" className="w-8 h-8 rounded-lg mx-auto mb-5" />
                      <h2 className="font-bold text-xl text-foreground mb-3 tracking-tight">{bookmark.title}</h2>
                      {bookmark.description && <p className="text-sm text-muted-foreground mb-4 font-light">{bookmark.description}</p>}
                      {bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-5">
                          {bookmark.tags.map((t) => (
                            <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/8 text-primary border border-primary/15">#{t}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground animate-pulse-neon font-light">Click or press Space to reveal →</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {bookmark.notes && (
                        <div>
                          <h4 className="text-xs text-primary uppercase tracking-wider mb-2 font-medium">Your Notes</h4>
                          <p className="text-sm text-foreground leading-relaxed font-light">{bookmark.notes}</p>
                        </div>
                      )}
                      {bookmark.aiSummary && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-xs text-accent uppercase tracking-wider font-medium">AI Summary</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              bookmark.aiSummary.difficulty === "Beginner" ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : bookmark.aiSummary.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>{bookmark.aiSummary.difficulty}</span>
                          </div>
                          <p className="text-sm text-foreground mb-3 font-light">{bookmark.aiSummary.summary}</p>
                          <ul className="space-y-1.5">
                            {bookmark.aiSummary.keyTakeaways.map((t, i) => (
                              <li key={i} className="text-xs text-secondary-foreground flex items-start gap-2 font-light">
                                <span className="text-primary mt-0.5">▸</span>{t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Button variant="outline" size="icon" onClick={prev} className="border-border/50 text-muted-foreground hover:text-foreground rounded-xl neo-raised">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={flip} className="border-border/50 text-muted-foreground hover:text-foreground rounded-xl gap-2 neo-raised">
                <RotateCcw className="h-4 w-4" /> Flip
              </Button>
              <Button variant="outline" size="icon" onClick={next} className="border-border/50 text-muted-foreground hover:text-foreground rounded-xl neo-raised">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-5 text-[10px] text-muted-foreground font-mono">← → to navigate · Space to flip · h/l vim keys</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
