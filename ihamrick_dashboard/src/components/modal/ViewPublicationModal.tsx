'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { X, Eye, Calendar, User, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { dateFormatter } from '@/utils/dateFormatter';
import TiptapViewer from '../editor/TiptapViewer';

interface Publication {
  _id: string;
  title: string;
  author: string;
  publicationDate: string;
  status: boolean;
  description: string;
  coverImage: string;
  file: string;
}

export function ViewPublicationModal({ publication }: { publication: Publication }) {
  const [isOpen, setIsOpen] = useState(false);

  // Status mapping based on boolean
  const statusLabel = publication?.status ? 'Published' : 'Unpublished';
  const statusColor = publication?.status
    ? 'bg-green-100 text-green-700'
    : 'bg-amber-100 text-amber-700';

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download file');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        aria-label="View Details"
      >
        <Eye className="h-4 w-4" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div
            className="animate-in zoom-in z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Publication Details</h2>
                <p className="mt-0.5 text-xs tracking-wider text-gray-400 uppercase">
                  Resource ID: {publication?._id}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 space-y-8 overflow-y-auto p-8">
              <div className="space-y-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm">
                  <Image
                    src={publication?.coverImage}
                    alt={publication?.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${statusColor}`}
                  >
                    {publication?.status ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {statusLabel}
                  </div>
                  <h1 className="text-3xl leading-tight font-extrabold text-gray-900">
                    {publication?.title}
                  </h1>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 border-y border-gray-100 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        Author
                      </p>
                      <p className="text-sm font-semibold text-gray-800">{publication?.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        Published On
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {dateFormatter(publication?.publicationDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    About this Publication
                  </h3>

                  <div className="rounded-2xl border border-gray-200 bg-white">
                    <TiptapViewer content={publication.description} />
                  </div>
                </div>

                {/* File Attachment Card */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {publication?.file
                          ? publication?.file.split('/').pop()?.split('_').pop()
                          : 'No file attached'}
                      </p>
                      <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        PDF Resource
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(publication?.file, 'publication-file')}
                      className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                      title="Download File"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-8 py-5">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-black px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-zinc-800 active:scale-95"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
