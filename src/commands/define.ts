import { apiGet } from "../api.js";
import { emit, line } from "../output.js";
import type { TermDetail } from "../types.js";

export async function defineCommand(term: string): Promise<void> {
  const data = await apiGet<TermDetail>(`/terms/${encodeURIComponent(term)}`);
  emit(data, () => {
    line(`${data.term}` + (data.aliases.length ? `  (also: ${data.aliases.join(", ")})` : ""));
    line(
      data.kind === "coined"
        ? "Coined term."
        : `Term of art from ${data.fieldOfOrigin ?? "another field"}; this is the operational definition the book uses.`,
    );
    line();
    line(data.definition);
    line();
    line(`Defined in: ${data.definedIn.book.title}, ${data.definedIn.chapter} (${data.definedIn.book.url})`);
    if (data.usedInBooks.length) {
      line(`Used in ${data.usedInBooks.length} other book${data.usedInBooks.length === 1 ? "" : "s"}: ` +
        data.usedInBooks.map((b) => b.slug).join(", "));
    }
    line();
    line(`Check it: ${data.checkable.claim}`);
    line(`How:      ${data.checkable.howToCheck}`);
    line();
    if (data.links.freeChapter) line(`Free chapter one: ${data.links.freeChapter}`);
    if (data.links.amazonKindle) line(`Kindle:           ${data.links.amazonKindle}`);
    if (data.links.kindleUnlimited) line("Free to read with Kindle Unlimited");
    line(`Glossary page:    ${data.url}`);
    line(`Cite as:          ${data.links.citeAs}`);
    if (data.relatedTerms.length) {
      line();
      line(`Related: ${data.relatedTerms.map((r) => r.term).join(", ")}`);
    }
  });
}
