'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, Loader2, X, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdatePodcastMutation } from '../../../services/allApi';
import { SmartMediaUpload } from '../SmartMediaUpload';
import { fromZonedTime } from 'date-fns-tz';
import { dateFormatter } from '@/utils/dateFormatter';
import TiptapEditor from '../editor/TiptapEditor';

const PodcastEditModal = ({ podcast, refetch }: { podcast: any; refetch: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [updatePodcast, { isLoading: isUpdating }] = useUpdatePodcastMutation();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    status: '',
    description: '',
    transcription: '',
  });

  const [coverImage, setCoverImage] = useState<File | Blob | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (podcast && isModalOpen) {
      setFormData({
        title: podcast.title || '',
        date: podcast.date ? dateFormatter(podcast.date).split('T')[0] : '',
        status: podcast.status,
        description: podcast.description || '',
        transcription: podcast.transcription || '',
      });
      setImagePreview(podcast?.coverImageUrl || podcast?.coverImage || '');
    }
  }, [podcast, isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error('Title is required');

    const payload = new FormData();

    const utcDate = (() => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();

      let localDateStr = formData.date;

      if (!localDateStr) {
        localDateStr = now.toISOString().split('T')[0];
      }

      if (localDateStr) {
        try {
          let localDateTime = localDateStr;

          if (!localDateTime.includes('T')) {
            const currentTime = now.toTimeString().slice(0, 8);
            localDateTime = `${localDateTime}T${currentTime}`;
          }

          const zonedDate = fromZonedTime(localDateTime, timeZone);

          if (isNaN(zonedDate.getTime())) {
            return null;
          }

          return zonedDate.toISOString();
        } catch {
          return null;
        }
      }
      return null;
    })();

    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('transcription', formData.transcription);
    if (utcDate) payload.append('date', utcDate);
    payload.append('status', String(formData.status));

    if (coverImage) {
      payload.append('coverImage', coverImage);
    }

    try {
      await updatePodcast({ id: podcast._id || podcast.id, data: payload }).unwrap();
      refetch();
      toast.success('Podcast updated successfully');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update podcast');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-neutral-800 p-2 text-white transition-colors hover:bg-neutral-700"
        title="Edit Podcast"
      >
        <Pencil size={16} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-50 px-8 py-5">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Update Podcast</h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-gray-50 p-2.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Inputs */}
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Title
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Title"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm transition-all outline-none focus:border-black focus:ring-2 focus:ring-black/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm transition-all outline-none focus:border-black disabled:bg-gray-100 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      Status
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        disabled={podcast.status === 'scheduled' || podcast.status === 'live'}
                        onClick={() => setStatusOpen(!statusOpen)}
                        className={`flex h-12 w-full items-center justify-between rounded bg-gray-50 px-5 text-sm font-medium transition-all outline-none ${
                          podcast.status === 'scheduled' || podcast.status === 'live'
                            ? 'cursor-not-allowed bg-gray-100 opacity-60'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="capitalize">{formData.status || 'Select status'}</span>
                        {!(podcast.status === 'scheduled' || podcast.status === 'live') && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>

                      {statusOpen &&
                        !(podcast.status === 'scheduled' || podcast.status === 'live') && (
                          <div className="absolute z-99 mt-2 w-full overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black/5">
                            {['published', 'unpublished'].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setFormData((p) => ({ ...p, status: s as any }));
                                  setStatusOpen(false);
                                }}
                                className="block w-full px-5 py-3.5 text-left text-sm font-medium capitalize transition-all hover:bg-black hover:text-white"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Cover Image (optional)
                  </label>
                  <SmartMediaUpload
                    label="Click or drag to change cover"
                    allowedFormats={['image/*']}
                    className="h-full max-h-48"
                    onFileChange={(file, preview) => {
                      setCoverImage(file);
                      setImagePreview(preview);
                    }}
                    initialUrl={imagePreview}
                  />
                </div>
              </div>

              {/* Editors */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <TiptapEditor
                    value={formData.description}
                    onChange={(newContent) =>
                      setFormData((p) => ({ ...p, description: newContent }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Transcription
                  </label>

                  <TiptapEditor
                    value={formData.transcription}
                    onChange={(newContent) =>
                      setFormData((p) => ({ ...p, transcription: newContent }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-50 bg-gray-50/30 px-8 py-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:text-black"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 rounded bg-black px-10 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Podcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastEditModal;
