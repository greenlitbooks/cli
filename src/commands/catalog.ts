import { apiGet } from "../api.js";
import { jsonMode, line } from "../output.js";
import type { CatalogResponse } from "../types.js";

export async function catalogCommand(): Promise<void> {
  const data = await apiGet<CatalogResponse>("/catalog");
  if (jsonMode()) {
    process.stdout.write(JSON.stringify(data, null, 2) + "\n");
    return;
  }
  // The catalog is a full dump; in a terminal print the summary rather than
  // hundreds of pages of JSON.
  line(`${data.publisher.name} full catalog`);
  line(data.publisher.description);
  line();
  const c = data.counts;
  line(`books: ${c.books} · series: ${c.series} · concepts: ${c.concepts} · topics: ${c.topics}`);
  line();
  line(`Pipe or pass --json for the full dump: greenlit catalog --json`);
}
