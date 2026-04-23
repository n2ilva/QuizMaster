import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Firestore } from "@google-cloud/firestore";

type Exercise = {
  id: string;
  exerciseType: string;
  difficulty: "Fácil" | "Médio" | "Difícil" | string;
  solution: string[];
  availableTokenIds: string[];
  tokenLabels?: Record<string, string>;
  language: string;
  question: string;
  hints?: string[];
  track?: string;
};

// Coleção base para onde vão os exercícios
const COLLECTION_NAME = process.env.EXERCISES_COLLECTION ?? "coding_exercises";
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "cardmaster-934d5";

async function loadServiceAccount() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || "service-account.json";
  if (!serviceAccountPath) return null;
  const absolutePath = resolve(process.cwd(), serviceAccountPath);
  try {
    const file = await readFile(absolutePath, "utf-8");
    return JSON.parse(file);
  } catch (e) {
    return null;
  }
}

async function createFirestoreClient(): Promise<Firestore> {
  const serviceAccount = await loadServiceAccount();
  if (serviceAccount) {
    console.log("Credenciais de Service Account encontradas.");
    return new Firestore({
      projectId: PROJECT_ID ?? serviceAccount.project_id,
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
    });
  }
  return new Firestore({ projectId: PROJECT_ID });
}

async function loadExercises(): Promise<Exercise[]> {
  const dataDir = resolve(process.cwd(), "data/pratica-de-codigos");
  const files = await readdir(dataDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const allExercises: Exercise[] = [];

  for (const file of jsonFiles) {
    const filePath = resolve(dataDir, file);
    const json = await readFile(filePath, "utf-8");
    const data = JSON.parse(json) as { exercises: Exercise[] };
    if (data && data.exercises) {
      console.log(`Carregado: ${file} (${data.exercises.length} exercícios)`);
      allExercises.push(...data.exercises);
    }
  }

  console.log(`Total de exercícios carregados: ${allExercises.length}`);
  return allExercises;
}

async function uploadExercises(exercises: Exercise[], db: Firestore) {
  let batch = db.batch();
  let opCount = 0;
  let totalWritten = 0;
  const BATCH_LIMIT = 500;

  for (const exercise of exercises) {
    const safeId = exercise.id.replace(/\//g, "-");
    const docRef = db.collection(COLLECTION_NAME).doc(safeId);
    batch.set(docRef, { ...exercise, id: safeId }, { merge: true });
    opCount++;

    if (opCount === BATCH_LIMIT) {
      await batch.commit();
      totalWritten += opCount;
      batch = db.batch();
      opCount = 0;
      console.log(`Progresso: ${totalWritten}/${exercises.length}`);
    }
  }

  if (opCount > 0) {
    await batch.commit();
    totalWritten += opCount;
  }

  return totalWritten;
}

async function main() {
  const exercises = await loadExercises();
  const db = await createFirestoreClient();

  console.log(`Iniciando upload de ${exercises.length} exercícios para a coleção ${COLLECTION_NAME}...`);
  const total = await uploadExercises(exercises, db);

  console.log(`Upload concluído! Exercises enviados: ${total}`);
}

main().catch((error) => {
  console.error("Erro no upload para Firestore:", error);
  process.exit(1);
});
