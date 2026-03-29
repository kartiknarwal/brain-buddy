import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Brain, Zap, Code2, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, Collection } from "@/types/brain";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { AddCollectionDialog } from "@/components/AddCollectionDialog";
import { CollectionsSidebar } from "@/components/CollectionsSidebar";
import { StatsBar } from "@/components/StatsBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBookmarks, fetchCollections, insertBookmark, deleteBookmarkDb, updateBookmarkDb, insertCollection, deleteCollectionDb, fetchStats, updateStats } from "@/lib/api";
import { UserStats, xpProgress } from "@/lib/gamification";
import { toast } from "sonner";

const defaultStats: UserStats = { xp: 0, level: 1, streak: 0, lastActiveDate: "", totalBookmarks: 0, totalSnippets: 0, totalRecalls: 0, categoriesCovered: [], badges: [], dailyActivity: {} };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [search, setSearch] = useState("");
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  useEffect(() => {
    if (!user) return;
    fetchBookmarks().then(setBookmarks).catch(console.error);
    fetchCollections().then(setCollections).catch(console.error);
    fetchStats(user.id).then((s) => s && setStats(s as UserStats)).catch(console.error);
  }, [user]);

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

  const handleAddBookmark = async (data: Omit<Bookmark, "id" | "createdAt" | "favicon" | "aiSummary">) => {
    if (!user) return;
    try {
      const bookmark = await insertBookmark(user.id, data);
      setBookmarks((prev) => [bookmark, ...prev]);
      const today = new Date().toISOString().split("T")[0];
      const newStats = { ...stats };
      newStats.xp += 15;
      newStats.totalBookmarks += 1;
      newStats.level = Math.floor(newStats.xp / 100) + 1;
      const cats = new Set(newStats.categoriesCovered);
      data.tags.forEach((t) => cats.add(t));
      newStats.categoriesCovered = Array.from(cats);
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      newStats.streak = newStats.lastActiveDate === yesterday.toISOString().split("T")[0] ? newStats.streak + 1 : (newStats.lastActiveDate === today ? newStats.streak : 1);
      newStats.lastActiveDate = today;
      newStats.dailyActivity = { ...newStats.dailyActivity, [today]: (newStats.dailyActivity[today] || 0) + 1 };
      setStats(newStats);
      await updateStats(user.id, newStats);
      setShowAddBookmark(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await deleteBookmarkDb(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateBookmark = async (id: string, updates: Partial<Bookmark>) => {
    try {
      await updateBookmarkDb(id, updates);
      setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddCollection = async (name: string, emoji: string) => {
    if (!user) return;
    try {
      const collection = await insertCollection(user.id, name, emoji);
      setCollections((prev) => [...prev, collection]);
      setShowAddCollection(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteCollectionDb(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
      if (activeCollection === id) setActiveCollection(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/60 glass">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">BrainVault</span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md mx-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 text-sm h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl h-9">
              <User className="h-4 w-4" /> Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/snippets")} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl h-9">
              <Code2 className="h-4 w-4" /> Snippets
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/recall")} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl h-9">
              <Zap className="h-4 w-4" /> Recall
            </Button>
            <Button onClick={() => setShowAddBookmark(true)} className="pill-btn bg-primary text-primary-foreground font-semibold gap-2 h-9 text-xs" size="sm">
              <Plus className="h-4 w-4" /> Add Bookmark
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground rounded-xl" title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <StatsBar stats={stats} />
          </div>

          {(activeCollection || activeTag) && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              {activeCollection && (
                <span className="px-3.5 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15 neo-raised text-xs font-medium">
                  {collections.find((c) => c.id === activeCollection)?.emoji}{" "}
                  {collections.find((c) => c.id === activeCollection)?.name}
                  <button onClick={() => setActiveCollection(null)} className="ml-2 text-muted-foreground hover:text-foreground">×</button>
                </span>
              )}
              {activeTag && (
                <span className="px-3.5 py-1.5 rounded-full bg-accent/8 text-accent border border-accent/15 neo-raised text-xs font-medium">
                  #{activeTag}
                  <button onClick={() => setActiveTag(null)} className="ml-2 text-muted-foreground hover:text-foreground">×</button>
                </span>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5 neo-raised animate-glow-pulse">
                <Brain className="h-9 w-9 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 tracking-tight">
                {bookmarks.length === 0 ? "Your vault is empty" : "No matches found"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm font-light">
                {bookmarks.length === 0 ? "Start building your second brain by adding your first bookmark." : "Try adjusting your search or filters."}
              </p>
              {bookmarks.length === 0 && (
                <Button onClick={() => setShowAddBookmark(true)} className="mt-5 pill-btn bg-primary text-primary-foreground font-semibold gap-2">
                  <Plus className="h-4 w-4" /> Add First Bookmark
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((b) => (
                <BookmarkCard key={b.id} bookmark={b} onDelete={handleDeleteBookmark} onTagClick={setActiveTag} onUpdate={handleUpdateBookmark} />
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
