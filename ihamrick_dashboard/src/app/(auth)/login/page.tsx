'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BrandSection from '@/components/auth/Brand-section';
import Header from '@/components/auth/Header';
import EmailField from '@/components/auth/EmailField';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../../../../services/allApi';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation(); // Extract isLoading here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      toast.error('Password is required.');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();

      if (res.success) {
        toast.success('Login successful!');

        // Store token in cookie so middleware can check it
        document.cookie = `Ihamrickadmindashboardtoken=${res.data.token}; path=/;`;

        setTimeout(() => {
          router.replace('/dashboard');
        }, 800);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Invalid credentials.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <BrandSection />
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-2/5 lg:px-8">
        <div className="w-full max-w-md">
          <Header title="Hello Again!" subtitle="Welcome Back" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              error={emailError}
            />

            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-300 bg-white pr-12 pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              className={`h-12 w-full rounded-lg text-white ${isLoading ? 'cursor-not-allowed bg-gray-400' : 'bg-black hover:bg-gray-800'}`}
              disabled={isLoading} // Disable the button when loading
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-3 text-end">
            <Link href="/forgot-password" className="text-sm text-red-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
