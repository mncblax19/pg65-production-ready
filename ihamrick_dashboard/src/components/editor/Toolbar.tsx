'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Link2,
  Image as ImageIcon,
  Superscript,
  Subscript,
  Eraser,
  Undo,
  Redo,
  Unlink,
  Heading1,
  Heading2,
  Heading3,
  FileImage,
  ExternalLink,
  TextQuote,
  Heading6,
  Heading5,
  Heading4,
  Check,
  Palette,
  Highlighter,
} from 'lucide-react';
import { Dropdown } from './Dropdown';

const fontFamilies = [
  'Inter',
  'Roboto',
  'Arial',
  'Arial Black',
  'Helvetica',
  'Verdana',
  'Trebuchet MS',
  'Tahoma',
  'Times New Roman',
  'Georgia',
  'EB Garamond',
  'Courier New',
  'Brush Script MT',
  'Comic Sans MS',
  'Impact',
  'Lucida Console',
  'Palatino',
];

const fontSizes = [
  '2px',
  '4px',
  '6px',
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '40px',
  '44px',
  '48px',
  '52px',
  '60px',
  '72px',
];

const tailwindFullPalette = {
  // Theme: All Gray/Neutral variations (50-950)
  theme: {
    slate: [
      '#f8fafc',
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8',
      '#64748b',
      '#475569',
      '#334155',
      '#1e293b',
      '#0f172a',
      '#020617',
    ],
    gray: [
      '#f9fafb',
      '#f3f4f6',
      '#e5e7eb',
      '#d1d5db',
      '#9ca3af',
      '#6b7280',
      '#4b5563',
      '#374151',
      '#1f2937',
      '#111827',
      '#030712',
    ],
    zinc: [
      '#fafafa',
      '#f4f4f5',
      '#e4e4e7',
      '#d4d4d8',
      '#a1a1aa',
      '#71717a',
      '#52525b',
      '#3f3f46',
      '#27272a',
      '#18181b',
      '#09090b',
    ],
    neutral: [
      '#fafafa',
      '#f5f5f5',
      '#e5e5e5',
      '#d4d4d4',
      '#a3a3a3',
      '#737373',
      '#525252',
      '#404040',
      '#262626',
      '#171717',
      '#0a0a0a',
    ],
    stone: [
      '#fafaf9',
      '#f5f5f4',
      '#e7e5e4',
      '#d6d3d1',
      '#a8a29e',
      '#78716c',
      '#57534e',
      '#44403c',
      '#292524',
      '#1c1917',
      '#0c0a09',
    ],
  },

  // Standard: All other color families (50-950)
  standard: {
    red: [
      '#fef2f2',
      '#fee2e2',
      '#fecaca',
      '#fca5a5',
      '#f87171',
      '#ef4444',
      '#dc2626',
      '#b91c1c',
      '#991b1b',
      '#7f1d1d',
      '#450a0a',
    ],
    orange: [
      '#fff7ed',
      '#ffedd5',
      '#fed7aa',
      '#fdba74',
      '#fb923c',
      '#f97316',
      '#ea580c',
      '#c2410c',
      '#9a3412',
      '#7c2d12',
      '#431407',
    ],
    amber: [
      '#fffbeb',
      '#fef3c7',
      '#fde68a',
      '#fcd34d',
      '#fbbf24',
      '#f59e0b',
      '#d97706',
      '#b45309',
      '#92400e',
      '#78350f',
      '#451a03',
    ],
    yellow: [
      '#fefce8',
      '#fef9c3',
      '#fef08a',
      '#fde047',
      '#facc15',
      '#eab308',
      '#ca8a04',
      '#a16207',
      '#854d0e',
      '#713f12',
      '#422006',
    ],
    lime: [
      '#f7fee7',
      '#ecfccb',
      '#d9f99d',
      '#bef264',
      '#a3e635',
      '#84cc16',
      '#65a30d',
      '#4d7c0f',
      '#3f6212',
      '#365314',
      '#1a2e05',
    ],
    green: [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0',
      '#86efac',
      '#4ade80',
      '#22c55e',
      '#16a34a',
      '#15803d',
      '#166534',
      '#14532d',
      '#052e16',
    ],
    emerald: [
      '#ecfdf5',
      '#d1fae5',
      '#a7f3d0',
      '#6ee7b7',
      '#34d399',
      '#10b981',
      '#059669',
      '#047857',
      '#065f46',
      '#064e3b',
      '#022c22',
    ],
    teal: [
      '#f0fdfa',
      '#ccfbf1',
      '#99f6e4',
      '#5eead4',
      '#2dd4bf',
      '#14b8a6',
      '#0d9488',
      '#0f766e',
      '#115e59',
      '#134e4a',
      '#042f2e',
    ],
    cyan: [
      '#ecfeff',
      '#cffafe',
      '#a5f3fc',
      '#67e8f9',
      '#22d3ee',
      '#06b6d4',
      '#0891b2',
      '#0e7490',
      '#155e75',
      '#164e63',
      '#083344',
    ],
    sky: [
      '#f0f9ff',
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e',
      '#082f49',
    ],
    blue: [
      '#eff6ff',
      '#dbeafe',
      '#bfdbfe',
      '#93c5fd',
      '#60a5fa',
      '#3b82f6',
      '#2563eb',
      '#1d4ed8',
      '#1e40af',
      '#1e3a8a',
      '#172554',
    ],
    indigo: [
      '#eef2ff',
      '#e0e7ff',
      '#c7d2fe',
      '#a5b4fc',
      '#818cf8',
      '#6366f1',
      '#4f46e5',
      '#4338ca',
      '#3730a3',
      '#312e81',
      '#1e1b4b',
    ],
    violet: [
      '#f5f3ff',
      '#ede9fe',
      '#ddd6fe',
      '#c4b5fd',
      '#a78bfa',
      '#8b5cf6',
      '#7c3aed',
      '#6d28d9',
      '#5b21b6',
      '#4c1d95',
      '#2e1065',
    ],
    purple: [
      '#faf5ff',
      '#f3e8ff',
      '#e9d5ff',
      '#d8b4fe',
      '#c084fc',
      '#a855f7',
      '#9333ea',
      '#7e22ce',
      '#6b21a8',
      '#581c87',
      '#3b0764',
    ],
    fuchsia: [
      '#fdf4ff',
      '#fae8ff',
      '#f5d0fe',
      '#f0abfc',
      '#e879f9',
      '#d946ef',
      '#c026d3',
      '#a21caf',
      '#86198f',
      '#701a75',
      '#4a044e',
    ],
    pink: [
      '#fdf2f8',
      '#fce7f3',
      '#fbcfe8',
      '#f9a8d4',
      '#f472b6',
      '#ec4899',
      '#db2777',
      '#be185d',
      '#9d174d',
      '#831843',
      '#500724',
    ],
    rose: [
      '#fff1f2',
      '#ffe4e6',
      '#fecdd3',
      '#fda4af',
      '#fb7185',
      '#f43f5e',
      '#e11d48',
      '#be123c',
      '#9f1239',
      '#881337',
      '#4c0519',
    ],
  },
};

const ToolbarButton = ({ onClick, active, icon: Icon, title, danger, disabled }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`rounded-lg p-2 transition-all duration-200 ${
      active
        ? 'bg-indigo-100 text-indigo-700 shadow-inner'
        : danger
          ? 'text-rose-500 hover:bg-rose-50'
          : disabled
            ? 'cursor-not-allowed opacity-30'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={18} strokeWidth={2.5} />
  </button>
);

export default function Toolbar({ editor }: { editor: Editor | null }) {
  const [linkInput, setLinkInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  if (!editor) return null;

  const [, setUpdate] = React.useState(0);
  React.useEffect(() => {
    if (!editor) return;
    const handler = () => setUpdate((prev) => prev + 1);
    editor.on('transaction', handler);
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

  const getActiveAlignIcon = () => {
    if (editor.isActive({ textAlign: 'center' })) return AlignCenter;
    if (editor.isActive({ textAlign: 'right' })) return AlignRight;
    if (editor.isActive({ textAlign: 'justify' })) return AlignJustify;
    return AlignLeft;
  };

  const getActiveListIcon = () => {
    if (editor.isActive('bulletList')) return List;
    if (editor.isActive('orderedList')) return ListOrdered;
    if (editor.isActive('taskList')) return CheckSquare;
    return List;
  };

  const getActiveHeadingIcon = () => {
    for (let l = 1; l <= 6; l++) {
      if (editor.isActive('heading', { level: l })) {
        const icons = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6];
        return icons[l - 1];
      }
    }
    return Heading1;
  };

  const setFont = (fontName: string) => {
    if (fontName === 'Inter') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(fontName).run();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run();
      reader.readAsDataURL(file);
    }
  };

  const detectedFont = editor.getAttributes('textStyle')?.fontFamily;
  const detectedSize = editor.getAttributes('textStyle')?.fontSize;
  const currentFont = detectedFont && fontFamilies.includes(detectedFont) ? detectedFont : 'Font';
  const currentSize = detectedSize && fontSizes.includes(detectedSize) ? detectedSize : 'Size';

  return (
    <div className="sticky top-0 z-30 flex flex-wrap items-center gap-1 rounded-t-2xl border-b border-slate-100 bg-white/95 px-3 py-2 backdrop-blur-md">
      {/* 1. History */}
      <div className="mr-1 flex items-center gap-0.5 border-r border-slate-200 pr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          title="Redo"
        />
      </div>

      {/* 2. Heading Dropdown */}
      <Dropdown icon={getActiveHeadingIcon()} title="Headings" active={editor.isActive('heading')}>
        {[1, 2, 3, 4, 5, 6].map((l) => {
          const HIcons: any = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6];
          const isActive = editor.isActive('heading', { level: l });
          return (
            <button
              key={l}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: l as any })
                  .run()
              }
              className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {React.createElement(HIcons[l - 1], { size: 16 })} Heading {l}
            </button>
          );
        })}
      </Dropdown>

      {/* Font Family & Size */}
      <Dropdown label={currentFont} title="Font Family" active={detectedFont}>
        <div className="custom-scrollbar max-h-60 overflow-y-auto">
          <button
            onClick={() => editor.chain().focus().unsetFontFamily().run()}
            className="dropdown-item text-gray-400 italic"
          >
            Default
          </button>
          <hr className="my-2 text-gray-100" />
          {fontFamilies.map((f) => (
            <button
              key={f}
              onClick={() => setFont(f)}
              className={`dropdown-item w-full px-3 py-2 text-left text-sm ${detectedFont === f ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </Dropdown>

      <Dropdown label={currentSize} title="Font Size" active={detectedSize}>
        <div className="custom-scrollbar max-h-60 overflow-y-auto">
          <button
            onClick={() => editor.chain().focus().unsetFontSize().run()}
            className="dropdown-item text-gray-400 italic"
          >
            Default
          </button>
          <hr className="my-2 text-gray-100" />
          {fontSizes.map((s) => (
            <button
              key={s}
              onClick={() => editor.chain().focus().setFontSize(s).run()}
              className={`dropdown-item w-full px-3 py-2 text-left text-sm ${detectedSize === s ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </Dropdown>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 3. Basic Formatting */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={Bold}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={Underline}
          title="Underline"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={Strikethrough}
          title="Strike"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={TextQuote}
          title="Blockquote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive('superscript')}
          icon={Superscript}
          title="Superscript"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={editor.isActive('subscript')}
          icon={Subscript}
          title="Subscript"
        />
      </div>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 4. Colors */}
      <div className="flex items-center gap-1">
        <Dropdown icon={Palette} title="Color" active={editor.getAttributes('textStyle').color}>
          <div className="custom-scrollbar max-h-72 space-y-4 overflow-y-auto p-3">
            {/* Automatic */}
            <button
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="w-full rounded px-2 py-1 text-left text-sm text-slate-600 hover:bg-slate-100"
            >
              Default
            </button>

            {/* Theme Colors */}
            {Object.entries(tailwindFullPalette.theme).map(([family, colors]) => (
              <div key={family}>
                <p className="mb-1 text-[11px] font-semibold text-slate-400 uppercase">{family}</p>
                <div className="flex flex-wrap items-center gap-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => editor.chain().focus().setColor(c).run()}
                      className="h-5 w-5 border border-gray-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Standard Colors */}
            {Object.entries(tailwindFullPalette.standard).map(([family, colors]) => (
              <div key={family}>
                <p className="mb-1 text-[11px] font-semibold text-slate-400 uppercase">{family}</p>
                <div className="flex flex-wrap items-center gap-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => editor.chain().focus().setColor(c).run()}
                      className="h-5 w-5 border border-gray-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Dropdown>

        <Dropdown icon={Highlighter} title="Highlight" active={editor.isActive('highlight')}>
          <div className="custom-scrollbar max-h-72 space-y-4 overflow-y-auto p-3">
            {/* None */}
            <button
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="w-full rounded px-2 py-1 text-left text-sm text-slate-600 hover:bg-slate-100"
            >
              None
            </button>

            {/* Theme */}
            {Object.entries(tailwindFullPalette.theme).map(([family, colors]) => (
              <div key={family}>
                <p className="mb-1 text-[11px] font-semibold text-slate-400 uppercase">{family}</p>
                <div className="flex flex-wrap items-center gap-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => editor.chain().focus().setHighlight({ color: c }).run()}
                      className="h-5 w-5 border border-gray-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Standard */}
            {Object.entries(tailwindFullPalette.standard).map(([family, colors]) => (
              <div key={family}>
                <p className="mb-1 text-[11px] font-semibold text-slate-400 uppercase">{family}</p>
                <div className="flex flex-wrap items-center gap-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => editor.chain().focus().setHighlight({ color: c }).run()}
                      className="h-5 w-5 border border-gray-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Dropdown>
      </div>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* 5. Alignment Dropdown */}
      <Dropdown
        icon={getActiveAlignIcon()}
        title="Alignment"
        active={
          editor.isActive({ textAlign: 'center' }) ||
          editor.isActive({ textAlign: 'right' }) ||
          editor.isActive({ textAlign: 'justify' })
        }
      >
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignLeft size={16} /> Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignCenter size={16} /> Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignRight size={16} /> Right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive({ textAlign: 'justify' }) ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <AlignJustify size={16} /> Justify
        </button>
      </Dropdown>

      {/* 6. List Dropdown */}
      <Dropdown
        icon={getActiveListIcon()}
        title="Lists"
        active={
          editor.isActive('bulletList') ||
          editor.isActive('orderedList') ||
          editor.isActive('taskList')
        }
      >
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive('bulletList') ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <List size={16} /> Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive('orderedList') ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <ListOrdered size={16} /> Order List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${editor.isActive('taskList') ? 'bg-indigo-50 font-bold text-indigo-600' : 'hover:bg-slate-50'}`}
        >
          <CheckSquare size={16} /> Task List
        </button>
      </Dropdown>

      {/* 7. Link & Image */}
      <div className="ml-1 flex items-center gap-1 border-l border-slate-200 pl-2">
        <Dropdown icon={Link2} title="Link Options" active={editor.isActive('link')}>
          <div className="flex min-w-[260px] flex-col gap-2 p-3">
            <h4 className="px-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {editor.isActive('link') ? 'Edit Link' : 'Insert Link'}
            </h4>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
              <div className="pl-1 text-slate-400">
                <ExternalLink size={14} />
              </div>
              <input
                type="text"
                placeholder="https://example.com"
                className="flex-1 bg-transparent py-1 text-xs text-slate-700 outline-none placeholder:text-slate-400"
                value={linkInput || editor.getAttributes('link').href || ''}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const finalUrl = linkInput || editor.getAttributes('link').href;
                    if (finalUrl) {
                      editor.chain().focus().setLink({ href: finalUrl }).run();
                      setLinkInput('');
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const finalUrl = linkInput || editor.getAttributes('link').href;
                  if (finalUrl) {
                    editor.chain().focus().setLink({ href: finalUrl }).run();
                    setLinkInput('');
                  }
                }}
                className="rounded-lg bg-indigo-600 p-1.5 text-white shadow-sm transition-transform hover:bg-indigo-700 active:scale-95"
              >
                <Check size={14} strokeWidth={3} />
              </button>
            </div>
            {editor.isActive('link') && (
              <button
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setLinkInput('');
                }}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-transparent py-2 text-xs font-semibold text-rose-500 transition-colors hover:border-rose-100 hover:bg-rose-50"
              >
                <Unlink size={14} /> Remove Link
              </button>
            )}
          </div>
        </Dropdown>

        <Dropdown icon={ImageIcon} title="Image Options">
          <div className="flex min-w-[260px] flex-col gap-3 p-3">
            <div>
              <h4 className="mb-2 px-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Image URL
              </h4>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <div className="pl-1 text-slate-400">
                  <ImageIcon size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Paste image link..."
                  className="flex-1 bg-transparent py-1 text-xs text-slate-700 outline-none placeholder:text-slate-400"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (imageInput) {
                      editor.chain().focus().setImage({ src: imageInput }).run();
                      setImageInput('');
                    }
                  }}
                  className="rounded-lg bg-indigo-600 p-1.5 text-white shadow-sm transition-transform hover:bg-indigo-700 active:scale-95"
                >
                  <Check size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-[10px] font-medium text-slate-300 uppercase">
                  OR
                </span>
              </div>
            </div>
            <label className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-600 transition-all hover:border-indigo-400 hover:bg-indigo-50/30">
              <FileImage
                size={18}
                className="text-slate-400 transition-colors group-hover:text-indigo-500"
              />
              <span className="text-xs group-hover:text-indigo-600">Upload from Device</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>
        </Dropdown>
      </div>

      {/* 8. Eraser at Right Side */}
      <div className="ml-auto">
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          icon={Eraser}
          danger
          title="Clear Formatting"
        />
      </div>
    </div>
  );
}
