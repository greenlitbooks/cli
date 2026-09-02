import { Command } from "commander";
import { CliError, setBaseUrl, VERSION } from "./api.js";
import { setJsonMode } from "./output.js";
import { booksCommand } from "./commands/books.js";
import { getCommand } from "./commands/get.js";
import { searchCommand } from "./commands/search.js";
import { seriesCommand } from "./commands/series.js";
import { conceptsCommand } from "./commands/concepts.js";
import { topicsCommand } from "./commands/topics.js";
import { catalogCommand } from "./commands/catalog.js";
import { openCommand } from "./commands/open.js";
import { termsCommand } from "./commands/terms.js";
import { defineCommand } from "./commands/define.js";

const program = new Command();

program
  .name("greenlit")
  .description(
    "Official thin client for the Greenlit Books public catalog API (greenlitbooks.com).\n" +
      "Practical books on working with AI: verification, agents, governance.\n" +
      "JSON-first: pass --json, or pipe the output, to get machine-readable JSON.",
  )
  .version(VERSION)
  .hook("preAction", (_thisCommand, actionCommand) => {
    const opts = actionCommand.opts<{ json?: boolean; baseUrl?: string }>();
    if (opts.json) setJsonMode(true);
    if (opts.baseUrl) setBaseUrl(opts.baseUrl);
  });

program
  .command("books")
  .description("list all live books, optionally filtered")
  .option("--series <slug>", "filter by series slug (see: greenlit series)")
  .option("--audience <level>", "filter by reader level: beginner, operator, engineer, leader")
  .action(booksCommand);

program
  .command("get")
  .description("one book in full: chapters, prices, Amazon links, related reading")
  .argument("<slug>", "the book slug, e.g. claude-code-in-action")
  .action(getCommand);

program
  .command("search")
  .description("ranked full-text search over the catalog")
  .argument("<query>", "the search query")
  .option("--series <slug>", "restrict to one series")
  .option("--audience <level>", "restrict to one reader level")
  .option("--limit <n>", "max results (1-25, default 10)")
  .action(searchCommand);

program
  .command("series")
  .description("all series, or one series with its books in reading order")
  .argument("[slug]", "a series slug for the detail view")
  .action(seriesCommand);

program
  .command("concepts")
  .description("the one named question each book answers")
  .action(conceptsCommand);

program
  .command("terms")
  .description("the glossary: every term the books coin or pin down, with its source")
  .argument("[query]", "filter terms by phrase (display-only convenience)")
  .action(termsCommand);

program
  .command("define")
  .description("one glossary term: the book's own definition, receipts, and links")
  .argument("<term>", "the term, an alias, or its slug, e.g. \"green lie\" or gate-faith")
  .action(defineCommand);

program
  .command("topics")
  .description("curated topics mapped to the books that cover them")
  .argument("[query]", "filter topics by phrase (display-only convenience)")
  .action(topicsCommand);

program
  .command("catalog")
  .description("the whole catalog in one response (JSON dump)")
  .action(catalogCommand);

program
  .command("open")
  .description("open a book's Amazon Kindle page in the default browser")
  .argument("<slug>", "the book slug")
  .option("--paperback", "open the paperback page instead")
  .option("--site", "open the greenlitbooks.com page instead of Amazon")
  .action(openCommand);

// Every command accepts --json and --base-url directly (commander does not
// inherit root options into subcommands).
for (const cmd of program.commands) {
  cmd
    .option("--json", "output JSON (automatic when stdout is not a TTY)")
    .option("--base-url <url>", "API base URL (or GREENLIT_BASE_URL env)");
}

program.parseAsync().catch((err: unknown) => {
  if (err instanceof CliError) {
    process.stderr.write(`greenlit: ${err.message}\n`);
  } else {
    const detail = err instanceof Error ? err.message : String(err);
    process.stderr.write(`greenlit: unexpected error: ${detail}\n`);
  }
  process.exitCode = 1;
});
