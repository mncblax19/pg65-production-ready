'use client';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Editor from '@/components/ui/editor';
import { toast } from 'react-toastify';
import {
  useGetFooterText2Query,
  useUpdateFooterText2Mutation,
} from '../../../../../services/allApi';

export default function FooterText2() {
  const { data: { data: { content = '' } = {} } = {}, isLoading: isFetching } =
    useGetFooterText2Query();

  const [updatePrivacyPolicy, { isLoading: isSaving }] = useUpdateFooterText2Mutation();

  const handleSave = async (updatedContent: string) => {
    try {
      await updatePrivacyPolicy({ content: updatedContent }).unwrap();
      toast.success('Footer text 2 updated successfully');
    } catch {
      toast.error('Failed to update footer text 2');
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
          title="Footer text 2"
          initialContent={content}
          onSave={handleSave}
          isFetching={isFetching}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
