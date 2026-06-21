'use client';
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateBlogMutation, useUpdateBlogMutation } from '../../../services/allApi';
import { SmartMediaUpload } from '../SmartMediaUpload';
import { fromZonedTime } from 'date-fns-tz';
import { dateFormatter } from '@/utils/dateFormatter';
import TiptapEditor from '../editor/TiptapEditor';

interface UploadModalProps {
  selectedBlog?: any | null;
  onCloseTrigger?: () => void;
  refetch: () => void;
}

export default function UploadModal({ selectedBlog, onCloseTrigger, refetch }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    status: 'published' as 'published' | 'scheduled' | 'unpublished',
    date: '',
    description: '',
  });

  const [audioData, setAudioData] = useState<{ file: File | Blob | null; preview: string }>({
    file: null,
    preview: '',
  });

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (selectedBlog) {
      const postDate =
        selectedBlog.status === 'scheduled'
          ? dateFormatter(selectedBlog.scheduledAt, { unformatted: true })
          : dateFormatter(selectedBlog.uploadDate, { unformatted: true });

      setFormState({
        title: selectedBlog.title,
        status: selectedBlog.status,
        date: postDate
          ? selectedBlog.status === 'scheduled'
            ? postDate?.substring(0, 16)
            : postDate?.split('T')[0]
          : '',
        description: selectedBlog.description,
      });

      const existingAudio = selectedBlog.audioSignedUrl || selectedBlog.audioUrl;
      setAudioData({ file: null, preview: existingAudio || '' });

      setIsOpen(true);
    }
  }, [selectedBlog]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseTrigger) onCloseTrigger();
  };

  const validateForm = () => {
    if (!formState.title.trim()) {
      toast.error('Title is required!');
      return false;
    }
    if (!formState.date && (formState.status === 'published' || formState.status === 'scheduled')) {
      toast.error('Please select a date!');
      return false;
    }
    if (
      (!formState.description.trim() || formState.description === '<p><br></p>') &&
      (formState.status === 'published' || formState.status === 'scheduled')
    ) {
      toast.error('Description is empty!');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();

    const utcDate = (() => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();

      let localDateStr = formState.date;

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

    if (formState.date && !utcDate) {
      toast.error('Invalid date format selected!');
      return;
    }

    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('status', formState.status);

    if (utcDate) {
      if (formState.status === 'scheduled') {
        formData.append('scheduledAt', utcDate);
      } else {
        formData.append('uploadDate', utcDate);
      }
    }

    if (audioData.file) formData.append('audio', audioData.file);

    try {
      if (selectedBlog) {
        await updateBlog({ id: selectedBlog._id, data: formData }).unwrap();
        toast.success('Article updated!');
      } else {
        await createBlog({ data: formData }).unwrap();
        toast.success('Article published!');
      }
      refetch();
      setFormState({ title: '', status: 'published', date: '', description: '' });
      setAudioData({ file: null, preview: '' });
      handleClose();
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <>
      {!selectedBlog && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-neutral-800"
        >
          <Plus size={18} /> Add New Blog
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleClose} />

          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in zoom-in z-10 flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-300"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-50 bg-white/90 px-8 py-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-black p-2.5 text-white shadow-xl shadow-black/20">
                  <FileText size={22} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-800">
                  {selectedBlog ? 'Modify Blog' : 'Create Blog'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto bg-[#fcfcfc] p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded border border-neutral-200 bg-white px-5 py-4 transition-all outline-none focus:border-black focus:ring-4 focus:ring-black/5"
                    placeholder="Enter blog title..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formState.status}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, status: e.target.value as any }))
                      }
                      className="w-full cursor-pointer appearance-none rounded border border-neutral-200 bg-white px-5 py-4 font-bold text-neutral-700 outline-none focus:border-black"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                    <Clock
                      className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-neutral-400"
                      size={18}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    {formState.status === 'scheduled' ? (
                      <Clock size={14} />
                    ) : (
                      <Calendar size={14} />
                    )}
                    {formState.status === 'scheduled'
                      ? 'Scheduling Time'
                      : formState.status === 'unpublished'
                        ? 'Publication Date (optional)'
                        : 'Publication Date'}
                  </label>
                  <input
                    type={formState.status === 'scheduled' ? 'datetime-local' : 'date'}
                    value={formState.date}
                    onChange={(e) => setFormState((p) => ({ ...p, date: e.target.value }))}
                    className="w-full rounded border border-neutral-200 bg-white px-5 py-4 font-medium transition-all outline-none focus:border-black disabled:cursor-default! disabled:opacity-30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                  Audio File (Optional)
                </label>
                <SmartMediaUpload
                  label="Drop Audio Track or Click"
                  allowedFormats={['audio/*']}
                  className="h-[180px]"
                  onFileChange={(file, preview) => setAudioData({ file, preview })}
                  initialUrl={audioData.preview}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                  Description
                </label>

                <TiptapEditor
                  value={formState.description}
                  onChange={(newContent) =>
                    setFormState((p) => ({ ...p, description: newContent }))
                  }
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-4 border-t border-neutral-100 bg-white px-8 py-5">
              <button
                disabled={isLoading}
                onClick={handleClose}
                className="rounded-2xl px-6 py-3 text-sm font-bold text-neutral-400 transition-all hover:bg-neutral-50 hover:text-neutral-800"
              >
                Discard
              </button>
              <button
                disabled={isLoading}
                onClick={handleSave}
                className="flex min-w-[200px] items-center justify-center gap-3 rounded-2xl bg-black px-10 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-2xl shadow-black/20 transition-all hover:bg-neutral-800 active:scale-95 disabled:bg-neutral-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                  </>
                ) : selectedBlog ? (
                  'Update Blog'
                ) : (
                  'Publish Blog'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
