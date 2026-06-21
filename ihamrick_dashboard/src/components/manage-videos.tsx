'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { Video, ChevronRight, Eye } from 'lucide-react';

export function ManageVideos() {
  // Fetch the videos from the Redux state
  const videos = useSelector((state: RootState) => state.media.videos.data) || [];

  // Get the first 5 videos
  const limitedVideos = videos.slice(0, 5);

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      {/* Header with View All */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Recent Videos</h2>
        <Link
          href="/manage-videos"
          className="flex items-center text-sm font-semibold hover:text-blue-600 hover:underline"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-50 text-left text-xs font-black tracking-widest text-neutral-400 uppercase">
              <th className="pb-4">Video Details</th>
              <th className="pb-4">Thumbnail</th>
              <th className="hidden pb-4 sm:table-cell">Views</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {limitedVideos.length > 0 ? (
              limitedVideos.map((video: any, index: number) => (
                <tr key={index} className="group transition-colors hover:bg-neutral-50/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                        <Video size={16} />
                      </div>
                      <p className="max-w-[150px] truncate text-sm font-bold text-neutral-800">
                        {video.title}
                      </p>
                    </div>
                  </td>

                  <td className="py-4">
                    <div className="relative h-10 w-16 overflow-hidden rounded-lg border border-neutral-100 shadow-sm">
                      <Image
                        src={video.thumbnailUrl || '/path/to/default/thumbnail'}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>

                  <td className="hidden py-4 sm:table-cell">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-700">
                      <Eye size={14} className="text-neutral-400" />
                      {video.views?.toLocaleString() || 0}
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-tighter uppercase ${
                        video.status
                          ? 'bg-green-100 text-green-600'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {video.status ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-sm text-neutral-400">
                  No videos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
