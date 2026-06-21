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
  BookOpen,
  User,
  Pin,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { EditPublicationModal } from '@/components/modal/edit-publications';
import { ViewPublicationModal } from '@/components/modal/ViewPublicationModal';
import { PublicationModal } from '@/components/modal/publication-modal';
import DeleteConfirmationModal from '@/components/modal/deleteModal';
import {
  useGetPublicationsQuery,
  useDeletePublicationMutation,
  useGetPinnedPublicationsQuery,
  useTogglePinPublicationsMutation,
} from '../../../../services/allApi';
import { newDateFormatter } from '@/utils/newDateFormatter';

const ITEMS_PER_PAGE = 10;

export default function ManagePublications() {
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState('publicationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  /* -------------------- API Hooks -------------------- */
  const { data: pinnedData, refetch: refetchPinned } = useGetPinnedPublicationsQuery(undefined);

  const { data, isLoading, refetch, isFetching } = useGetPublicationsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deletePublication, { isLoading: deleting }] = useDeletePublicationMutation();
  const [togglePin, { isLoading: isPinning }] = useTogglePinPublicationsMutation();

  /* -------------------- Data Logic -------------------- */
  const publications = data?.data ?? [];
  const pinnedPublications = pinnedData?.data ?? [];
  const pinnedIds = new Set(pinnedPublications.map((p: any) => p._id));
  const totalPages = data?.meta?.totalPages ?? 1;

  /* -------------------- Handlers -------------------- */
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
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
    if (!selectedPublicationId) return;
    try {
      await deletePublication(selectedPublicationId).unwrap();
      toast.success('Publication deleted successfully');
      setDeleteModalOpen(false);
      refetch();
      refetchPinned();
    } catch {
      toast.error('Failed to delete publication');
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
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="font-primary text-2xl font-bold tracking-tight md:text-3xl">
              Manage Publications
            </h1>
            <UserProfile />
          </div>

          <div className="mb-6 flex justify-end">
            <PublicationModal
              refetch={() => {
                refetch();
                refetchPinned();
              }}
            />
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-4xl border border-neutral-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b border-neutral-100 bg-neutral-50">
                  <tr className="text-left text-xs font-black tracking-widest text-neutral-500 uppercase">
                    <th className="w-14 px-6 py-5 text-center">Pin</th>
                    <th className="cursor-pointer px-6 py-5" onClick={() => handleSort('title')}>
                      <div className="flex items-center">Title {renderSortIcon('title')}</div>
                    </th>
                    <th className="cursor-pointer px-6 py-5" onClick={() => handleSort('author')}>
                      <div className="flex items-center">Author {renderSortIcon('author')}</div>
                    </th>

                    <th
                      className="cursor-pointer px-6 py-5"
                      onClick={() => handleSort('publicationDate')}
                    >
                      <div className="flex items-center">
                        Date {renderSortIcon('publicationDate')}
                      </div>
                    </th>
                    <th className="cursor-pointer px-6 py-5" onClick={() => handleSort('status')}>
                      <div className="flex items-center">Status {renderSortIcon('status')}</div>
                    </th>
                    <th className="px-6 py-5 text-center">Manage</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {/* --- PINNED PUBLICATIONS --- */}
                  {pinnedPublications.map((pub: any) => (
                    <tr
                      key={`pinned-${pub._id}`}
                      className="bg-blue-50/30 transition-colors hover:bg-blue-100/40"
                    >
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleTogglePin(pub._id)}
                          disabled={isPinning}
                          className="text-blue-600"
                        >
                          <Pin size={18} fill="currentColor" className="rotate-45" />
                        </button>
                      </td>
                      <PublicationTableCells
                        pub={pub}
                        isPinned={true}
                        setSelectedId={setSelectedPublicationId}
                        setModal={setDeleteModalOpen}
                        refetch={refetch}
                      />
                    </tr>
                  ))}

                  {/* --- REGULAR PUBLICATIONS --- */}
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <Loader2 className="mx-auto h-10 w-10 animate-spin text-neutral-200" />
                      </td>
                    </tr>
                  ) : publications.filter((p: any) => !pinnedIds.has(p._id)).length > 0 ? (
                    publications
                      .filter((p: any) => !pinnedIds.has(p._id))
                      .map((pub: any) => (
                        <tr
                          key={pub._id}
                          className="group transition-colors hover:bg-neutral-50/30"
                        >
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePin(pub._id)}
                              disabled={isPinning}
                              className="text-neutral-300 hover:text-neutral-500"
                            >
                              <Pin size={18} className="rotate-45" />
                            </button>
                          </td>
                          <PublicationTableCells
                            pub={pub}
                            isPinned={false}
                            setSelectedId={setSelectedPublicationId}
                            setModal={setDeleteModalOpen}
                            refetch={refetch}
                          />
                        </tr>
                      ))
                  ) : (
                    pinnedPublications.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-24 text-center text-neutral-300">
                          No publications found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-100 bg-white px-8 py-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black tracking-[0.15em] text-neutral-400 uppercase">
                    Page <span className="text-black">{page}</span> of {totalPages}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="flex h-11 items-center gap-2 rounded-2xl border border-neutral-200 px-5 text-xs font-bold transition-all hover:bg-neutral-50 disabled:opacity-30"
                    >
                      <ChevronLeft size={16} /> PREV
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="flex h-11 items-center gap-2 rounded-2xl border border-neutral-200 px-5 text-xs font-bold transition-all hover:bg-neutral-50 disabled:opacity-30"
                    >
                      NEXT <ChevronRight size={16} />
                    </button>
                  </div>
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
        isLoading={deleting}
      />
    </div>
  );
}

// Sub-component for Table Cells to reduce repetition
function PublicationTableCells({ pub, isPinned, setSelectedId, setModal, refetch }: any) {
  return (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isPinned ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-500'}`}
          >
            <BookOpen size={18} />
          </div>
          <div>
            <p className="max-w-60 truncate text-sm font-semibold text-neutral-800">{pub.title}</p>
            {isPinned && (
              <span className="text-[10px] font-bold text-blue-500 uppercase">Pinned</span>
            )}
          </div>
        </div>
      </td>
      <td className="max-w-54 px-6 py-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <User size={14} className="text-neutral-300" />
          <span className="truncate font-medium">{pub.author}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-neutral-300" />
          <span className="font-medium">{newDateFormatter(pub.publicationDate)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
            pub.status ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
          }`}
        >
          {pub.status ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <EditPublicationModal publication={pub} refetch={refetch} />
          <ViewPublicationModal publication={pub} />
          <button
            onClick={() => {
              setSelectedId(pub._id);
              setModal(true);
            }}
            className="rounded-xl bg-red-50 p-2.5 text-red-500 transition-all hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </>
  );
}
