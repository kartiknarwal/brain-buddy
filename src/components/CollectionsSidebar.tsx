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
    <aside className="w-64 border-r border-border bg-card/50 flex flex-col h-screen sticky top-0 overflow-hidden">
      <div className="p-4 flex-1 overflow-auto">
        {/* All */}
        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm mb-4 transition-colors ${
            !activeCollection && !activeTag
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Layers className="h-4 w-4" />
          All Bookmarks
        </button>

        {/* Collections */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Collections
            </span>
            <button
              onClick={onAddCollection}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {collections.length === 0 ? (
            <p className="text-xs text-muted-foreground px-3 py-2">No collections yet</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {collections.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm group cursor-pointer transition-colors ${
                    activeCollection === c.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
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
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
              Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(activeTag === tag ? null : tag)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors ${
                    activeTag === tag
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
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
