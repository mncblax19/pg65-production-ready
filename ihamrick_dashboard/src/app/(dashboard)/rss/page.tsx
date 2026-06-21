'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import { ChevronLeft, ChevronRight, Loader2, User, Mail, Phone, Calendar } from 'lucide-react';
import { useGetRSSSubscriptionsQuery } from '../../../../services/allApi';
import { dateFormatter } from '@/utils/dateFormatter';

const ITEMS_PER_PAGE = 10;

export default function ManageRSSSubscriptions() {
  const [page, setPage] = useState(1);

  /* -------------------- API Hooks -------------------- */
  const { data, isLoading, isFetching } = useGetRSSSubscriptionsQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  /* -------------------- Data Logic -------------------- */
  const subscriptions = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="font-primary text-2xl font-bold tracking-tight md:text-3xl">
              RSS Subscriptions
            </h1>

            <UserProfile />
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-4xl border border-neutral-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b border-neutral-100 bg-neutral-50">
                  <tr className="text-left text-xs font-black tracking-widest text-neutral-500 uppercase">
                    <th className="px-6 py-5">Subscriber</th>
                    <th className="px-6 py-5">Contact Info</th>
                    <th className="px-6 py-5">Joined Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <Loader2 className="mx-auto h-10 w-10 animate-spin text-neutral-200" />
                      </td>
                    </tr>
                  ) : subscriptions.length > 0 ? (
                    subscriptions.map((sub: any) => (
                      <tr key={sub._id} className="group transition-colors hover:bg-neutral-50/30">
                        {/* Name & ID */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                              <User size={18} />
                            </div>
                            <div className="text-sm font-semibold text-neutral-800">{sub.name}</div>
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <Mail size={14} className="text-neutral-300" />
                              <span>{sub.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <Phone size={14} className="text-neutral-300" />
                              <span>{sub.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-neutral-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-neutral-300" />
                            <span className="font-medium">{dateFormatter(sub.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-24 text-center text-neutral-300">
                        No subscribers found
                      </td>
                    </tr>
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
    </div>
  );
}
