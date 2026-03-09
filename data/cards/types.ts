// ---------------------------------------------------------------------------
// Seed data types — used by theme files and the seed script.
// Compact property names to keep data files readable and maintainable.
// ---------------------------------------------------------------------------

/** A single question in seed format */
export type SeedCard = {
  /** Question text */
  q: string;
  /** Four options — exactly one is correct */
  o: [string, string, string, string];
  /** Index of the correct option (0-3) */
  c: number;
  /** Explanation of the correct answer */
  e: string;
  /** Practical example */
  x: string;
};

/** Questions grouped by difficulty */
export type DifficultyCards = {
  Fácil: SeedCard[];
  Médio: SeedCard[];
  Difícil: SeedCard[];
};

/** A complete theme containing all its categories and questions */
export type ThemeData = {
  /** Track slug — must match the key used in [track].tsx (e.g. "cloud") */
  track: string;
  /** Map of category display name → difficulty level → questions */
  categories: Record<string, DifficultyCards>;
};
