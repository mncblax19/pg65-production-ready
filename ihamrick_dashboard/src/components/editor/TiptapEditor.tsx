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
import Toolbar from './Toolbar';
import { FontSize } from './extensions/FontSize';

export default function TiptapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
        blockquote: {},
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: false,
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
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === 'Tab') {
          if (editor?.isActive('bulletList') || editor?.isActive('orderedList')) {
            editor.commands.sinkListItem('listItem');
            return true;
          }
        }
        return false;
      },
      attributes: {
        class: 'focus:outline-none min-h-[400px]',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200">
      {editor && <Toolbar editor={editor} />}
      <div className="custom-scrollbar max-h-[65vh] min-h-80 w-full overflow-y-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
