import { Bookmark } from "@/types/brain";
import { ExternalLink, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export function BookmarkCard({ bookmark, onDelete, onTagClick }: Props) {
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
