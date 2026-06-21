'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Cast, Loader2, Radio, StopCircle, Mic, ChevronRight } from 'lucide-react';
import {
  useGetPodcastsQuery,
  useEndPodcastMutation,
  useStartPodcastMutation,
} from '../../services/allApi';
import Link from 'next/link';

export function ManagePodcasts() {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // API Hooks
  const { data, isLoading, refetch, isFetching } = useGetPodcastsQuery({
    page: 1,
    limit: 5, // Fetch only what's needed for dashboard
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [startPodcast] = useStartPodcastMutation();
  const [endPodcast] = useEndPodcastMutation();

  // Handle Data Extraction
  const podcasts = data?.data?.podcasts || data?.data || [];
  const limitedPodcasts = podcasts.slice(0, 5);

  // --- Logic Handlers ---
  const startPodcastLive = async (id: string) => {
    setProcessingId(id);
    try {
      const res: any = await startPodcast(id).unwrap();
      toast.success('Podcast is now live');
      const liveSessionId = res?.data?.podcast?.liveSessionId;
      if (typeof window !== 'undefined') {
        localStorage.setItem(`podcast_live_${id}`, 'true');
      }
      router.push(`/broadcaster?podcastId=${id}&sessionId=${liveSessionId}`);
    } catch {
      toast.error('Failed to start live podcast');
    } finally {
      setProcessingId(null);
    }
  };

  const endPodcastLive = async (id: string) => {
    setProcessingId(id);
    try {
      await endPodcast(id).unwrap();
      toast.success('Podcast live ended');
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`podcast_live_${id}`);
      }
      refetch();
    } catch {
      toast.error('Failed to end live podcast');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Recent Podcasts</h2>
        <Link
          href="/manage-podcasts"
          className="flex items-center text-sm font-semibold hover:text-blue-600 hover:underline"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-50 text-left text-xs font-black tracking-widest text-neutral-400 uppercase">
              <th className="pb-4">Podcast</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={3} className="py-10 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-300" />
                </td>
              </tr>
            ) : limitedPodcasts.length > 0 ? (
              limitedPodcasts.map((podcast: any) => {
                const isProcessing = processingId === podcast._id;

                return (
                  <tr key={podcast._id} className="group transition-colors hover:bg-neutral-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                          <Mic size={16} />
                        </div>
                        <p className="max-w-[150px] truncate text-sm font-bold text-neutral-800">
                          {podcast.title}
                        </p>
                      </div>
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-tighter uppercase ${
                          podcast.status === 'live'
                            ? 'animate-pulse bg-red-500 text-white'
                            : podcast.status === 'scheduled'
                              ? 'bg-blue-600 text-white'
                              : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {podcast.status}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex gap-2">
                        {podcast.status === 'scheduled' && (
                          <button
                            onClick={() => startPodcastLive(podcast._id)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-[10px] font-black tracking-widest text-white hover:bg-neutral-800 disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Cast size={12} />
                            )}
                            GO LIVE
                          </button>
                        )}

                        {podcast.status === 'live' && (
                          <>
                            <button
                              onClick={() =>
                                router.push(
                                  `/broadcaster?podcastId=${podcast._id}&sessionId=${podcast.liveSessionId}`,
                                )
                              }
                              className="rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-700"
                              title="Enter Studio"
                            >
                              <Radio size={14} />
                            </button>
                            <button
                              onClick={() => endPodcastLive(podcast._id)}
                              disabled={isProcessing}
                              className="rounded-lg bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
                              title="Stop Podcast"
                            >
                              {isProcessing ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <StopCircle size={14} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="py-10 text-center text-sm text-neutral-400">
                  No podcasts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
