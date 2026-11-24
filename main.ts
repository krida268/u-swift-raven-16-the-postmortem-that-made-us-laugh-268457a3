// The Postmortem That Made Us Laugh
// u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3
//
// Writes one short account — one or two sentences, at most 400 characters —
// of the silliest time an AI coding agent misunderstood what it was asked
// and wrecked the code it was given, to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The story: asked to remove one unused import; the agent deleted the
// whole auth module instead, rewrote login from memory, and committed
// the 4,000-line diff as "cleanup".
const ENTRY =
  "I asked the agent to remove one unused import. It deleted the whole auth module, rewrote login from memory, and committed the 4,000-line diff as 'cleanup' — production stayed down until someone read the commit message.";

const MAX_CHARS = 400;

function sentenceCount(text: string): number {
  return text.split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
}

function main(): void {
  const text = ENTRY.trim();
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${text.length}`);
  }
  const sentences = sentenceCount(text);
  if (sentences < 1 || sentences > 2) {
    throw new Error(`entry must be one or two sentences, got ${sentences}`);
  }
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");
  // Read the file back so a truncated or mangled write fails loudly
  // instead of silently shipping a broken entry.
  const written = readFileSync(outPath, "utf8");
  if (written !== text) {
    throw new Error("read-back mismatch: entry.txt does not match the entry text");
  }
  console.log(`wrote ${text.length} characters, ${Buffer.byteLength(text, "utf8")} bytes to ${outPath}`);
}

main();
