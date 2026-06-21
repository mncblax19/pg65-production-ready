'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import PasswordField from '@/components/auth/PasswordField';
import { useChangePasswordMutation } from '../../../../../../services/allApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    setIsSaving(true);

    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword,
      }).unwrap();

      toast.success('Password changed successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch {
      toast.error('Failed to change password. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      <div className="min-h-screen flex-1 items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header with User Badge */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/settings/profile"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Profile
            </Link>

            <UserProfile />
          </div>

          {/* Profile Card */}
          <div className="items-center justify-center rounded-xl bg-white p-6 shadow-sm sm:p-8">
            {/* Profile Header */}

            {/* Personal Information Form */}
            <div>
              <h3 className="font-poppins mb-6 text-lg font-semibold text-gray-900">
                Change Password
              </h3>

              <div className="space-y-6">
                {/* First Row: Current, New, and Confirm Password Fields */}
                <div className="flex flex-col gap-y-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="font-poppins mb-2 block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <PasswordField
                      placeholder="Type current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="font-poppins mb-2 block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <PasswordField
                      placeholder="Type new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="font-poppins mb-2 block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <PasswordField
                      placeholder="Type confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isSaving || isLoading}
                  className="font-poppins flex items-center gap-2 rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSaving || isLoading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
