/* eslint-disable @next/next/no-img-element */
'use client';

import { Edit3, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export const MediaPreview = ({ file, previewUrl, thumbnail, onResize, onChange }: any) => {
  const getFileType = () => {
    if (file?.type) return file.type;
    if (!previewUrl) return '';

    const cleanUrl = previewUrl.split('?')[0].toLowerCase();

    if (cleanUrl.endsWith('.pdf') || previewUrl.includes('pdf')) return 'application/pdf';
    if (
      ['mp4', 'webm', 'mov'].some((ext) => cleanUrl.endsWith(ext)) ||
      previewUrl.includes('/videos/')
    )
      return 'video/mp4';
    if (['mp3', 'wav'].some((ext) => cleanUrl.endsWith(ext)) || previewUrl.includes('/audios/'))
      return 'audio/mpeg';

    return 'image/jpeg';
  };

  const type = getFileType();
  const isImage = type.startsWith('image/');
  const isVideo = type.startsWith('video/');
  const isAudio = type.startsWith('audio/');
  const isPDF = type.includes('pdf');

  const canResize = isImage && file !== null;

  return (
    <div className="group relative size-full overflow-hidden rounded-3xl">
      <div className="relative size-full overflow-hidden transition-all duration-500">
        {isImage && (
          <img
            src={previewUrl}
            alt="preview"
            className="size-full object-contain transition-all duration-500"
          />
        )}

        {isVideo && (
          <video
            src={previewUrl}
            poster={thumbnail}
            controls
            className="h-full w-full bg-black object-contain"
          />
        )}

        {isAudio && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-100 p-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10">
              <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.045-3 2.333S3.343 18.667 5 18.667s3-1.045 3-2.334V5.48l9-1.8V14.114A4.369 4.369 0 0016 14c-1.657 0-3 1.045-3 2.333s1.343 2.334 3 2.334s3-1.045 3-2.334V3z"></path>
              </svg>
            </div>
            <audio src={previewUrl} controls className="w-full" />
          </div>
        )}

        {isPDF && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-white p-6">
            <div className="mb-4 flex h-20 w-16 items-center justify-center rounded-lg border-2 border-red-100 bg-red-50">
              <span className="text-xs font-bold text-red-500">PDF</span>
            </div>
            <Link
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-zinc-900 px-6 py-2 text-[11px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-black"
            >
              Preview Document
            </Link>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300">
        {canResize && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResize();
            }}
            className="group/btn relative flex items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 p-3.5 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_25px_-5px_rgba(79,70,229,0.5)] active:scale-95"
            title="Resize New Upload"
          >
            <Edit3 size={18} strokeWidth={2.5} className="drop-shadow-md" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover/btn:opacity-100" />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange();
          }}
          className="group/btn relative flex items-center justify-center rounded-2xl bg-linear-to-tr from-rose-600 to-pink-500 p-3.5 text-white shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_25px_-5px_rgba(225,29,72,0.5)] active:scale-95"
          title="Change File"
        >
          <RotateCcw size={18} strokeWidth={2.5} className="drop-shadow-md" />
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover/btn:opacity-100" />
        </button>
      </div>
    </div>
  );
};
