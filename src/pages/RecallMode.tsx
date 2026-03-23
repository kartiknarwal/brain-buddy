import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronLeft, ChevronRight, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "@/types/brain";
import { getBookmarks } from "@/lib/store";
import { useNavigate } from "react-router-dom";

export default function RecallMode() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const all = getBookmarks().filter((b) => b.notes || b.aiSummary);
    setBookmarks(all);
  }, []);

  const next = useCallback(() => {
    setFlipped(false);
    setCurrent((prev) => (prev + 1) % bookmarks.length);
  }, [bookmarks.length]);

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
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground gap-1 font-mono"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-foreground">Recall Mode</span>
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          {bookmarks.length > 0 ? `${current + 1} / ${bookmarks.length}` : "—"}
        </span>
      </header>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {bookmarks.length === 0 ? (
          <div className="text-center">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse-neon" />
            <h2 className="font-mono font-bold text-xl mb-2">No cards to recall</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
              Add bookmarks with notes or generate AI summaries to use recall mode.
            </p>
            <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground font-mono">
              Go to Dashboard
            </Button>
          </div>
        ) : bookmark ? (
          <>
            <div
              className="w-full max-w-xl perspective-1000 cursor-pointer"
              onClick={flip}
              style={{ perspective: "1000px" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${current}-${flipped}`}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="glass neon-border rounded-2xl p-8 min-h-[320px] flex flex-col justify-center"
                >
                  {!flipped ? (
                    /* Front: Title + URL */
                    <div className="text-center">
                      <img
                        src={bookmark.favicon}
                        alt=""
                        className="w-8 h-8 rounded mx-auto mb-4"
                      />
                      <h2 className="font-mono font-bold text-xl text-foreground mb-3">
                        {bookmark.title}
                      </h2>
                      {bookmark.description && (
                        <p className="text-sm text-muted-foreground mb-4">{bookmark.description}</p>
                      )}
                      {bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                          {bookmark.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground font-mono animate-pulse-neon">
                        Click or press Space to reveal →
                      </p>
                    </div>
                  ) : (
                    /* Back: Notes + AI Summary */
                    <div className="space-y-4">
                      {bookmark.notes && (
                        <div>
                          <h4 className="font-mono text-xs text-primary uppercase tracking-wider mb-2">Your Notes</h4>
                          <p className="text-sm text-foreground leading-relaxed">{bookmark.notes}</p>
                        </div>
                      )}
                      {bookmark.aiSummary && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-mono text-xs text-accent uppercase tracking-wider">AI Summary</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                              bookmark.aiSummary.difficulty === "Beginner"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : bookmark.aiSummary.difficulty === "Intermediate"
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                              {bookmark.aiSummary.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-3">{bookmark.aiSummary.summary}</p>
                          <ul className="space-y-1">
                            {bookmark.aiSummary.keyTakeaways.map((t, i) => (
                              <li key={i} className="text-xs text-secondary-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">▸</span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {!bookmark.notes && !bookmark.aiSummary && (
                        <p className="text-muted-foreground text-sm text-center">No notes or summary available.</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={flip}
                className="border-border text-muted-foreground hover:text-foreground font-mono gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Flip
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <p className="mt-4 text-[10px] text-muted-foreground font-mono">
              ← → to navigate · Space to flip · h/l vim keys
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
