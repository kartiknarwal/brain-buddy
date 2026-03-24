import { useState } from "react";
import { Bookmark, AISummary } from "@/types/brain";
import { ExternalLink, Trash2, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { updateBookmarkDb } from "@/lib/api";
import { toast } from "sonner";

interface Props {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
  onUpdate?: (id: string, updates: Partial<Bookmark>) => void;
}

export function BookmarkCard({ bookmark, onDelete, onTagClick, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const generateSummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("summarize", {
        body: { url: bookmark.url, title: bookmark.title },
      });
      if (error) throw error;
      const summary: AISummary = data;
      await updateBookmarkDb(bookmark.id, { aiSummary: summary });
      onUpdate?.(bookmark.id, { aiSummary: summary });
      toast.success("Summary generated!");
      toast.success("Summary generated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-hover rounded-xl p-5 flex flex-col gap-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img src={bookmark.favicon} alt="" className="w-5 h-5 rounded flex-shrink-0" />
          <h3 className="font-mono font-semibold text-sm text-foreground truncate">
            {bookmark.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {bookmark.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{bookmark.description}</p>
      )}

      {bookmark.notes && (
        <div className="bg-secondary/50 rounded-lg p-3 border-l-2 border-primary/40">
          <p className="text-xs text-secondary-foreground leading-relaxed line-clamp-3">
            {bookmark.notes}
          </p>
        </div>
      )}

      {/* AI Summary */}
      {bookmark.aiSummary ? (
        <div className="bg-accent/5 rounded-lg p-3 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">AI Summary</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono border ${
              bookmark.aiSummary.difficulty === "Beginner"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : bookmark.aiSummary.difficulty === "Intermediate"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {bookmark.aiSummary.difficulty}
            </span>
          </div>
          <p className="text-xs text-foreground mb-2">{bookmark.aiSummary.summary}</p>
          <ul className="space-y-0.5">
            {bookmark.aiSummary.keyTakeaways.map((t, i) => (
              <li key={i} className="text-[10px] text-secondary-foreground flex items-start gap-1.5">
                <span className="text-accent mt-0.5">▸</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          onClick={generateSummary}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {loading ? "Generating..." : "Generate AI Summary"}
        </button>
      )}

      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {bookmark.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="text-[10px] text-muted-foreground font-mono mt-1">
        {new URL(bookmark.url).hostname}
      </div>
    </motion.div>
  );
}
