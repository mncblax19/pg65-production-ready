'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function ManageBlog() {
  // Fetch the blogs from the Redux state
  const blogs = useSelector((state: RootState) => state.media.blogs.data) || [];

  // Get the first 5 blogs
  const limitedBlogs = blogs.slice(0, 5);

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      {/* Header with View All */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Recent Blog</h2>
        <Link
          href="/manage-blog"
          className="flex items-center text-sm font-semibold hover:text-blue-600 hover:underline"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-50 text-left text-xs font-black tracking-widest text-neutral-400 uppercase">
              <th className="pb-4">Blog Title</th>
              <th className="pb-4">Audio Track</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {limitedBlogs.map((blog, index) => (
              <tr key={index} className="border-b border-neutral-100 last:border-0">
                <td className="font-poppins max-w-40 truncate py-3 pr-3 text-left text-base font-normal text-[#333333]">
                  {blog.title}
                </td>
                <td className="font-poppins py-3 pr-3 text-left text-base font-normal text-[#333333]">
                  {blog.audioSignedUrl || blog.audioUrl ? (
                    <audio
                      controls
                      src={blog.audioSignedUrl || blog.audioUrl}
                      className="h-12 w-44 md:w-60"
                    />
                  ) : (
                    <span className="text-xs text-neutral-400 italic">No Audio</span>
                  )}
                </td>
                <td className="font-poppins py-3 pr-3 text-left text-base font-normal text-[#333333]">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-tighter uppercase ${
                      blog.status
                        ? 'bg-green-100 text-green-600' // Better contrast for "Published"
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {blog.status ? 'Published' : 'Unpublished'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
