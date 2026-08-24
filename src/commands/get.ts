import { apiGet } from "../api.js";
import { emit, line } from "../output.js";
import type { BookDetail } from "../types.js";

export async function getCommand(slug: string): Promise<void> {
  const data = await apiGet<BookDetail>(`/books/${encodeURIComponent(slug)}`);
  emit(data, () => {
    const b = data.book;
    line(b.title + (b.subtitle ? `: ${b.subtitle}` : ""));
    if (b.author) line(`by ${b.author}` + (b.series ? ` · ${b.series.name} #${b.series.position}` : ""));
    line();
    if (b.descriptions.oneLiner) line(b.descriptions.oneLiner);
    if (b.descriptions.targetReader) {
      line();
      line(`For: ${b.descriptions.targetReader}`);
    }
    line();
    if (data.chapters.length > 0) {
      line(`${data.chapters.length} chapters` + (data.totalWords ? ` · ${data.totalWords.toLocaleString()} words` : ""));
    }
    if (b.amazon.kindleUrl) {
      line(`Kindle:    ${b.amazon.kindleUrl}` + (b.prices.ebook ? `  (${b.prices.ebook.display})` : ""));
    }
    if (b.amazon.paperbackUrl) {
      line(`Paperback: ${b.amazon.paperbackUrl}` + (b.prices.paperback ? `  (${b.prices.paperback.display})` : ""));
    }
    if (b.kindleUnlimited) line("Free to read with Kindle Unlimited");
    if (data.excerpt.available && data.excerpt.url) line(`Free chapter one: ${data.excerpt.url}`);
    line(`Page: ${b.url}`);
    if (b.concept) {
      line();
      line(`Named concept: ${b.concept.name} (${b.concept.url})`);
    }
    const n = data.related.seriesNeighbors;
    if (n.previous || n.next) {
      line();
      if (n.previous) line(`Previous in series: ${n.previous.title} (${n.previous.slug})`);
      if (n.next) line(`Next in series:     ${n.next.title} (${n.next.slug})`);
    }
  });
}
