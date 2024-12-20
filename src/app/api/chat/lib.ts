import { embeddings } from "@/db/schema/embedding";
import { embeddingModel } from "@/lib/ai";
import { db } from "@/lib/db";
import { embed } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

export async function generateEmbedding(value: string): Promise<number[]> {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
}

export async function findRelevantContent(userQuery: string) {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides.map((item) => item.name.trim()).join(" ");
}
