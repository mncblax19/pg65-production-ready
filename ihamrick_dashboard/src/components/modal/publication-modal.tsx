'use client';

import type React from 'react';
import { useState } from 'react';
import { ChevronDown, X, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreatePublicationMutation } from '../../../services/allApi';
import { SmartMediaUpload } from '../SmartMediaUpload';
import { fromZonedTime } from 'date-fns-tz';
import TiptapEditor from '../editor/TiptapEditor';

interface PublicationFormState {
  title: string;
  author: string;
  publicationDate: string;
  status: 'Published' | 'Unpublished';
  description: string;
  cover: File | Blob | null;
  file: File | Blob | null;
}

export function PublicationModal({ refetch }: { refetch: any }) {
  const [formData, setFormData] = useState<PublicationFormState>({
    title: '',
    author: '',
    publicationDate: '',
    status: 'Published',
    description: '',
    cover: null,
    file: null,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Previews for SmartMediaUpload
  const [previews, setPreviews] = useState({ cover: '', file: '' });

  const [createPublication, { isLoading }] = useCreatePublicationMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.file) {
      toast.error('Please upload a file');
      return;
    }
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.author) {
      toast.error('Please enter an author');
      return;
    }

    const payload = new FormData();

    const utcDate = (() => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();

      let localDateStr = formData.publicationDate;

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
        } catch (error) {
          console.error('Date formatting error:', error);
          return null;
        }
      }
      return null;
    })();

    payload.append('title', formData.title);
    payload.append('author', formData.author);
    if (utcDate) payload.append('publicationDate', utcDate);
    payload.append('status', String(formData.status === 'Published'));
    payload.append('description', formData.description);

    if (formData.cover) payload.append('coverImage', formData.cover);
    payload.append('file', formData.file);

    // Extracting extension from file name if available
    const fileName = (formData.file as File).name || 'document.pdf';
    payload.append('fileType', fileName.split('.').pop() || 'pdf');

    try {
      await createPublication(payload).unwrap();
      refetch();
      toast.success('Publication created successfully');
      setIsOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create publication');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      publicationDate: '',
      status: 'Published',
      description: '',
      cover: null,
      file: null,
    });
    setPreviews({ cover: '', file: '' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all hover:bg-neutral-800 active:scale-95"
      >
        <Plus size={18} /> Add Publication
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-50 px-8 py-5">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Add New Publication
              </h2>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-gray-50 p-2.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* --- SMART MEDIA UPLOADER FOR COVER IMAGE --- */}
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Cover Image (optional)
                  </label>
                  <SmartMediaUpload
                    label="Select Cover Photo"
                    allowedFormats={['image/*']}
                    className="aspect-video rounded-3xl"
                    onFileChange={(file, preview) => {
                      setFormData((p) => ({ ...p, cover: file }));
                      setPreviews((p) => ({ ...p, cover: preview }));
                    }}
                    initialUrl={previews.cover}
                  />
                </div>

                {/* --- SMART MEDIA UPLOADER FOR PDF FILE --- */}
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    PDF Document
                  </label>
                  <SmartMediaUpload
                    label={formData.file ? (formData.file as File).name : 'CHOOSE PDF FILE'}
                    allowedFormats={['application/pdf']}
                    className="aspect-video rounded-3xl"
                    onFileChange={(file, preview) => {
                      setFormData((p) => ({ ...p, file: file }));
                      setPreviews((p) => ({ ...p, file: preview }));
                    }}
                    initialUrl={previews.file}
                  />
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Publication Title
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter descriptive title"
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Author Name
                  </label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Hamrick"
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Date
                  </label>
                  <input
                    type="date"
                    name="publicationDate"
                    value={formData.publicationDate}
                    onChange={handleChange}
                    className="h-12 w-full rounded bg-gray-50 px-5 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Visibility Status
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStatusOpen(!statusOpen)}
                      className="flex h-12 w-full items-center justify-between rounded bg-gray-50 px-5 text-sm font-medium outline-none"
                    >
                      {formData.status || 'Select status'}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {statusOpen && (
                      <div className="absolute z-99 mt-2 w-full overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black/5">
                        {['Published', 'Unpublished'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setFormData((p) => ({ ...p, status: s as any }));
                              setStatusOpen(false);
                            }}
                            className="block w-full px-5 py-3.5 text-left text-sm font-medium transition-all hover:bg-black hover:text-white"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                  Content Description
                </label>
                <TiptapEditor
                  value={formData.description}
                  onChange={(newContent) => setFormData((p) => ({ ...p, description: newContent }))}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-50 bg-gray-50/30 px-8 py-5">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded px-6 py-3 text-sm font-bold text-gray-400 transition-all hover:text-black"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 rounded bg-black px-10 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Publication'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
