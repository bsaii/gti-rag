import { embeddingModel } from "@/lib/ai";
import { embedMany } from "ai";

function generateChunks(input: string): string[] {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
}

export async function generateEmbeddings(
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
}
