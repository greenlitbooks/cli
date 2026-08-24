import { spawn } from "node:child_process";
import { apiGet, CliError } from "../api.js";
import { line } from "../output.js";
import type { BookDetail } from "../types.js";

function opener(): { cmd: string; args: string[] } {
  if (process.platform === "darwin") return { cmd: "open", args: [] };
  if (process.platform === "win32") return { cmd: "cmd", args: ["/c", "start", ""] };
  return { cmd: "xdg-open", args: [] };
}

export async function openCommand(
  slug: string,
  opts: { paperback?: boolean; site?: boolean },
): Promise<void> {
  const data = await apiGet<BookDetail>(`/books/${encodeURIComponent(slug)}`);
  const b = data.book;
  let url: string | null;
  if (opts.site) {
    url = b.url;
  } else if (opts.paperback) {
    url = b.amazon.paperbackUrl;
    if (!url) throw new CliError(`"${b.title}" has no paperback edition. Try without --paperback.`);
  } else {
    url = b.amazon.kindleUrl ?? b.url;
  }
  const { cmd, args } = opener();
  const child = spawn(cmd, [...args, url], { detached: true, stdio: "ignore" });
  child.unref();
  line(url);
}
