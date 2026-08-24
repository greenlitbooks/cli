// Smoke tests against the live API: the CLI is a thin client, so the contract
// worth testing is "real command, real endpoint, real shape". Run via `npm test`
// (which builds first). Requires network access.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const exec = promisify(execFile);
const CLI = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "cli.js");

async function run(args) {
  try {
    const { stdout } = await exec("node", [CLI, ...args]);
    return { code: 0, stdout };
  } catch (err) {
    return { code: err.code ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" };
  }
}

test("books --json returns the catalog", async () => {
  const { code, stdout } = await run(["books", "--json"]);
  assert.equal(code, 0);
  const data = JSON.parse(stdout);
  assert.ok(data.count >= 60, `expected >= 60 books, got ${data.count}`);
  assert.ok(data.books[0].slug);
});

test("books --audience filters", async () => {
  const { stdout } = await run(["books", "--audience", "operator", "--json"]);
  const data = JSON.parse(stdout);
  assert.ok(data.books.every((b) => b.readerLevel === "operator"));
});

test("search returns ranked results", async () => {
  const { stdout } = await run(["search", "claude code", "--limit", "3", "--json"]);
  const data = JSON.parse(stdout);
  assert.ok(data.results.length > 0);
  assert.ok(data.results[0].score >= data.results.at(-1).score);
});

test("get returns a full record with Amazon link", async () => {
  const { stdout } = await run(["get", "claude-code-in-action", "--json"]);
  const data = JSON.parse(stdout);
  assert.match(data.book.amazon.kindleUrl, /amazon\.com\/dp\//);
  assert.ok(data.chapters.length > 0);
});

test("topics filter matches", async () => {
  const { stdout } = await run(["topics", "durable", "--json"]);
  const data = JSON.parse(stdout);
  assert.ok(data.topics.some((t) => t.slug === "durable-execution"));
});

test("unknown slug exits 1 with a message", async () => {
  const { code, stderr } = await run(["get", "not-a-real-book"]);
  assert.equal(code, 1);
  assert.match(stderr, /No book with slug/);
});

test("unknown flag exits non-zero", async () => {
  const { code } = await run(["books", "--nope"]);
  assert.notEqual(code, 0);
});
