'use client';
import { dateFormatter } from '@/utils/dateFormatter';
import { formatFileSize } from '@/utils/formatFileSize';
import { Eye, X, Calendar, File, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import TiptapViewer from '../editor/TiptapViewer';

export function VideoViewModal({ video }: { video: any }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);

  if (!video) return null;
  return (
    <>
      <button
        onClick={() => setViewModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white hover:bg-neutral-700"
      >
        <Eye className="h-4 w-4" />
      </button>

      {viewModalOpen && (
        <div
          onClick={() => setViewModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="absolute inset-0" onClick={() => setViewModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="font-poppins relative z-10 max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
          >
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Video Details</h2>
              <p className="text-sm text-gray-500">View detailed video information</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${video.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {video.status}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Upload Date</p>
                    <p className="text-sm font-medium"> {dateFormatter(video.uploadDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="text-sm font-medium">{video.views || 0} views</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                  <File className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">File Size</p>
                    <p className="text-sm font-medium"> {formatFileSize(video.fileSize)}</p>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="overflow-hidden rounded-lg border bg-black shadow-inner">
                <video
                  src={video.signedUrl || video.videoUrl}
                  poster={video.thumbnailUrl}
                  controls
                  className="h-64 w-full object-contain md:h-96"
                >
                  Your browser does not support video.
                </video>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Description */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">Description</h3>
                  <div className="rounded-2xl border border-gray-200 bg-white">
                    <TiptapViewer content={video.description || 'No description provided.'} />
                  </div>
                </div>
                {/* Transcription */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">Transcription</h3>
                  <div
                    className="prose prose-sm max-h-40 max-w-none overflow-y-auto rounded-lg bg-gray-50 p-4 text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: video.transcription || 'No transcription available.',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
