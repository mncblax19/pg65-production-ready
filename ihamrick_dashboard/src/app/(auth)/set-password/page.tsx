'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import BrandSection from '@/components/auth/Brand-section';
import Header from '@/components/auth/Header';
import PasswordField from '@/components/auth/PasswordField';
import { useResetPasswordMutation } from '../../../../services/allApi';
import { RootState } from '../../../../services/store';

export default function SetPassword() {
  const router = useRouter();

  const { email, otp } = useSelector((state: RootState) => state.email);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleReset = async () => {
    try {
      const emailString = email ? email : '';
      const otpString = otp !== null && otp !== undefined ? String(otp) : '';
      const response = await resetPassword({
        email: emailString,
        newPassword,
        confirmPassword,
        otp: otpString,
      }).unwrap();

      if (response.success) {
        toast.success('Password reset successful!');
        setTimeout(() => {
          router.replace('/');
        }, 1200);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while resetting your password.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <BrandSection />

      <div className="flex h-screen w-full flex-col items-center justify-center px-6 py-12 lg:w-2/5 lg:px-8">
        <div className="w-full max-w-md">
          <Header
            title="Set A New Password"
            subtitle="Your new password must be different from previously used passwords."
          />
          <div className="flex flex-col gap-y-4">
            <PasswordField
              placeholder="New Password"
              password={newPassword}
              setPassword={setNewPassword}
            />
            <PasswordField
              placeholder="Confirm Password"
              password={confirmPassword}
              setPassword={setConfirmPassword}
              isConfirmPasswordField
            />

            <button
              onClick={handleReset}
              className="font-poppins mb-4 w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
