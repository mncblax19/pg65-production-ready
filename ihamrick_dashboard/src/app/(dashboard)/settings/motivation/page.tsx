'use client';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Editor from '@/components/ui/editor';
import { toast } from 'react-toastify';
import { useGetMotivationQuery, useUpdateMotivationMutation } from '../../../../../services/allApi';

export default function Motivation() {
  const { data: { data: { content = '' } = {} } = {}, isLoading: isFetching } =
    useGetMotivationQuery();

  const [updatePrivacyPolicy, { isLoading: isSaving }] = useUpdateMotivationMutation();

  const handleSave = async (updatedContent: string) => {
    try {
      await updatePrivacyPolicy({ content: updatedContent }).unwrap();
      toast.success('Motivation updated successfully');
    } catch {
      toast.error('Failed to update motivation');
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
          title="Motivation"
          initialContent={content}
          onSave={handleSave}
          isFetching={isFetching}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
