export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  notes: string;
  tags: string[];
  collectionId: string | null;
  aiSummary: string | null;
  favicon: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
}
