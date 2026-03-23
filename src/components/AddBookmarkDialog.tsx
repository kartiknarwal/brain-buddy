import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collection } from "@/types/brain";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { title: string; url: string; description: string; notes: string; tags: string[]; collectionId: string | null }) => void;
  collections: Collection[];
}

export function AddBookmarkDialog({ open, onOpenChange, onAdd, collections }: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [collectionId, setCollectionId] = useState<string>("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    onAdd({
      title,
      url: url.startsWith("http") ? url : `https://${url}`,
      description,
      notes,
      tags,
      collectionId: collectionId === "none" ? null : collectionId,
    });
    setUrl("");
    setTitle("");
    setDescription("");
    setNotes("");
    setTagsInput("");
    setCollectionId("none");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">Add Bookmark</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="text-xs font-mono text-muted-foreground">URL *</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="bg-secondary border-border font-mono text-sm mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title"
              className="bg-secondary border-border font-mono text-sm mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="bg-secondary border-border font-mono text-sm mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Personal Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your insights, key takeaways..."
              className="bg-secondary border-border font-mono text-sm mt-1 min-h-[80px]"
            />
          </div>
          <div>
            <Label className="text-xs font-mono text-muted-foreground">Tags (comma separated)</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, hooks, interview"
              className="bg-secondary border-border font-mono text-sm mt-1"
            />
          </div>
          {collections.length > 0 && (
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Collection</Label>
              <Select value={collectionId} onValueChange={setCollectionId}>
                <SelectTrigger className="bg-secondary border-border font-mono text-sm mt-1">
                  <SelectValue placeholder="No collection" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="none" className="font-mono text-sm">None</SelectItem>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="font-mono text-sm">
                      {c.emoji} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button
            type="submit"
            className="bg-primary text-primary-foreground font-mono font-semibold hover:shadow-[var(--neon-glow)] transition-shadow"
          >
            Save Bookmark
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
