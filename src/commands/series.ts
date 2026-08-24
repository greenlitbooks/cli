import { apiGet } from "../api.js";
import { col, emit, line } from "../output.js";
import type { SeriesDetailResponse, SeriesListResponse } from "../types.js";

export async function seriesCommand(slug: string | undefined): Promise<void> {
  if (slug) {
    const data = await apiGet<SeriesDetailResponse>(`/series/${encodeURIComponent(slug)}`);
    emit(data, () => {
      const s = data.series;
      line(`${s.name} (${s.count} books) · ${s.tier}`);
      line();
      line(s.blurb);
      line();
      for (const b of s.books) {
        line(`  ${String(b.position).padStart(2)}. ${col(b.title, 46)} ${b.slug}`);
      }
    });
    return;
  }
  const data = await apiGet<SeriesListResponse>("/series");
  emit(data, () => {
    line(`${data.count} series`);
    line();
    line(col("SLUG", 42) + col("NAME", 42) + col("BOOKS", 7) + "TIER");
    for (const s of data.series) {
      line(col(s.slug, 42) + col(s.name, 42) + col(String(s.count), 7) + s.tier);
    }
    line();
    line("Reading order: greenlit series <slug>");
  });
}
