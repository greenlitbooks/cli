# greenlit-books

Official thin CLI for the [Greenlit Books](https://greenlitbooks.com) public catalog API and glossary. Practical books on working with AI, held to one standard: every claim is something you can check. All titles are live on Amazon and free to read with Kindle Unlimited.

Built for agents first: every command emits pure JSON when piped (or with `--json`), and clean human output in a terminal. Zero configuration, no auth, no local state. It is a pure client of the live API at `https://greenlitbooks.com/api/v1`.

## Install

```bash
# one-off
npx greenlit-books search "agent reliability"

# global (installs the `greenlit` command)
npm install -g greenlit-books
greenlit --help
```

Requires Node 20+.

## Commands

```bash
greenlit books                          # every live book
greenlit books --audience operator      # filter: beginner, operator, engineer, leader
greenlit books --series the-claude-code-ladder
greenlit get claude-code-in-action      # one book in full: chapters, prices, Amazon links
greenlit search "claude code" --limit 5 # ranked full-text search
greenlit series                         # all series
greenlit series the-operators-ai-library  # one series in reading order
greenlit topics                         # curated topics mapped to books
greenlit topics "prompt injection"      # filter the topic list
greenlit concepts                       # the one named question each book answers
greenlit terms                          # the glossary: every coined term with its source
greenlit terms "blast"                  # filter the glossary
greenlit define "green lie"             # one term: the book's own definition, receipts, links
greenlit catalog --json                 # the whole catalog in one response
greenlit open blast-radius              # open the Amazon Kindle page in your browser
greenlit open blast-radius --site       # open the greenlitbooks.com page instead
```

## For agents

- Output is pure JSON whenever stdout is not a TTY, so `greenlit search "x" | jq` and subprocess capture just work. `--json` forces it.
- Exit codes: 0 on success, non-zero on any failure, with the error on stderr.
- The API is public and unauthenticated; the CLI adds nothing you cannot get with plain GET requests. Machine-readable contract: [OpenAPI 3.1](https://greenlitbooks.com/api/v1/openapi.json). Site map for assistants: [llms.txt](https://greenlitbooks.com/llms.txt).
- The same catalog is also a remote MCP server: `https://greenlitbooks.com/api/mcp` (registry name `com.greenlitbooks/catalog`), whose `define_term` tool returns the same record as `greenlit define`.

```bash
greenlit search "agent reliability" --audience engineer --json \
  | jq -r '.results[] | "\(.score)\t\(.book.title)\t\(.book.url)"'
```

## Options

Every command accepts:

- `--json`: force JSON output.
- `--base-url <url>`: point at a different API base (default `https://greenlitbooks.com/api/v1`; env `GREENLIT_BASE_URL` also works).

## Definitions are quoted, not written

`greenlit define` returns the sentence the book itself uses, verified verbatim against the manuscript when the site is built, with the chapter that gives it and the other books that use the term. Terms borrowed from another field (blast radius, span of control) say so.

## What is not in the data

No publication dates, page counts, ISBNs, or ratings. The catalog carries no verified source for them and the publisher does not invent data. Amazon links are clean `/dp/` product URLs.

## Links

- Docs for humans and agents: <https://greenlitbooks.com/developers>
- OpenAPI 3.1 spec: <https://greenlitbooks.com/api/v1/openapi.json>
- llms.txt: <https://greenlitbooks.com/llms.txt>
- MCP server manifest: <https://github.com/greenlitbooks/mcp>

MIT licensed. This repository holds the CLI only; the catalog and API live at greenlitbooks.com.
