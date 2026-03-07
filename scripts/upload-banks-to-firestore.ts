import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { Firestore } from "@google-cloud/firestore";

type JsonCard = {
  id: string;
  track: string;
  category: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  example: string;
};

type UploadOptions = {
  cleanBeforeUpload: boolean;
  splitByTrack: boolean;
  dryRun: boolean;
};

const COLLECTION_NAME = process.env.BANKS_COLLECTION ?? "cards";
const BATCH_LIMIT = 500;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

function parseBooleanEnv(value?: string): boolean {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "y", "on"].includes(value.toLowerCase());
}

function parseOptions(): UploadOptions {
  const args = new Set(process.argv.slice(2));

  return {
    cleanBeforeUpload:
      args.has("--clean") ||
      parseBooleanEnv(process.env.BANKS_CLEAN_BEFORE_UPLOAD),
    splitByTrack:
      args.has("--split-by-track") ||
      parseBooleanEnv(process.env.BANKS_SPLIT_BY_TRACK),
    dryRun: args.has("--dry-run"),
  };
}

function targetCollection(track: string, splitByTrack: boolean): string {
  if (!splitByTrack) {
    return COLLECTION_NAME;
  }

  return `${COLLECTION_NAME}_${track}`;
}

function groupByTrack(cards: JsonCard[]) {
  const grouped = new Map<string, JsonCard[]>();

  for (const card of cards) {
    const group = grouped.get(card.track);
    if (group) {
      group.push(card);
      continue;
    }

    grouped.set(card.track, [card]);
  }

  return grouped;
}

async function loadServiceAccount() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountPath) {
    return null;
  }

  const absolutePath = resolve(process.cwd(), serviceAccountPath);
  const file = await readFile(absolutePath, "utf-8");
  return JSON.parse(file);
}

async function createFirestoreClient(): Promise<Firestore> {
  const serviceAccount = await loadServiceAccount();

  if (serviceAccount) {
    return new Firestore({
      projectId: PROJECT_ID ?? serviceAccount.project_id,
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
    });
  }

  return new Firestore({
    projectId: PROJECT_ID,
  });
}

async function loadCards(): Promise<JsonCard[]> {
  const jsonDir = resolve(process.cwd(), "data", "cards", "json");
  const files = await readdir(jsonDir);

  const SKIP_FILES = new Set(["cards.json", "metadata.json"]);
  const jsonFiles = files.filter(
    (f) => f.endsWith(".json") && !SKIP_FILES.has(f),
  );

  const allCards: JsonCard[] = [];

  for (const file of jsonFiles) {
    const filePath = resolve(jsonDir, file);
    const json = await readFile(filePath, "utf-8");
    const cards = JSON.parse(json) as JsonCard[];
    console.log(`Carregado: ${file} (${cards.length} cards)`);
    allCards.push(...cards);
  }

  console.log(`Total de cards carregados: ${allCards.length}`);
  return allCards;
}

async function clearCollection(collectionName: string, db: Firestore) {
  let totalDeleted = 0;

  while (true) {
    const snapshot = await db
      .collection(collectionName)
      .limit(BATCH_LIMIT)
      .get();

    if (snapshot.empty) {
      break;
    }

    const batch = db.batch();

    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
    }

    await batch.commit();
    totalDeleted += snapshot.size;
  }

  return totalDeleted;
}

async function uploadCards(
  cards: JsonCard[],
  options: UploadOptions,
  db?: Firestore,
) {
  const grouped = groupByTrack(cards);
  const collections = new Set(
    [...grouped.keys()].map((track) =>
      targetCollection(track, options.splitByTrack),
    ),
  );

  if (options.cleanBeforeUpload) {
    for (const collectionName of collections) {
      const deleted = await clearCollection(collectionName, db!);
      console.log(
        `Coleção limpa: ${collectionName} (${deleted} documentos removidos)`,
      );
    }
  }

  if (options.dryRun) {
    for (const [track, trackCards] of grouped.entries()) {
      const collectionName = targetCollection(track, options.splitByTrack);
      console.log(
        `DRY RUN -> trilha=${track}, coleção=${collectionName}, cards=${trackCards.length}`,
      );
    }
    return 0;
  }

  let batch = db!.batch();
  let opCount = 0;
  let totalWritten = 0;

  for (const [track, trackCards] of grouped.entries()) {
    const collectionName = targetCollection(track, options.splitByTrack);

    for (const card of trackCards) {
      const safeId = card.id.replace(/\//g, "-");
      const docRef = db!.collection(collectionName).doc(safeId);
      batch.set(docRef, { ...card, id: safeId }, { merge: true });
      opCount += 1;

      if (opCount === BATCH_LIMIT) {
        await batch.commit();
        totalWritten += opCount;
        batch = db!.batch();
        opCount = 0;
        console.log(`Progresso: ${totalWritten}/${cards.length}`);
      }
    }

    console.log(`Trilha enviada: ${track} (${trackCards.length} cards)`);
  }

  if (opCount > 0) {
    await batch.commit();
    totalWritten += opCount;
  }

  return totalWritten;
}

async function main() {
  const options = parseOptions();

  const cards = await loadCards();

  let db: Firestore | undefined;
  if (!options.dryRun) {
    db = await createFirestoreClient();
  }

  const total = await uploadCards(cards, options, db);

  // Atualiza a versão dos dados no Firestore para invalidar caches dos clientes
  if (!options.dryRun && db) {
    const dataVersion = new Date().toISOString();
    await db.collection("app_meta").doc("data_version").set({
      version: dataVersion,
      totalCards: total,
      updatedAt: dataVersion,
    });
    console.log(`Versão dos dados atualizada: ${dataVersion}`);
  }

  console.log("Upload concluído.");
  console.log(`Modo por trilha: ${options.splitByTrack ? "sim" : "não"}`);
  console.log(`Limpeza prévia: ${options.cleanBeforeUpload ? "sim" : "não"}`);
  console.log(`Coleção base: ${COLLECTION_NAME}`);
  console.log(`Cards enviados: ${total}`);
}

main().catch((error) => {
  console.error("Erro no upload para Firestore:", error);
  process.exit(1);
});
