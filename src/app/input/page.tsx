"use client";

import { Button } from "@/components/ui/button";
import { Faq } from "@/db/schema/faq";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";

const EditorComponent = dynamic(() => import("../../components/Editor"), {
  ssr: false,
});

export default function Page() {
  const ref = useRef<MDXEditorMethods>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      const res = await fetch("/api/faq/99b2e0c5-0563-41a0-8bbf-cfb7fa869077");
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
      await fetch("/api/faq/99b2e0c5-0563-41a0-8bbf-cfb7fa869077", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
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
