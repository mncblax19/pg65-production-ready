'use client';

import React from 'react';
import { X, Calendar, Music, Headphones, CheckCircle, Clock } from 'lucide-react';
import { dateFormatter } from '@/utils/dateFormatter';
import TiptapViewer from '../editor/TiptapViewer';

interface ViewBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: any;
}

export function ViewBlogModal({ isOpen, onClose, blog }: ViewBlogModalProps) {
  if (!isOpen || !blog) return null;

  const audioSrc = blog.audioSignedUrl || blog.audioUrl;
  const isScheduled = blog.status === 'scheduled';

  // Status styling logic
  const statusStyles = {
    published: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    draft: 'bg-amber-100 text-amber-700',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="animate-in zoom-in z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- FIXED HEADER --- */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Blog Details</h2>
            <p className="mt-0.5 text-xs tracking-wider text-gray-400 uppercase">
              Resource ID: {blog?._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div className="flex-1 space-y-8 overflow-y-auto p-8">
          <div className="space-y-4">
            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${statusStyles[blog.status as keyof typeof statusStyles] || statusStyles.draft}`}
            >
              {blog.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
              {blog.status}
            </div>

            {/* Title */}
            <h1 className="text-3xl leading-tight font-extrabold text-gray-900">{blog.title}</h1>
          </div>

          {/* Info Grid (Author bad deoya hoyeche) */}
          <div className="grid grid-cols-1 gap-6 border-y border-gray-100 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  {isScheduled ? 'Scheduled For' : 'Upload Date'}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {isScheduled ? dateFormatter(blog?.scheduledAt) : dateFormatter(blog.uploadDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Audio Player Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
              <Music size={14} /> Audio File
            </label>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10">
              {audioSrc ? (
                <div className="w-full max-w-lg space-y-4">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl shadow-black/20">
                      <Headphones size={32} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="truncate px-4 text-sm font-medium text-neutral-600">
                      {blog.audioFileName ? blog.audioFileName.split('/').pop() : 'Audio Track'}
                    </p>
                  </div>
                  <audio controls src={audioSrc} className="h-12 w-full rounded-lg" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <Music size={40} className="opacity-20" />
                  <p className="text-sm font-medium">No audio file attached</p>
                </div>
              )}
            </div>
          </div>

          {/* Description Content */}
          <div className="space-y-3">
            <label className="block text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Content Description
            </label>
            <div className="rounded-2xl border border-gray-200 bg-white">
              <TiptapViewer content={blog.description} />
            </div>
          </div>
        </div>

        {/* --- FIXED FOOTER --- */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-xl bg-black px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-zinc-800 active:scale-95"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
