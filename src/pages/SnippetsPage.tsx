import { useState, useEffect } from "react";
import { Plus, Code2, Trash2, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeSnippet } from "@/types/brain";
import { getSnippets, addSnippet, deleteSnippet, generateId } from "@/lib/store";
import { AddSnippetDialog } from "@/components/AddSnippetDialog";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LANG_COLORS: Record<string, string> = {
  javascript: "bg-yellow-500/20 text-yellow-400",
  typescript: "bg-blue-500/20 text-blue-400",
  python: "bg-green-500/20 text-green-400",
  java: "bg-orange-500/20 text-orange-400",
  cpp: "bg-purple-500/20 text-purple-400",
  "c++": "bg-purple-500/20 text-purple-400",
  rust: "bg-red-500/20 text-red-400",
  go: "bg-cyan-500/20 text-cyan-400",
  sql: "bg-pink-500/20 text-pink-400",
  html: "bg-orange-500/20 text-orange-400",
  css: "bg-blue-400/20 text-blue-300",
  bash: "bg-green-600/20 text-green-300",
  shell: "bg-green-600/20 text-green-300",
};

export default function SnippetsPage() {
  const navigate = useNavigate();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setSnippets(getSnippets());
  }, []);

  const filtered = snippets.filter(
    (s) =>
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.language.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Omit<CodeSnippet, "id" | "createdAt">) => {
    const snippet: CodeSnippet = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSnippets(addSnippet(snippet));
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setSnippets(deleteSnippet(id));
  };

  const langColor = (lang: string) =>
    LANG_COLORS[lang.toLowerCase()] || "bg-muted text-muted-foreground";

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
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
          <Code2 className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-foreground">Code Vault</span>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground font-mono font-semibold gap-2 hover:shadow-[var(--neon-glow)] transition-shadow"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Add Snippet
        </Button>
      </header>

      <div className="max-w-4xl mx-auto w-full px-6 py-6 flex-1">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border font-mono text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <Code2 className="h-12 w-12 text-primary mb-4 animate-pulse-neon" />
            <h3 className="font-mono font-semibold text-lg mb-2">
              {snippets.length === 0 ? "No snippets yet" : "No matches"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {snippets.length === 0
                ? "Save your go-to code patterns, algorithms, and solutions."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-hover rounded-xl overflow-hidden group"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <h3 className="font-mono font-semibold text-sm text-foreground">{s.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${langColor(s.language)}`}>
                      {s.language}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <pre className="px-5 py-4 overflow-x-auto text-xs font-mono text-foreground leading-relaxed">
                  <code>{s.code}</code>
                </pre>
                {s.description && (
                  <div className="px-5 py-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">{s.description}</p>
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
