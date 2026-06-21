'use client';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Editor from '@/components/ui/editor';
import { toast } from 'react-toastify';
import { useGetAboutUsQuery, useUpdateAboutUsMutation } from '../../../../../services/allApi';

export default function AboutUs() {
  const { data: { data: { content = '' } = {} } = {}, isLoading: isFetching } =
    useGetAboutUsQuery();

  const [updateAboutUs, { isLoading: isSaving }] = useUpdateAboutUsMutation();

  const handleSave = async (updatedContent: string) => {
    try {
      await updateAboutUs({ content: updatedContent }).unwrap();
      toast.success('About Us updated successfully');
    } catch {
      toast.error('Failed to update About Us');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 bg-gray-50 px-4 py-8 lg:ml-64 lg:px-8">
        <div className="mb-8 flex justify-end">
          <UserProfile />
        </div>

        <Editor
          title="About Us"
          initialContent={content}
          onSave={handleSave}
          isFetching={isFetching}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
