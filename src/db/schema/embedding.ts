import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { faqs } from "./faq";

export const embeddings = pgTable(
  "embeddings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    faqId: uuid("faq_id").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  faq: one(faqs, {
    fields: [embeddings.faqId],
    references: [faqs.id],
  }),
}));
