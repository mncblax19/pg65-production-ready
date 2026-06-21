'use client';

import { useEffect, useState } from 'react';
import TiptapEditor from '../editor/TiptapEditor';

interface Props {
  title: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  isFetching: boolean;
  isSaving: boolean;
}

export default function AboutUsEditor({
  title,
  initialContent,
  onSave,
  isFetching,
  isSaving,
}: Props) {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (isFetching) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-64 rounded bg-gray-200" />
        <div className="mx-auto h-10 w-32 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">{title}</h1>

      <TiptapEditor value={initialContent} onChange={(newContent) => setContent(newContent)} />

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onSave(content)}
          disabled={isSaving}
          className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white disabled:bg-gray-400"
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
