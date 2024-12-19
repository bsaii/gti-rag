"use client";

import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";

const EditorComponent = dynamic(() => import("../../components/Editor"), {
  ssr: false,
});

export default function Page() {
  const ref = useRef<MDXEditorMethods>(null);

  return (
    <>
      <div className='container mx-auto max-w-4xl w-full my-32 border-2 input-page'>
        <Suspense fallback={null}>
          <EditorComponent markdown='# hello there' editorRef={ref} />
        </Suspense>
      </div>
    </>
  );
}
