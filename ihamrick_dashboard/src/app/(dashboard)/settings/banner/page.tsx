'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import { SmartMediaUpload } from '@/components/SmartMediaUpload';
import { Pencil, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetWebsiteImagesQuery,
  useUpdateWebsiteImagesMutation,
} from '../../../../../services/allApi';
import Image from 'next/image';

export default function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageData, setImageData] = useState({ file: null, preview: '' });

  const { data, isLoading, isFetching } = useGetWebsiteImagesQuery();
  const [updateImage, { isLoading: isUpdating }] = useUpdateWebsiteImagesMutation();

  const currentImage = Array.isArray(data) ? data[0] : data?.data?.[0];

  const openModal = () => {
    setImageData({ file: null, preview: currentImage?.image || '' });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!imageData.file) return toast.error('Please select an image first');

    const formData = new FormData();
    formData.append('image', imageData.file);

    try {
      await updateImage({
        id: currentImage?._id || currentImage?.id,
        updatedImage: formData,
      }).unwrap();
      toast.success('Image updated successfully');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBFBFC]">
      <Sidebar />
      <main className="flex-1 p-8 lg:ml-64">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Website Banner</h1>
            <p className="mt-1 font-medium text-gray-500">
              Manage your website&apos;s main visual asset
            </p>
          </div>
          <UserProfile />
        </div>

        {/* Full-Width Image Display */}
        <div className="relative w-full max-w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          {isLoading || isFetching ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="animate-spin text-gray-300" size={40} />
            </div>
          ) : currentImage ? (
            <>
              <Image
                src={currentImage.image}
                alt="Website Image"
                width={1920}
                height={600}
                className="h-auto w-full object-cover"
              />
              <button
                onClick={openModal}
                className="absolute top-4 right-4 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-white shadow-lg transition hover:bg-black"
              >
                <Pencil size={16} />
                Update Image
              </button>
            </>
          ) : (
            <div className="flex h-96 items-center justify-center text-gray-400 italic">
              No image found
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
            <div className="z-10 w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
              <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-6">
                <h2 className="text-2xl font-black text-gray-900">Update Image</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full bg-gray-50 p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <SmartMediaUpload
                label="Drop Website Image"
                allowedFormats={['image/*']}
                className="mb-8 aspect-video w-full"
                onFileChange={(file: any, preview: any) => setImageData({ file, preview })}
                initialUrl={imageData.preview}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-gray-400 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-2xl bg-black px-10 py-3.5 font-bold text-white shadow-lg active:scale-95 disabled:bg-gray-300"
                >
                  {isUpdating && <Loader2 size={18} className="animate-spin" />}
                  Update Image
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
