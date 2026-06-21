'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { useVerifyOtpMutation, useResendOtpMutation } from '../../../services/allApi'; // Import resendOtp mutation
import { RootState } from '../../../services/store';
import { setOtp } from '../../../services/slices/emailSlice'; // Import setOtp action

export default function OTPVerification() {
  const [otp, setOtpState] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize dispatch

  const email = useSelector((state: RootState) => state.email.email);
  const [verifyOtp, { isLoading, isError, isSuccess }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading, isError: resendError, isSuccess: resendSuccess }] =
    useResendOtpMutation();

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return; // Ensure value is a digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtpState(newOtp);

    // Join the array into a string, convert to a number, and dispatch
    const otpValue = newOtp.join('');
    if (otpValue.length === 6) {
      dispatch(setOtp(Number(otpValue))); // Convert to number before dispatching
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtpState(newOtp);
    const otpValue = newOtp.join('');
    if (otpValue.length === 6) {
      dispatch(setOtp(Number(otpValue))); // Convert to number before dispatching
    }

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      if (email) {
        try {
          await verifyOtp({ email, otp: otpValue }).unwrap();

          router.replace('/set-password');
        } catch (error) {
          console.error('OTP verification failed:', error);
        }
      } else {
        console.error('Email is missing!');
      }
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (email) {
      try {
        await resendOtp({ email: email }).unwrap();
      } catch {}
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-md">
      {/* OTP Input Fields */}
      <div className="mb-6 flex justify-center gap-3">
        {otp.map((digit, index) => (
          <div key={index} className="relative">
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="font-poppins h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold text-gray-900 transition-all focus:border-[#111] focus:ring-1 focus:ring-black focus:outline-none sm:h-14 sm:w-14 sm:text-xl"
              aria-label={`OTP digit ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={otp.join('').length !== 6 || isLoading}
        className="font-poppins mb-4 w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>

      {/* Resend Link */}
      <div className="font-poppins text-center text-sm text-gray-600 sm:text-base">
        Didn&apos;t receive the code?{' '}
        <button
          onClick={handleResend}
          className="font-semibold text-gray-900 transition-colors hover:text-blue-600 focus:underline focus:outline-none"
        >
          {resendLoading ? 'Resending...' : 'Click to resend OTP'}
        </button>
        {resendError && <p className="text-red-500">Failed to resend OTP. Try again.</p>}
        {resendSuccess && <p className="text-green-500">OTP resent successfully!</p>}
      </div>

      {/* Error Handling */}
      {isError && (
        <div className="mt-4 text-center text-sm text-red-500">Invalid OTP. Please try again.</div>
      )}
      {isSuccess && (
        <div className="mt-4 text-center text-sm text-green-500">OTP Verified successfully!</div>
      )}
    </div>
  );
}
