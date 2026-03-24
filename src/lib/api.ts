import { supabase } from "@/integrations/supabase/client";
import { Bookmark, Collection, CodeSnippet, AISummary } from "@/types/brain";

// ─── Bookmarks ───
export async function fetchBookmarks(): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapBookmark);
}

export async function fetchPublicBookmarks(userId: string): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapBookmark);
}

function mapBookmark(row: any): Bookmark {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description || "",
    notes: row.notes || "",
    tags: row.tags || [],
    collectionId: row.collection_id,
    aiSummary: row.ai_summary as AISummary | null,
    favicon: row.favicon || "",
    createdAt: row.created_at,
  };
}

export async function insertBookmark(
  userId: string,
  data: Omit<Bookmark, "id" | "createdAt" | "favicon" | "aiSummary">
): Promise<Bookmark> {
  const favicon = (() => {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(data.url).hostname}&sz=32`; }
    catch { return ""; }
  })();

  const { data: row, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: userId,
      title: data.title,
      url: data.url,
      description: data.description,
      notes: data.notes,
      tags: data.tags,
      collection_id: data.collectionId,
      favicon,
    })
    .select()
    .single();
  if (error) throw error;
  return mapBookmark(row);
}

export async function updateBookmarkDb(id: string, updates: Partial<Bookmark>) {
  const mapped: any = {};
  if (updates.title !== undefined) mapped.title = updates.title;
  if (updates.url !== undefined) mapped.url = updates.url;
  if (updates.description !== undefined) mapped.description = updates.description;
  if (updates.notes !== undefined) mapped.notes = updates.notes;
  if (updates.tags !== undefined) mapped.tags = updates.tags;
  if (updates.collectionId !== undefined) mapped.collection_id = updates.collectionId;
  if (updates.aiSummary !== undefined) mapped.ai_summary = updates.aiSummary;

  const { error } = await supabase.from("bookmarks").update(mapped).eq("id", id);
  if (error) throw error;
}

export async function deleteBookmarkDb(id: string) {
  const { error } = await supabase.from("bookmarks").delete().eq("id", id);
  if (error) throw error;
}

// ─── Collections ───
export async function fetchCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji || "📁",
    createdAt: r.created_at,
  }));
}

export async function fetchPublicCollections(userId: string): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji || "📁",
    createdAt: r.created_at,
  }));
}

export async function insertCollection(userId: string, name: string, emoji: string): Promise<Collection> {
  const { data: row, error } = await supabase
    .from("collections")
    .insert({ user_id: userId, name, emoji })
    .select()
    .single();
  if (error) throw error;
  return { id: row.id, name: row.name, emoji: row.emoji, createdAt: row.created_at };
}

export async function deleteCollectionDb(id: string) {
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw error;
}

// ─── Snippets ───
export async function fetchSnippets(): Promise<CodeSnippet[]> {
  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    code: r.code,
    language: r.language || "",
    description: r.description || "",
    createdAt: r.created_at,
  }));
}

export async function insertSnippet(userId: string, data: Omit<CodeSnippet, "id" | "createdAt">): Promise<CodeSnippet> {
  const { data: row, error } = await supabase
    .from("snippets")
    .insert({ user_id: userId, title: data.title, code: data.code, language: data.language, description: data.description })
    .select()
    .single();
  if (error) throw error;
  return { id: row.id, title: row.title, code: row.code, language: row.language, description: row.description, createdAt: row.created_at };
}

export async function deleteSnippetDb(id: string) {
  const { error } = await supabase.from("snippets").delete().eq("id", id);
  if (error) throw error;
}

// ─── Stats ───
export async function fetchStats(userId: string) {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  return {
    xp: data.xp || 0,
    level: data.level || 1,
    streak: data.streak || 0,
    lastActiveDate: data.last_active_date || "",
    totalBookmarks: data.total_bookmarks || 0,
    totalSnippets: data.total_snippets || 0,
    totalRecalls: data.total_recalls || 0,
    categoriesCovered: data.categories_covered || [],
    badges: (data.badges as any[]) || [],
    dailyActivity: (data.daily_activity as Record<string, number>) || {},
  };
}

export async function fetchPublicStats(userId: string) {
  return fetchStats(userId);
}

export async function updateStats(userId: string, stats: any) {
  const { error } = await supabase
    .from("user_stats")
    .update({
      xp: stats.xp,
      level: stats.level,
      streak: stats.streak,
      last_active_date: stats.lastActiveDate || null,
      total_bookmarks: stats.totalBookmarks,
      total_snippets: stats.totalSnippets,
      total_recalls: stats.totalRecalls,
      categories_covered: stats.categoriesCovered,
      badges: stats.badges,
      daily_activity: stats.dailyActivity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw error;
}

// ─── Profiles ───
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchProfileByUsername(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { username?: string; display_name?: string; bio?: string; is_public?: boolean }) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) throw error;
}
