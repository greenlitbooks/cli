// Response shapes of the Greenlit Books public API (https://greenlitbooks.com/api/v1).
// Hand-mirrored from the live OpenAPI spec (/api/v1/openapi.json); v1 shapes are
// stable and change additively only.

export type ReaderLevel = "beginner" | "operator" | "engineer" | "leader";

export interface Meta {
  version: string;
  generatedAt: string;
  source: string;
  docs: string;
  openapi: string;
}

export interface ApiError {
  error: { code: string; message: string };
  meta: Meta;
}

export interface Price {
  display: string;
  amount: number | null;
  currency: string | null;
}

export interface BookLink {
  slug: string;
  title: string;
  position: number;
  url: string;
  apiUrl: string;
}

export interface Book {
  slug: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  series: { name: string; slug: string; position: number } | null;
  imprint: string | null;
  readerLevel: ReaderLevel;
  flagship: boolean;
  descriptions: {
    hook: string | null;
    oneLiner: string | null;
    targetReader: string | null;
    namedConcept: string | null;
  };
  concept: { name: string; slug: string; question: string; url: string } | null;
  amazon: {
    kindleAsin: string | null;
    paperbackAsin: string | null;
    kindleUrl: string | null;
    paperbackUrl: string | null;
  };
  prices: { ebook: Price | null; paperback: Price | null };
  kindleUnlimited: boolean;
  coverImage: string | null;
  url: string;
  apiUrl: string;
  markdownUrl: string;
  readUrl: string | null;
  categories: string[];
  companionRepo: string | null;
}

export interface BookDetail {
  meta: Meta;
  book: Book;
  chapters: { number: number; title: string }[];
  totalWords: number | null;
  excerpt: {
    available: boolean;
    chapterTitle: string | null;
    words: number | null;
    minutes: number | null;
    url: string | null;
    markdownUrl: string | null;
  };
  related: {
    guide: { title: string; slug: string; url: string } | null;
    fieldNotes: { title: string; slug: string; description: string; url: string }[];
    compares: { title: string; slug: string; url: string }[];
    seriesNeighbors: { previous: BookLink | null; next: BookLink | null };
  };
}

export interface BooksResponse {
  meta: Meta;
  query: { series: string | null; audience: string | null };
  count: number;
  books: Book[];
}

export interface Series {
  name: string;
  slug: string;
  tier: string;
  blurb: string;
  order: number;
  count: number;
  url: string;
  apiUrl: string;
  books: BookLink[];
}

export interface Imprint {
  name: string;
  count: number;
  series: string[];
}

export interface SeriesListResponse {
  meta: Meta;
  count: number;
  series: Series[];
  imprints: Imprint[];
}

export interface SeriesDetailResponse {
  meta: Meta;
  series: Series;
}

export interface Concept {
  name: string;
  slug: string;
  question: string;
  shortAnswer: string;
  url: string;
  markdownUrl: string;
  book: { slug: string; title: string; url: string; apiUrl: string };
}

export interface ConceptsResponse {
  meta: Meta;
  count: number;
  concepts: Concept[];
}

export interface Topic {
  slug: string;
  name: string;
  aliases: string[];
  description: string;
  books: BookLink[];
  guide: { title: string; slug: string; url: string } | null;
  series: { name: string; slug: string; url: string; apiUrl: string } | null;
}

export interface TopicsResponse {
  meta: Meta;
  count: number;
  topics: Topic[];
}

export interface SearchResult {
  score: number;
  matchedFields: string[];
  book: {
    slug: string;
    title: string;
    subtitle: string | null;
    author: string | null;
    readerLevel: ReaderLevel;
    series: { name: string; slug: string } | null;
    oneLiner: string | null;
    url: string;
    apiUrl: string;
    coverImage: string | null;
  };
}

export interface SearchResponse {
  meta: Meta;
  query: { q: string; series: string | null; audience: string | null; limit: number };
  count: number;
  totalMatches: number;
  results: SearchResult[];
}

export interface CatalogResponse {
  meta: Meta;
  publisher: { name: string; url: string; description: string };
  counts: { books: number; series: number; concepts: number; topics: number };
  series: Series[];
  imprints: Imprint[];
  books: BookDetail[];
  concepts: Concept[];
  topics: Topic[];
}
