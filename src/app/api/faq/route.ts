import { faqInsertSchema, faqs, NewFaq } from "@/db/schema/faq";
import { db } from "@/lib/db";
import { embeddings as embeddingsTable } from "@/db/schema/embedding";
import { generateEmbeddings } from "./lib";

export async function POST(request: Request) {
  try {
    const res = (await request.json()) as NewFaq;

    const { content, title } = faqInsertSchema.parse(res);

    const [faq] = await db.insert(faqs).values({ content, title }).returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        faqId: faq.id,
        ...embedding,
      }))
    );

    return Response.json(
      { message: "FAQ successfully created and embbeded." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
