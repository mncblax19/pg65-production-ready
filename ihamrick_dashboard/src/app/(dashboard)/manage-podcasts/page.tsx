'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Loader2,
  Cast,
  StopCircle,
  Radio,
  ArrowUpDown,
  Mic,
  Pin,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import PodcastsUploadModal from '@/components/modal/podcastUpload';
import PodcastsEditModal from '@/components/modal/podcastsEdit';
import { PodcastsViewModal } from '@/components/modal/podcastsViewModal';
import DeleteConfirmationModal from '@/components/modal/deleteModal';
import {
  useGetPodcastsQuery,
  useDeletePodcastMutation,
  useEndPodcastMutation,
  useStartPodcastMutation,
  useGetPinnedPodcastsQuery,
  useTogglePinPodcastsMutation,
} from '../../../../services/allApi';
import { dateFormatter } from '@/utils/dateFormatter';

const ITEMS_PER_PAGE = 10;

export default function ManagePodcasts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [podcastToDelete, setPodcastToDelete] = useState<string | null>(null);

  const router = useRouter();

  // --- API Hooks ---
  const { data: pinnedData, refetch: refetchPinned } = useGetPinnedPodcastsQuery(undefined);

  const { data, isLoading, refetch, isFetching } = useGetPodcastsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deletePodcast, { isLoading: deleteLoading }] = useDeletePodcastMutation();
  const [togglePin, { isLoading: isPinning }] = useTogglePinPodcastsMutation();
  const [startPodcast] = useStartPodcastMutation();
  const [endPodcast] = useEndPodcastMutation();

  // --- Logic ---
  const podcasts = data?.data?.podcasts || data?.data || [];
  const pinnedPodcasts = pinnedData?.data?.podcasts || [];
  const pinnedIds = new Set(pinnedPodcasts.map((p: any) => p._id));

  const totalPages = data?.data?.pagination?.totalPages || data?.meta?.totalPages || 1;

  // --- Handlers ---
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleTogglePin = async (id: string) => {
    try {
      await togglePin(id).unwrap();
      toast.success('Pin status updated');
      refetch();
      refetchPinned();
    } catch (err: any) {
      toast.error(err?.message || err?.data.message || 'Failed to update pin');
    }
  };

  const confirmDelete = async () => {
    if (podcastToDelete) {
      try {
        await deletePodcast(podcastToDelete).unwrap();
        toast.success('Podcast deleted successfully');
        setDeleteModalOpen(false);
        setPodcastToDelete(null);
        refetch();
        refetchPinned();
      } catch (err: any) {
        toast.error(err?.message || err?.data.message || 'Failed to delete podcast');
      }
    }
  };

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
      refetchPinned();
    } catch {
      toast.error('Failed to end live podcast');
    } finally {
      setProcessingId(null);
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown size={14} className="ml-1 text-neutral-300" />;
    return (
      <ArrowUpDown
        size={14}
        className={`ml-1 ${sortOrder === 'asc' ? 'rotate-180 text-blue-600' : 'text-blue-600'}`}
      />
    );
  };

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="font-primary text-2xl font-bold text-black md:text-3xl">
              Manage Podcasts
            </h1>
            <UserProfile />
          </div>

          <div className="mb-6 flex justify-end">
            <PodcastsUploadModal
              refetch={() => {
                refetch();
                refetchPinned();
              }}
            />
          </div>

          <div className="overflow-hidden rounded-3xl border border-neutral-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-100 bg-neutral-50">
                  <tr className="text-left text-xs font-black tracking-widest text-neutral-500 uppercase">
                    <th className="w-10 px-6 py-4 text-center">Pin</th>
                    <th className="cursor-pointer px-6 py-4" onClick={() => handleSort('title')}>
                      <div className="flex items-center">Title {renderSortIcon('title')}</div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-4"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">Date {renderSortIcon('createdAt')}</div>
                    </th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Live Control</th>
                    <th className="px-6 py-4 text-center">Manage</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 bg-white">
                  {/* --- 1. PINNED PODCASTS --- */}
                  {pinnedPodcasts.map((podcast: any) => (
                    <tr
                      key={`pinned-${podcast._id}`}
                      className="bg-blue-50/40 transition-colors hover:bg-blue-100/50"
                    >
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleTogglePin(podcast._id)}
                          disabled={isPinning}
                          className="text-blue-600"
                        >
                          <Pin size={18} fill="currentColor" className="rotate-45" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Mic size={18} />
                          </div>
                          <div>
                            <p className="max-w-[180px] truncate text-sm font-bold text-neutral-800">
                              {podcast.title}
                            </p>
                            <span className="text-[10px] font-bold text-blue-500 uppercase">
                              Pinned
                            </span>
                          </div>
                        </div>
                      </td>
                      <PodcastTableCells
                        podcast={podcast}
                        processingId={processingId}
                        startPodcastLive={startPodcastLive}
                        endPodcastLive={endPodcastLive}
                        setPodcastToDelete={setPodcastToDelete}
                        setDeleteModalOpen={setDeleteModalOpen}
                        refetch={refetch}
                        router={router}
                      />
                    </tr>
                  ))}

                  {/* --- 2. NORMAL PODCASTS --- */}
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-400" />
                      </td>
                    </tr>
                  ) : podcasts.filter((p: any) => !pinnedIds.has(p._id)).length > 0 ? (
                    podcasts
                      .filter((p: any) => !pinnedIds.has(p._id))
                      .map((podcast: any) => (
                        <tr key={podcast._id} className="transition-colors hover:bg-neutral-50">
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePin(podcast._id)}
                              disabled={isPinning}
                              className="text-neutral-300 hover:text-neutral-500"
                            >
                              <Pin size={18} className="rotate-45" />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                                <Mic size={18} />
                              </div>
                              <span className="max-w-[180px] truncate text-sm font-semibold text-neutral-800">
                                {podcast.title}
                              </span>
                            </div>
                          </td>
                          <PodcastTableCells
                            podcast={podcast}
                            processingId={processingId}
                            startPodcastLive={startPodcastLive}
                            endPodcastLive={endPodcastLive}
                            setPodcastToDelete={setPodcastToDelete}
                            setDeleteModalOpen={setDeleteModalOpen}
                            refetch={refetch}
                            router={router}
                          />
                        </tr>
                      ))
                  ) : (
                    pinnedPodcasts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-20 text-center text-neutral-400">
                          No podcasts found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4">
                <p className="text-sm font-bold tracking-widest text-neutral-600 uppercase">
                  Page <span className="text-black">{currentPage}</span> of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 items-center gap-1 rounded-xl border border-neutral-200 px-4 text-sm font-bold transition-all hover:bg-neutral-50 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex h-10 items-center gap-1 rounded-xl border border-neutral-200 px-4 text-sm font-bold transition-all hover:bg-neutral-50 disabled:opacity-30"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
}

// Helper component for common columns
function PodcastTableCells({
  podcast,
  processingId,
  startPodcastLive,
  endPodcastLive,
  setPodcastToDelete,
  setDeleteModalOpen,
  refetch,
  router,
}: any) {
  const isProcessingThisRow = processingId === podcast._id;

  return (
    <>
      <td className="px-6 py-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-neutral-300" />
          <span className="font-medium">{dateFormatter(podcast.date || podcast.createdAt)}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2 font-mono">
          <Clock size={14} className="text-neutral-300" />
          {podcast.duration || '00:00'}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
            podcast.status === 'live'
              ? 'animate-pulse bg-red-500 text-white shadow-lg shadow-red-200'
              : podcast.status === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 text-neutral-500'
          }`}
        >
          {podcast.status}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {podcast.status === 'scheduled' && (
            <button
              onClick={() => startPodcastLive(podcast._id)}
              disabled={isProcessingThisRow}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-[10px] font-black tracking-widest text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {isProcessingThisRow ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Cast size={14} />
              )}{' '}
              GO LIVE
            </button>
          )}
          {podcast.status === 'live' && (
            <>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined')
                    localStorage.setItem(`podcast_live_${podcast._id}`, 'true');
                  router.push(
                    `/broadcaster?podcastId=${podcast._id}&sessionId=${podcast.liveSessionId}`,
                  );
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black tracking-widest text-white hover:bg-indigo-700"
              >
                <Radio size={14} /> STUDIO
              </button>
              <button
                onClick={() => endPodcastLive(podcast._id)}
                disabled={isProcessingThisRow}
                className="flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-[10px] font-black tracking-widest text-red-600 hover:bg-red-200"
              >
                {isProcessingThisRow ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <StopCircle size={14} />
                )}{' '}
                STOP
              </button>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <PodcastsEditModal podcast={podcast} refetch={refetch} />
          <PodcastsViewModal podcast={podcast} refetch={refetch} />
          <button
            onClick={() => {
              setPodcastToDelete(podcast._id);
              setDeleteModalOpen(true);
            }}
            className="rounded-xl bg-red-50 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </>
  );
}
