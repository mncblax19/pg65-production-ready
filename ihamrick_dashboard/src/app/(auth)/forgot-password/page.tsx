'use client';
import BrandSection from '@/components/auth/Brand-section';
import EmailField from '@/components/auth/EmailField';
import Header from '@/components/auth/Header';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setEmail } from '../../../../services/slices/emailSlice';
import { useForgotPasswordMutation } from '../../../../services/allApi';
export default function ForgetPassword() {
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize dispatch

  // State to hold email value and errors
  const [email, setEmailState] = useState('');
  const [emailError, setEmailError] = useState('');
  const [forgotPassword, { isLoading, isError, isSuccess }] = useForgotPasswordMutation();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    if (!email) {
      setEmailError('Please enter your email.');
      return;
    }

    // Dispatch the email to Redux store
    dispatch(setEmail(email));

    try {
      await forgotPassword({ email }).unwrap();
      router.replace('/mail-check');
    } catch {
      // Handle API error (show message)
      setEmailError('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <BrandSection />
      {/* right-side */}
      <div className="flex h-screen w-full flex-col items-center justify-center px-6 py-12 lg:w-2/5 lg:px-8">
        <div className="max-w-md">
          <Header
            title="Forgot Your Password?"
            subtitle="No worries, we'll send you reset instructions."
          />
          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailField
              value={email}
              onChange={(e) => {
                setEmailState(e.target.value);
                setEmailError(''); // Clear error when user types
              }}
              error={emailError}
            />
            <button
              type="submit"
              disabled={isLoading} // Disable button while loading
              className="font-poppins h-12 w-full rounded-lg bg-black text-base font-medium text-white transition-colors hover:bg-black/90"
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </button>
            {isError && (
              <p className="mt-2 text-sm text-red-500">Something went wrong, please try again.</p>
            )}
            {isSuccess && <p className="mt-2 text-sm text-green-500">Password reset email sent!</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
