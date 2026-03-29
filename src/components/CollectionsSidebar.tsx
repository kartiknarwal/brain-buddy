import { Collection } from "@/types/brain";
import { FolderOpen, Plus, Trash2, Tag, Layers } from "lucide-react";

interface Props {
  collections: Collection[];
  activeCollection: string | null;
  onSelectCollection: (id: string | null) => void;
  onAddCollection: () => void;
  onDeleteCollection: (id: string) => void;
  allTags: string[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function CollectionsSidebar({
  collections,
  activeCollection,
  onSelectCollection,
  onAddCollection,
  onDeleteCollection,
  allTags,
  activeTag,
  onSelectTag,
}: Props) {
  return (
    <aside className="w-64 border-r border-border/40 bg-sidebar flex flex-col h-screen sticky top-0 overflow-hidden">
      <div className="p-4 flex-1 overflow-auto">
        {/* All */}
        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
          }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm mb-5 transition-all duration-200 ${
            !activeCollection && !activeTag
              ? "glass neon-border text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          <Layers className="h-4 w-4" />
          All Bookmarks
        </button>

        {/* Collections */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Collections
            </span>
            <button
              onClick={onAddCollection}
              className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {collections.length === 0 ? (
            <p className="text-xs text-muted-foreground px-3 py-2 font-light">No collections yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {collections.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm group cursor-pointer transition-all duration-200 ${
                    activeCollection === c.id
                      ? "glass neon-border text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                  onClick={() => onSelectCollection(activeCollection === c.id ? null : c.id)}
                >
                  <span>{c.emoji}</span>
                  <span className="truncate flex-1">{c.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCollection(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3 block">
              Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(activeTag === tag ? null : tag)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 ${
                    activeTag === tag
                      ? "bg-accent/15 text-accent border border-accent/25 neo-raised"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/40"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
