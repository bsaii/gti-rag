import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { embeddings } from "./embedding";

export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ...timestamps,
});

export const faqsRelations = relations(faqs, ({ many }) => ({
  embeddings: many(embeddings),
}));

export const faqSelectSchema = createSelectSchema(faqs);
export const faqInsertSchema = createInsertSchema(faqs).extend({}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export const faqUpdateSchema = createUpdateSchema(faqs).extend({}).omit({
  createdAt: true,
  deletedAt: true,
  id: true,
  title: true,
  updatedAt: true,
});

export type Faq = z.infer<typeof faqSelectSchema>;
export type NewFaq = z.infer<typeof faqInsertSchema>;
export type UpdateFaq = z.infer<typeof faqUpdateSchema>;
