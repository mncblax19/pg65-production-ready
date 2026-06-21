'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  Music,
  FileText,
  Calendar,
  Pin,
} from 'lucide-react';
import UploadModal from '@/components/modal/uploadModal';
import { ViewBlogModal } from '@/components/modal/viewModal';
import DeleteConfirmationModal from '@/components/modal/deleteModal';
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useTogglePinBlogMutation,
  useGetPinnedBlogsQuery,
} from '../../../../services/allApi';
import { toast } from 'react-toastify';
import { dateFormatter } from '@/utils/dateFormatter';

const ITEMS_PER_PAGE = 10;

export default function ManageBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [blogToView, setBlogToView] = useState<any | null>(null);

  // --- API Hooks ---
  const { data: pinnedData, refetch: refetchPinned } = useGetPinnedBlogsQuery(undefined);

  const { data, isLoading, refetch, isFetching } = useGetBlogsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
  });

  const [deleteBlog, { isLoading: deleteLoading }] = useDeleteBlogMutation();
  const [togglePin, { isLoading: isPinning }] = useTogglePinBlogMutation();

  useEffect(() => {
    if (data?.data) setBlogs(data.data);
  }, [data]);

  const totalBlogs = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(totalBlogs / ITEMS_PER_PAGE);

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
    if (blogToDelete) {
      try {
        await deleteBlog(blogToDelete).unwrap();
        toast.success('Blog deleted successfully');
        setDeleteModalOpen(false);
        setBlogToDelete(null);
        refetch();
        refetchPinned();
      } catch (err: any) {
        toast.error(err?.message || err?.data.message || 'Failed to delete blog');
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

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`h-10 w-10 rounded-lg text-sm font-medium ${
            currentPage === i ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  const pinnedIds = new Set(pinnedData?.data?.map((b: any) => b._id) || []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-black md:text-3xl">Manage Blog</h1>
            <UserProfile />
          </div>

          <div className="mb-6 flex justify-end">
            <UploadModal
              refetch={() => {
                refetch();
                refetchPinned();
              }}
              selectedBlog={selectedBlog}
              onCloseTrigger={() => setSelectedBlog(null)}
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
                    <th className="px-6 py-4">Audio Track</th>
                    <th
                      className="cursor-pointer px-6 py-4"
                      onClick={() => handleSort('uploadDate')}
                    >
                      <div className="flex items-center">Date {renderSortIcon('uploadDate')}</div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-4 text-center"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        Status {renderSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {/* --- 1. Pinned Blogs Render (Always on top) --- */}
                  {pinnedData?.data?.map((blog: any) => (
                    <tr
                      key={`pinned-${blog._id}`}
                      className="bg-blue-50/40 transition-colors hover:bg-blue-100/50"
                    >
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleTogglePin(blog._id)}
                          disabled={isPinning}
                          className="text-blue-600"
                        >
                          <Pin size={18} fill="currentColor" className="rotate-45" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="max-w-[180px] truncate text-sm font-bold text-neutral-800">
                              {blog.title}
                            </p>
                            <span className="text-[10px] font-medium text-blue-500 uppercase">
                              Pinned
                            </span>
                          </div>
                        </div>
                      </td>
                      {/* Common columns (Shared with Normal Blogs) */}
                      <BlogTableCells
                        blog={blog}
                        setSelectedBlog={setSelectedBlog}
                        setBlogToDelete={setBlogToDelete}
                        setDeleteModalOpen={setDeleteModalOpen}
                        setBlogToView={setBlogToView}
                        setIsViewModalOpen={setIsViewModalOpen}
                      />
                    </tr>
                  ))}

                  {/* --- 2. Normal Blogs Render --- */}
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-400" />
                      </td>
                    </tr>
                  ) : blogs.filter((b) => !pinnedIds.has(b._id)).length > 0 ? (
                    blogs
                      .filter((b) => !pinnedIds.has(b._id))
                      .map((blog) => (
                        <tr key={blog._id} className="transition-colors hover:bg-neutral-50">
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePin(blog._id)}
                              disabled={isPinning}
                              className="text-neutral-300 hover:text-neutral-500"
                            >
                              <Pin size={18} className="rotate-45" />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                                <FileText size={18} />
                              </div>
                              <span className="max-w-[180px] truncate text-sm font-semibold text-neutral-800">
                                {blog.title}
                              </span>
                            </div>
                          </td>
                          <BlogTableCells
                            blog={blog}
                            setSelectedBlog={setSelectedBlog}
                            setBlogToDelete={setBlogToDelete}
                            setDeleteModalOpen={setDeleteModalOpen}
                            setBlogToView={setBlogToView}
                            setIsViewModalOpen={setIsViewModalOpen}
                          />
                        </tr>
                      ))
                  ) : (
                    pinnedData?.data?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-neutral-400">
                          No blogs found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 bg-white px-6 py-4">
                <p className="text-sm text-neutral-600">
                  Page <span className="font-semibold">{currentPage}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>
                  <div className="hidden gap-1 md:flex">{renderPageNumbers()}</div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex h-10 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm transition-all hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Next <ChevronRight className="h-4 w-4" />
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
      <ViewBlogModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        blog={blogToView}
      />
    </div>
  );
}

// Helper component to avoid repetitive code for common columns
function BlogTableCells({
  blog,
  setSelectedBlog,
  setBlogToDelete,
  setDeleteModalOpen,
  setBlogToView,
  setIsViewModalOpen,
}: any) {
  return (
    <>
      <td className="px-6 py-4">
        {blog.audioSignedUrl || blog.audioUrl ? (
          <div className="flex items-center gap-2">
            <Music size={16} className="text-neutral-400" />
            <audio
              controls
              src={blog.audioSignedUrl || blog.audioUrl}
              className="h-10 w-40 md:w-52"
            />
          </div>
        ) : (
          <span className="text-xs text-neutral-400 italic">No Audio</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-neutral-300" />
          <span className="font-medium">
            {blog?.status === 'scheduled'
              ? dateFormatter(blog?.scheduledAt)
              : dateFormatter(blog.uploadDate)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${blog.status === 'published' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'}`}
        >
          {blog.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedBlog(blog)}
            className="rounded-lg bg-neutral-100 p-2 transition-all hover:bg-black hover:text-white"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => {
              setBlogToDelete(blog._id);
              setDeleteModalOpen(true);
            }}
            className="rounded-lg bg-red-50 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => {
              setBlogToView(blog);
              setIsViewModalOpen(true);
            }}
            className="rounded-lg bg-neutral-100 p-2 transition-all hover:bg-black hover:text-white"
            title="View Details"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </>
  );
}
