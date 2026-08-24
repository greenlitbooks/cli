// Output policy: JSON when --json is passed OR stdout is not a TTY (agents and
// pipes get machine output automatically); the human renderer otherwise.

let forceJson = false;

export function setJsonMode(on: boolean): void {
  forceJson = on;
}

export function jsonMode(): boolean {
  return forceJson || !process.stdout.isTTY;
}

export function emit(data: unknown, human: () => void): void {
  if (jsonMode()) {
    process.stdout.write(JSON.stringify(data, null, 2) + "\n");
  } else {
    human();
  }
}

/** Pad or truncate to an exact width for aligned columns. */
export function col(text: string | null | undefined, width: number): string {
  const s = (text ?? "").replace(/\s+/g, " ");
  return s.length > width ? s.slice(0, width - 1) + "…" : s.padEnd(width);
}

export function line(text = ""): void {
  process.stdout.write(text + "\n");
}
