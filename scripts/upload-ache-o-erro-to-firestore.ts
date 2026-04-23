import { Firestore } from "@google-cloud/firestore";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Upload do catálogo de Ache o Erro para o Firestore.
 *
 * Lê os 4 arquivos JSON de `data/ache-o-erro/` e os consolida em um único
 * documento Firestore:
 *   collection: `ache_o_erro_catalog`
 *   document : `main`
 *
 * Estrutura do documento:
 *   { version, updatedAt, languages: { javascript, java, python, csharp } }
 *
 * O documento inteiro cabe num único documento Firestore (<1MB por linguagem)
 * pois cada JSON tem ~30KB.
 */

const COLLECTION_NAME =
  process.env.ACHE_ERRO_COLLECTION ?? "ache_o_erro_catalog";
const DOC_ID = "main";
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "cardmaster-934d5";

const LANGUAGE_FILES: { key: string; path: string }[] = [
  { key: "javascript", path: "data/ache-o-erro/javascript.json" },
  { key: "java",       path: "data/ache-o-erro/java.json" },
  { key: "python",     path: "data/ache-o-erro/python.json" },
  { key: "csharp",     path: "data/ache-o-erro/c-sharp.json" },
  { key: "sql",        path: "data/ache-o-erro/sql.json" },
];

async function loadServiceAccount() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountPath) return null;
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
  return new Firestore({ projectId: PROJECT_ID });
}

async function loadAllLanguages(): Promise<Record<string, unknown>> {
  const languages: Record<string, unknown> = {};
  let totalExercises = 0;

  for (const { key, path } of LANGUAGE_FILES) {
    const filePath = resolve(process.cwd(), path);
    const json = await readFile(filePath, "utf-8");
    const data = JSON.parse(json) as Record<string, unknown>;
    languages[key] = data;

    // Count exercises for logging
    const langData = (data as any)[key];
    if (langData?.levels) {
      for (const levelKey of Object.keys(langData.levels)) {
        const questions = langData.levels[levelKey]?.questions ?? [];
        totalExercises += questions.length;
        console.log(`  ${key}/${levelKey}: ${questions.length} exercícios`);
      }
    }
  }

  console.log(`\nTotal: ${totalExercises} exercícios em ${LANGUAGE_FILES.length} linguagens`);
  return languages;
}

async function main() {
  console.log("Carregando arquivos JSON...");
  const languages = await loadAllLanguages();

  const db = await createFirestoreClient();
  console.log(`\nIniciando upload para ${COLLECTION_NAME}/${DOC_ID} no projeto ${PROJECT_ID}...`);

  const docRef = db.collection(COLLECTION_NAME).doc(DOC_ID);
  await docRef.set(
    {
      version: "1.0",
      languages,
      updatedAt: new Date().toISOString(),
    },
    { merge: false },
  );

  console.log("Upload concluído com sucesso!");
}

main().catch((error) => {
  console.error("Erro no upload para Firestore:", error);
  process.exit(1);
});
