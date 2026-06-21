'use client';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Editor from '@/components/ui/editor';
import { toast } from 'react-toastify';
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from '../../../../../services/allApi';

export default function PrivacyPolicy() {
  const { data: { data: { content = '' } = {} } = {}, isLoading: isFetching } =
    useGetPrivacyPolicyQuery();

  const [updatePrivacyPolicy, { isLoading: isSaving }] = useUpdatePrivacyPolicyMutation();

  const handleSave = async (updatedContent: string) => {
    try {
      await updatePrivacyPolicy({ content: updatedContent }).unwrap();
      toast.success('Privacy Policy updated successfully');
    } catch {
      toast.error('Failed to update Privacy Policy');
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
          title="Privacy Policy"
          initialContent={content}
          onSave={handleSave}
          isFetching={isFetching}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
