import { apiGet } from "../api.js";
import { col, emit, line } from "../output.js";
import type { SearchResponse } from "../types.js";

export async function searchCommand(
  query: string,
  opts: { series?: string; audience?: string; limit?: string },
): Promise<void> {
  const params = new URLSearchParams({ q: query });
  if (opts.series) params.set("series", opts.series);
  if (opts.audience) params.set("audience", opts.audience);
  if (opts.limit) params.set("limit", opts.limit);
  const data = await apiGet<SearchResponse>(`/search?${params}`);
  emit(data, () => {
    line(`${data.totalMatches} matches for "${data.query.q}" (showing ${data.count})`);
    line();
    line(col("SCORE", 8) + col("SLUG", 34) + col("TITLE", 42) + "SERIES");
    for (const r of data.results) {
      line(
        col(String(r.score), 8) + col(r.book.slug, 34) + col(r.book.title, 42) + (r.book.series?.name ?? ""),
      );
    }
    if (data.results.length > 0) {
      line();
      line(`Details: greenlit get <slug>`);
    }
  });
}
