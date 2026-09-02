import type { ApiError } from "./types.js";

export const VERSION = "1.1.0";

const DEFAULT_BASE = "https://greenlitbooks.com/api/v1";

let baseUrl = process.env.GREENLIT_BASE_URL || DEFAULT_BASE;

export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, "");
}

/** Error carrying a clean, user-facing message; the CLI exits 1 on it. */
export class CliError extends Error {}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${baseUrl}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "user-agent": `greenlit-books-cli/${VERSION}` },
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new CliError(`Could not reach ${url} (${detail}). Check your network or --base-url.`);
  }
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new CliError(`Unexpected non-JSON response (HTTP ${res.status}) from ${url}`);
  }
  if (!res.ok) {
    const message = (data as ApiError)?.error?.message;
    throw new CliError(message ?? `HTTP ${res.status} from ${url}`);
  }
  return data as T;
}
