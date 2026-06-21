'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  ArrowUpDown,
  Video,
  Pin,
} from 'lucide-react';
import VideoUploadModal from '@/components/modal/videoUploadModal';
import { toast } from 'react-toastify';
import { VideoViewModal } from '@/components/modal/videoViewModal';
import VideoEditModal from '@/components/modal/videoEditModal';
import DeleteConfirmationModal from '@/components/modal/deleteModal';
import {
  useGetVideosQuery,
  useDeleteVideoMutation,
  useGetPinnedVideosQuery,
  useTogglePinVideosMutation,
} from '../../../../services/allApi';
import { dateFormatter } from '@/utils/dateFormatter';

const ITEMS_PER_PAGE = 10;

export default function ManageVideos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  // --- API Hooks ---
  const { data: pinnedData, refetch: refetchPinned } = useGetPinnedVideosQuery(undefined);

  const { data, isLoading, refetch, isFetching } = useGetVideosQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deleteVideo, { isLoading: deleteLoading }] = useDeleteVideoMutation();
  const [togglePin, { isLoading: isPinning }] = useTogglePinVideosMutation();

  // --- Data Logic (Like Blog) ---
  const videos = data?.data ?? [];
  const pinnedVideos = pinnedData?.data ?? [];
  const pinnedIds = new Set(pinnedVideos.map((v: any) => v._id));
  const totalPages = data?.meta?.totalPages ?? 1;

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
      toast.error(err?.data?.message || 'Failed to update pin');
    }
  };

  const confirmDelete = async () => {
    if (videoToDelete) {
      try {
        await deleteVideo(videoToDelete).unwrap();
        toast.success('Video deleted successfully');
        setDeleteModalOpen(false);
        setVideoToDelete(null);
        refetch();
        refetchPinned();
      } catch (err: any) {
        toast.error(err?.message || err?.data.message || 'Failed to delete video');
      }
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
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-black md:text-3xl">Manage Videos</h1>
            <UserProfile />
          </div>

          <div className="mb-6 flex justify-end">
            <VideoUploadModal
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
                      onClick={() => handleSort('uploadDate')}
                    >
                      <div className="flex items-center">
                        Upload Date {renderSortIcon('uploadDate')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 bg-white">
                  {/* --- 1. PINNED VIDEOS --- */}
                  {pinnedVideos.map((video: any) => (
                    <tr
                      key={`pinned-${video._id}`}
                      className="bg-blue-50/40 transition-colors hover:bg-blue-100/50"
                    >
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleTogglePin(video._id)}
                          disabled={isPinning}
                          className="text-blue-600"
                        >
                          <Pin size={18} fill="currentColor" className="rotate-45" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Video size={18} />
                          </div>
                          <div>
                            <p className="max-w-[180px] truncate text-sm font-bold text-neutral-800">
                              {video.title}
                            </p>
                            <span className="text-[10px] font-medium text-blue-500 uppercase">
                              Pinned
                            </span>
                          </div>
                        </div>
                      </td>
                      <VideoTableCells
                        video={video}
                        setVideoToDelete={setVideoToDelete}
                        setDeleteModalOpen={setDeleteModalOpen}
                        refetch={refetch}
                      />
                    </tr>
                  ))}

                  {/* --- 2. NORMAL VIDEOS --- */}
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-400" />
                      </td>
                    </tr>
                  ) : videos.filter((v: any) => !pinnedIds.has(v._id)).length > 0 ? (
                    videos
                      .filter((v: any) => !pinnedIds.has(v._id))
                      .map((video: any) => (
                        <tr key={video._id} className="transition-colors hover:bg-neutral-50">
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePin(video._id)}
                              disabled={isPinning}
                              className="text-neutral-300 hover:text-neutral-500"
                            >
                              <Pin size={18} className="rotate-45" />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                                <Video size={18} />
                              </div>
                              <span className="max-w-[180px] truncate text-sm font-semibold text-neutral-800">
                                {video.title}
                              </span>
                            </div>
                          </td>
                          <VideoTableCells
                            video={video}
                            setVideoToDelete={setVideoToDelete}
                            setDeleteModalOpen={setDeleteModalOpen}
                            refetch={refetch}
                          />
                        </tr>
                      ))
                  ) : (
                    pinnedVideos.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-neutral-400">
                          No videos found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4">
                <p className="text-sm text-neutral-600">
                  Page <span className="font-semibold">{currentPage}</span> of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
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

// Helper Cell Component
function VideoTableCells({ video, setVideoToDelete, setDeleteModalOpen, refetch }: any) {
  return (
    <>
      <td className="px-6 py-4 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-neutral-400" />
          {dateFormatter(video.uploadDate)}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
            video.status === 'published' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
          }`}
        >
          {video.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <VideoEditModal video={video} refetch={refetch} />
          <VideoViewModal video={video} />
          <button
            onClick={() => {
              setVideoToDelete(video._id);
              setDeleteModalOpen(true);
            }}
            className="rounded-lg bg-red-50 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </>
  );
}
