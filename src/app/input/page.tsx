"use client";

import { Button } from "@/components/ui/button";
import { Faq } from "@/db/schema/faq";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import removeMdx from "remove-markdown";

const EditorComponent = dynamic(() => import("../../components/Editor"), {
  ssr: false,
});

export default function Page() {
  const ref = useRef<MDXEditorMethods>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      const res = await fetch("/api/faq/ec656a8e-970d-473c-8793-f3b301748ce6");
      const data = (await res.json()) as Faq["content"];
      ref.current?.setMarkdown(data);
    }
    fetchContent();
  }, []);

  const handleSave = async () => {
    const content = ref.current?.getMarkdown();
    if (!content) return;

    try {
      setSaving(true);
      const plainText = removeMdx(content);
      await fetch("/api/faq/ec656a8e-970d-473c-8793-f3b301748ce6", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: plainText }),
      });
      setSaving(false);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='container mx-auto max-w-4xl w-full my-32 input-page'>
        <div className='border-2 my-4'>
          <Suspense fallback={null}>
            <EditorComponent markdown='# WELCOME' editorRef={ref} />
          </Suspense>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {" "}
          {saving ? "Saving..." : "Save"}{" "}
        </Button>
      </div>
    </>
  );
}
