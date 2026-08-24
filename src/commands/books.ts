import { apiGet } from "../api.js";
import { col, emit, line } from "../output.js";
import type { BooksResponse } from "../types.js";

export async function booksCommand(opts: { series?: string; audience?: string }): Promise<void> {
  const params = new URLSearchParams();
  if (opts.series) params.set("series", opts.series);
  if (opts.audience) params.set("audience", opts.audience);
  const qs = params.size > 0 ? `?${params}` : "";
  const data = await apiGet<BooksResponse>(`/books${qs}`);
  emit(data, () => {
    line(`${data.count} books` + (opts.series || opts.audience ? " (filtered)" : ""));
    line();
    line(col("SLUG", 34) + col("TITLE", 42) + col("SERIES", 30) + col("LEVEL", 10) + "EBOOK");
    for (const b of data.books) {
      line(
        col(b.slug, 34) +
          col(b.title, 42) +
          col(b.series?.name, 30) +
          col(b.readerLevel, 10) +
          (b.prices.ebook?.display ?? ""),
      );
    }
  });
}
