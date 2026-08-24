import { apiGet } from "../api.js";
import { col, emit, line } from "../output.js";
import type { ConceptsResponse } from "../types.js";

export async function conceptsCommand(): Promise<void> {
  const data = await apiGet<ConceptsResponse>("/concepts");
  emit(data, () => {
    line(`${data.count} concepts (each book answers one named question)`);
    line();
    line(col("CONCEPT", 30) + col("QUESTION", 62) + "BOOK");
    for (const c of data.concepts) {
      line(col(c.name, 30) + col(c.question, 62) + c.book.slug);
    }
  });
}
