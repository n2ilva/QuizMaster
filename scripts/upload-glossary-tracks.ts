import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { Firestore } from "@google-cloud/firestore";

type GlossaryEntry = {
  term: string;
  definition: string;
};

const BATCH_LIMIT = 500;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

/**
 * Upload track-specific glossaries to Firestore.
 * Each track gets its own collection: glossary_<trackSlug>
 *
 * Usage:
 *   FIREBASE_PROJECT_ID=cardmaster-934d5 npx tsx scripts/upload-glossary-tracks.ts [--clean]
 */
async function main() {
  if (!PROJECT_ID) {
    console.error("❌  Set FIREBASE_PROJECT_ID env var");
    process.exit(1);
  }

  const clean = process.argv.includes("--clean");
  const db = new Firestore({ projectId: PROJECT_ID });

  const tracks = ["matematica", "portugues", "ingles"];

  for (const track of tracks) {
    const filePath = resolve(
      __dirname,
      "..",
      "data",
      "glossary",
      `${track}.json`,
    );
    const raw = await readFile(filePath, "utf-8");
    const entries: GlossaryEntry[] = JSON.parse(raw);

    const collectionName = `glossary_${track}`;
    console.log(`\n📖  ${collectionName}: ${entries.length} termos`);

    if (clean) {
      console.log(`   🗑  Limpando coleção ${collectionName}...`);
      const existing = await db.collection(collectionName).listDocuments();
      const deleteBatches = [];
      for (let i = 0; i < existing.length; i += BATCH_LIMIT) {
        const batch = db.batch();
        existing.slice(i, i + BATCH_LIMIT).forEach((doc) => batch.delete(doc));
        deleteBatches.push(batch.commit());
      }
      await Promise.all(deleteBatches);
      console.log(`   ✅  ${existing.length} docs removidos`);
    }

    let batch = db.batch();
    let count = 0;

    for (const entry of entries) {
      const docId = entry.term
        .toLowerCase()
        .replace(/[^a-záàâãéèêíïóôõúüçñ0-9\s-]/gi, "")
        .replace(/\s+/g, "-");
      const ref = db.collection(collectionName).doc(docId);
      batch.set(ref, {
        term: entry.term,
        definition: entry.definition,
      });
      count++;

      if (count % BATCH_LIMIT === 0) {
        await batch.commit();
        console.log(`   📝  ${count} termos enviados...`);
        batch = db.batch();
      }
    }

    if (count % BATCH_LIMIT !== 0) {
      await batch.commit();
    }

    console.log(`   ✅  ${count} termos enviados para ${collectionName}`);
  }

  console.log("\n🎉  Upload de glossários por track concluído!");
}

main().catch((err) => {
  console.error("❌  Erro:", err);
  process.exit(1);
});
