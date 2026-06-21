'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { BookOpen, ChevronRight, User } from 'lucide-react';

export function ManagePublications() {
  // Fetch the publications from the Redux state
  const publications = useSelector((state: RootState) => state.media.publications.data) || [];

  // Get the first 5 publications
  const limitedPublications = publications.slice(0, 5);

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      {/* Header with View All */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-black">Recent Publications</h2>
        <Link
          href="/manage-publications"
          className="flex items-center text-sm font-semibold hover:text-blue-600 hover:underline"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-50 text-left text-xs font-black tracking-widest text-neutral-400 uppercase">
              <th className="pb-4">Publication Title</th>
              <th className="pb-4">Author</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {limitedPublications.length > 0 ? (
              limitedPublications.map((pub: any, index: number) => (
                <tr key={index} className="group transition-colors hover:bg-neutral-50/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                        <BookOpen size={16} />
                      </div>
                      <p className="max-w-[180px] truncate text-sm font-bold text-neutral-800">
                        {pub.title}
                      </p>
                    </div>
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <User size={14} className="text-neutral-400" />
                      <span className="max-w-[120px] truncate font-medium">
                        {pub.author || 'Unknown'}
                      </span>
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-tighter uppercase ${
                        pub.status
                          ? 'bg-green-100 text-green-600'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {pub.status ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-10 text-center text-sm text-neutral-400">
                  No publications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
