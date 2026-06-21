'use client';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Editor from '@/components/ui/editor';
import { toast } from 'react-toastify';
import { useGetDisclaimerQuery, useUpdateDisclaimerMutation } from '../../../../../services/allApi';

export default function Disclaimer() {
  const { data: { data: { content = '' } = {} } = {}, isLoading: isFetching } =
    useGetDisclaimerQuery();

  const [updatePrivacyPolicy, { isLoading: isSaving }] = useUpdateDisclaimerMutation();

  const handleSave = async (updatedContent: string) => {
    try {
      await updatePrivacyPolicy({ content: updatedContent }).unwrap();
      toast.success('Disclaimer updated successfully');
    } catch {
      toast.error('Failed to update disclaimer');
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
          title="Disclaimer"
          initialContent={content}
          onSave={handleSave}
          isFetching={isFetching}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
