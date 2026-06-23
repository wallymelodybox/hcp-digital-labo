import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(dataDir, fileName);
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(fileName: string, data: T) {
  await ensureDataDir();
  const filePath = path.join(dataDir, fileName);
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
