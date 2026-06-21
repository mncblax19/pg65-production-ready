'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { FontSize } from './extensions/FontSize';

export default function TiptapViewer({ content }: { content: string }) {
  const editor = useEditor({
    editable: false,
    content: content,
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      Underline,
      Superscript,
      Subscript,
      FontFamily,
      FontSize,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: 'text-blue-600 hover:text-blue-800 underline' },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: { class: 'rounded-lg max-w-full my-4 shadow-sm' },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="tiptap-viewer-container w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
