'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import Avatar from '@/assets/svg/Avatar.svg';

import { useGetCurrentUserQuery, useUpdateProfileMutation } from '../../../../../services/allApi';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STATE
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // API
  const { data: userData, isLoading, refetch } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // EFFECTS
  useEffect(() => {
    if (!userData?.data) return;

    setFormData({
      firstName: userData.data.userName || '',
      email: userData.data.email || '',
      phoneNumber: userData.data.phoneNumber || '',
      location: userData.data.location || '',
    });

    setPreviewImage(userData.data.profilePicture || null);
  }, [userData]);

  // HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = () => {
    router.push('/settings/profile/change-password');
  };

  const handleSaveChanges = async () => {
    const payload = new FormData();

    payload.append('userName', formData.firstName);
    payload.append('email', formData.email);
    payload.append('phoneNumber', formData.phoneNumber);
    payload.append('location', formData.location);

    if (profileImage) {
      payload.append('profilePicture', profileImage);
    }

    try {
      await updateProfile(payload).unwrap();
      refetch();

      toast.success('Changes saved successfully!', {
        autoClose: 2000,
      });
    } catch (error: any) {
      toast.error(
        error?.message || error?.data?.message || 'Failed to save changes. Please try again.',
      );
    }
  };

  // ============================
  // LOADING
  // ============================
  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  // ============================
  // RENDER
  // ============================
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 bg-gray-50 px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>

            <UserProfile />
          </div>

          {/* Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
            {/* Profile Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative cursor-pointer" onClick={handleImageClick}>
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-orange-100 sm:h-20 sm:w-20">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image src={Avatar} alt="Avatar" width={80} height={80} />
                    )}
                  </div>

                  <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#DD7372]">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {userData?.data?.userName}
                  </h2>
                  <p className="text-sm text-gray-500">{userData?.data?.email}</p>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                className="flex items-center gap-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Change Password
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Personal Information</h3>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Save */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveChanges}
                disabled={isUpdating}
                className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
