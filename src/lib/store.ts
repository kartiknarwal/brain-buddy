import { Bookmark, Collection, CodeSnippet } from "@/types/brain";

const BOOKMARKS_KEY = "brainvault_bookmarks";
const COLLECTIONS_KEY = "brainvault_collections";
const SNIPPETS_KEY = "brainvault_snippets";

export function getBookmarks(): Bookmark[] {
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveBookmarks(bookmarks: Bookmark[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function addBookmark(bookmark: Bookmark) {
  const all = getBookmarks();
  all.unshift(bookmark);
  saveBookmarks(all);
  return all;
}

export function updateBookmark(id: string, updates: Partial<Bookmark>) {
  const all = getBookmarks().map((b) => (b.id === id ? { ...b, ...updates } : b));
  saveBookmarks(all);
  return all;
}

export function deleteBookmark(id: string) {
  const all = getBookmarks().filter((b) => b.id !== id);
  saveBookmarks(all);
  return all;
}

export function getCollections(): Collection[] {
  const raw = localStorage.getItem(COLLECTIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCollections(collections: Collection[]) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

export function addCollection(collection: Collection) {
  const all = getCollections();
  all.push(collection);
  saveCollections(all);
  return all;
}

export function deleteCollection(id: string) {
  const all = getCollections().filter((c) => c.id !== id);
  saveCollections(all);
  return all;
}

// Code Snippets
export function getSnippets(): CodeSnippet[] {
  const raw = localStorage.getItem(SNIPPETS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveSnippets(snippets: CodeSnippet[]) {
  localStorage.setItem(SNIPPETS_KEY, JSON.stringify(snippets));
}

export function addSnippet(snippet: CodeSnippet) {
  const all = getSnippets();
  all.unshift(snippet);
  saveSnippets(all);
  return all;
}

export function deleteSnippet(id: string) {
  const all = getSnippets().filter((s) => s.id !== id);
  saveSnippets(all);
  return all;
}

export function generateId(): string {
  return crypto.randomUUID();
}
