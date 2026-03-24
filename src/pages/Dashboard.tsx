import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Brain, Zap, Code2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, Collection } from "@/types/brain";
import { getBookmarks, getCollections, addBookmark, deleteBookmark, updateBookmark as updateBookmarkStore, addCollection, deleteCollection, generateId } from "@/lib/store";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { AddCollectionDialog } from "@/components/AddCollectionDialog";
import { CollectionsSidebar } from "@/components/CollectionsSidebar";
import { StatsBar } from "@/components/StatsBar";
import { useNavigate } from "react-router-dom";
import { getStats, trackBookmarkAdded, UserStats } from "@/lib/gamification";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [search, setSearch] = useState("");
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [stats, setStats] = useState<UserStats>(getStats());

  useEffect(() => {
    setBookmarks(getBookmarks());
    setCollections(getCollections());
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [bookmarks]);

  const filtered = useMemo(() => {
    return bookmarks.filter((b) => {
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.notes.toLowerCase().includes(search.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCollection = !activeCollection || b.collectionId === activeCollection;
      const matchTag = !activeTag || b.tags.includes(activeTag);
      return matchSearch && matchCollection && matchTag;
    });
  }, [bookmarks, search, activeCollection, activeTag]);

  const handleAddBookmark = (data: Omit<Bookmark, "id" | "createdAt" | "favicon" | "aiSummary">) => {
    const bookmark: Bookmark = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(data.url).hostname}&sz=32`,
      aiSummary: null,
    };
    setBookmarks(addBookmark(bookmark));
    setStats(trackBookmarkAdded(data.tags));
    setShowAddBookmark(false);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(deleteBookmark(id));
  };

  const handleUpdateBookmark = (id: string, updates: Partial<Bookmark>) => {
    setBookmarks(updateBookmarkStore(id, updates));
  };

  const handleAddCollection = (name: string, emoji: string) => {
    const collection: Collection = { id: generateId(), name, emoji, createdAt: new Date().toISOString() };
    setCollections(addCollection(collection));
    setShowAddCollection(false);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(deleteCollection(id));
    if (activeCollection === id) setActiveCollection(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <CollectionsSidebar
        collections={collections}
        activeCollection={activeCollection}
        onSelectCollection={setActiveCollection}
        onAddCollection={() => setShowAddCollection(true)}
        onDeleteCollection={handleDeleteCollection}
        allTags={allTags}
        activeTag={activeTag}
        onSelectTag={setActiveTag}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-mono font-bold text-foreground">BrainVault</span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md mx-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary border-border font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile")}
              className="border-border text-muted-foreground hover:text-foreground font-mono gap-1.5"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/snippets")}
              className="border-border text-muted-foreground hover:text-foreground font-mono gap-1.5"
            >
              <Code2 className="h-4 w-4" />
              Snippets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/recall")}
              className="border-border text-muted-foreground hover:text-foreground font-mono gap-1.5"
            >
              <Zap className="h-4 w-4" />
              Recall
            </Button>
            <Button
              onClick={() => setShowAddBookmark(true)}
              className="bg-primary text-primary-foreground font-mono font-semibold gap-2 hover:shadow-[var(--neon-glow)] transition-shadow"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add Bookmark
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <StatsBar stats={stats} />
          </div>
          {(activeCollection || activeTag) && (
            <div className="flex items-center gap-2 mb-4 font-mono text-sm">
              {activeCollection && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {collections.find((c) => c.id === activeCollection)?.emoji}{" "}
                  {collections.find((c) => c.id === activeCollection)?.name}
                  <button onClick={() => setActiveCollection(null)} className="ml-2 text-muted-foreground hover:text-foreground">×</button>
                </span>
              )}
              {activeTag && (
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                  #{activeTag}
                  <button onClick={() => setActiveTag(null)} className="ml-2 text-muted-foreground hover:text-foreground">×</button>
                </span>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-primary animate-pulse-neon" />
              </div>
              <h3 className="font-mono font-semibold text-lg mb-2">
                {bookmarks.length === 0 ? "Your vault is empty" : "No matches found"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {bookmarks.length === 0
                  ? "Start building your second brain by adding your first bookmark."
                  : "Try adjusting your search or filters."}
              </p>
              {bookmarks.length === 0 && (
                <Button onClick={() => setShowAddBookmark(true)} className="mt-4 bg-primary text-primary-foreground font-mono gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Bookmark
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((b) => (
                <BookmarkCard
                  key={b.id}
                  bookmark={b}
                  onDelete={handleDeleteBookmark}
                  onTagClick={setActiveTag}
                  onUpdate={handleUpdateBookmark}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddBookmarkDialog open={showAddBookmark} onOpenChange={setShowAddBookmark} onAdd={handleAddBookmark} collections={collections} />
      <AddCollectionDialog open={showAddCollection} onOpenChange={setShowAddCollection} onAdd={handleAddCollection} />
    </div>
  );
}
