import { apiGet } from "../api.js";
import { col, emit, line } from "../output.js";
import type { TermsResponse } from "../types.js";

export async function termsCommand(query?: string): Promise<void> {
  const data = await apiGet<TermsResponse>("/terms");
  const needle = query?.toLowerCase().trim();
  const terms = needle
    ? data.terms.filter(
        (t) =>
          t.term.toLowerCase().includes(needle) ||
          t.slug.includes(needle) ||
          t.aliases.some((a) => a.toLowerCase().includes(needle)) ||
          t.definition.toLowerCase().includes(needle),
      )
    : data.terms;
  const payload = needle ? { ...data, count: terms.length, terms } : data;
  emit(payload, () => {
    line(`${terms.length} glossary terms` + (needle ? ` matching "${query}"` : "") + " (definitions quoted from the books)");
    line();
    line(col("TERM", 32) + col("KIND", 13) + "DEFINED IN");
    for (const t of terms) {
      line(col(t.term, 32) + col(t.kind, 13) + `${t.definedIn.book.slug} (${t.definedIn.chapter})`);
    }
    line();
    line("greenlit define <term> for the definition, the receipts, and the links.");
  });
}
