import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMOJIS = ["📁", "🚀", "💡", "🧠", "⚡", "🎯", "📚", "🔥", "💻", "🌐"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, emoji: string) => void;
}

export function AddCollectionDialog({ open, onOpenChange, onAdd }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📁");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, emoji);
    setName("");
    setEmoji("📁");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">New Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React Prep"
              className="bg-secondary border-border font-mono text-sm mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Icon</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    emoji === e
                      ? "bg-primary/20 border border-primary/40 scale-110"
                      : "bg-secondary hover:bg-secondary/80 border border-transparent"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground font-mono font-semibold hover:shadow-[var(--neon-glow)] transition-shadow"
          >
            Create Collection
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
