import { useState, useEffect } from "react";
import { Plus, Code2, Trash2, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeSnippet } from "@/types/brain";
import { fetchSnippets, insertSnippet, deleteSnippetDb, fetchStats, updateStats } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { AddSnippetDialog } from "@/components/AddSnippetDialog";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const LANG_COLORS: Record<string, string> = {
  javascript: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  typescript: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  python: "bg-green-500/15 text-green-400 border-green-500/20",
  java: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  cpp: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "c++": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  rust: "bg-red-500/15 text-red-400 border-red-500/20",
  go: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  sql: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  html: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  css: "bg-blue-400/15 text-blue-300 border-blue-400/20",
  bash: "bg-green-600/15 text-green-300 border-green-600/20",
  shell: "bg-green-600/15 text-green-300 border-green-600/20",
};

export default function SnippetsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchSnippets().then(setSnippets).catch(console.error);
  }, [user]);

  const filtered = snippets.filter(
    (s) =>
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.language.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (data: Omit<CodeSnippet, "id" | "createdAt">) => {
    if (!user) return;
    try {
      const snippet = await insertSnippet(user.id, data);
      setSnippets((prev) => [snippet, ...prev]);
      try {
        const stats = await fetchStats(user.id);
        if (stats) {
          const today = new Date().toISOString().split("T")[0];
          stats.xp += 10;
          stats.totalSnippets += 1;
          stats.level = Math.floor(stats.xp / 100) + 1;
          stats.dailyActivity = { ...stats.dailyActivity, [today]: (stats.dailyActivity[today] || 0) + 1 };
          await updateStats(user.id, stats);
        }
      } catch {}
      setShowAdd(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSnippetDb(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const langColor = (lang: string) =>
    LANG_COLORS[lang.toLowerCase()] || "bg-muted/50 text-muted-foreground border-border/30";

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] top-[-200px] left-[-150px] bg-accent/5" />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/40 glass">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground gap-1.5 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Code2 className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">Code Vault</span>
        </div>
        <Button onClick={() => setShowAdd(true)} className="pill-btn bg-primary text-primary-foreground font-semibold gap-2 h-9 text-xs" size="sm">
          <Plus className="h-4 w-4" /> Add Snippet
        </Button>
      </header>

      <div className="max-w-4xl mx-auto w-full px-6 py-6 flex-1 relative z-10">
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search snippets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 text-sm h-10 rounded-xl" />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5 neo-raised animate-glow-pulse">
              <Code2 className="h-9 w-9 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2 tracking-tight">{snippets.length === 0 ? "No snippets yet" : "No matches"}</h3>
            <p className="text-muted-foreground text-sm max-w-sm font-light">{snippets.length === 0 ? "Save your go-to code patterns, algorithms, and solutions." : "Try a different search."}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((s) => (
              <motion.div key={s.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-hover holo-shimmer rounded-2xl overflow-hidden group">
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-sm text-foreground tracking-tight">{s.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${langColor(s.language)}`}>{s.language}</span>
                  </div>
                  <button onClick={() => handleDelete(s.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <pre className="px-6 py-5 overflow-x-auto text-xs font-mono text-foreground leading-relaxed"><code>{s.code}</code></pre>
                {s.description && (
                  <div className="px-6 py-3.5 border-t border-border/30">
                    <p className="text-xs text-muted-foreground font-light">{s.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddSnippetDialog open={showAdd} onOpenChange={setShowAdd} onAdd={handleAdd} />
    </div>
  );
}
