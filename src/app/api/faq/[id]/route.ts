import { faqs, UpdateFaq } from "@/db/schema/faq";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateEmbeddings } from "../lib";
import { embeddings as embeddingsTable } from "@/db/schema/embedding";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));

    if (!faq.id) {
      return Response.json({ message: "FAQ not found." }, { status: 404 });
    }

    return Response.json(faq.content);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const res = (await request.json()) as UpdateFaq;

    const [faq] = await db
      .update(faqs)
      .set({ content: res.content })
      .where(eq(faqs.id, id))
      .returning();

    const embeddings = await generateEmbeddings(faq.content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        faqId: faq.id,
        ...embedding,
      }))
    );

    return Response.json({ message: "FAQ successfully updated." });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
