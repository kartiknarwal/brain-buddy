export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  notes: string;
  tags: string[];
  collectionId: string | null;
  aiSummary: AISummary | null;
  favicon: string;
  createdAt: string;
}

export interface AISummary {
  summary: string;
  keyTakeaways: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description: string;
  createdAt: string;
}
