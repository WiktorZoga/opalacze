import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Tools write into the repo checkout, not the session workspace: the
// generations/ folder *is* the product. Override with ROTBOT_REPO.
export const REPO_ROOT =
  process.env.ROTBOT_REPO ?? resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

export const GENERATIONS_DIR = resolve(REPO_ROOT, "generations");

export function generationDir(generation: number): string {
  return resolve(GENERATIONS_DIR, `gen-${String(generation).padStart(3, "0")}`);
}

/** Resolve a repo-relative path and refuse anything outside generations/. */
export function safeArtifactPath(repoRelative: string): string {
  const abs = resolve(REPO_ROOT, repoRelative);
  const rel = relative(GENERATIONS_DIR, abs);
  if (rel.startsWith("..") || rel === "" || resolve(GENERATIONS_DIR, rel) !== abs) {
    throw new Error(`Refusing to write outside generations/: ${repoRelative}`);
  }
  return abs;
}
