import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeSnippet } from "@/types/brain";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "Rust", "Go",
  "SQL", "HTML", "CSS", "Bash", "Shell", "C", "Ruby", "PHP", "Swift", "Kotlin", "Other"
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: Omit<CodeSnippet, "id" | "createdAt">) => void;
}

export function AddSnippetDialog({ open, onOpenChange, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;
    onAdd({ title, code, language, description });
    setTitle("");
    setCode("");
    setLanguage("JavaScript");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">Add Code Snippet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Binary Search" className="bg-secondary border-border font-mono text-sm mt-1" required />
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-secondary border-border font-mono text-sm mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l} className="font-mono text-sm">{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Code *</Label>
            <Textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..." className="bg-secondary border-border font-mono text-xs mt-1 min-h-[150px]" required />
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Explanation</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="How it works, when to use it..." className="bg-secondary border-border font-mono text-sm mt-1 min-h-[60px]" />
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground font-mono font-semibold hover:shadow-[var(--neon-glow)] transition-shadow">
            Save Snippet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
