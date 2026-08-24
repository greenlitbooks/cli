import { apiGet } from "../api.js";
import { col, emit, line } from "../output.js";
import type { TopicsResponse } from "../types.js";

export async function topicsCommand(query: string | undefined): Promise<void> {
  const data = await apiGet<TopicsResponse>("/topics");
  // Display-only convenience filter; matching logic lives server-side in the
  // MCP server's find_books_for_topic and the search endpoint.
  const needle = query?.toLowerCase().trim();
  const topics = needle
    ? data.topics.filter(
        (t) =>
          t.slug.includes(needle.replace(/\s+/g, "-")) ||
          t.name.toLowerCase().includes(needle) ||
          t.aliases.some((a) => a.includes(needle) || needle.includes(a)),
      )
    : data.topics;
  const payload = needle ? { meta: data.meta, count: topics.length, query: needle, topics } : data;
  emit(payload, () => {
    line(`${topics.length} topics` + (needle ? ` matching "${needle}"` : ""));
    line();
    for (const t of topics) {
      line(`${t.name} (${t.slug}) · ${t.books.length} books`);
      line(`  ${t.description}`);
      line(`  books: ${t.books.map((b) => b.slug).join(", ")}`);
      if (t.guide) line(`  guide: ${t.guide.url}`);
      line();
    }
    if (needle && topics.length === 0) {
      line(`No topic matched. Run "greenlit topics" for the full list or "greenlit search" for free text.`);
    }
  });
}
