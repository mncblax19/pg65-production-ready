'use client';

import { Mail } from 'lucide-react';

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // Accept error prop
}

export default function EmailField({ value, onChange, error }: EmailFieldProps) {
  return (
    <div className="relative">
      <label htmlFor="email" className="sr-only">
        Email Address
      </label>
      <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        id="email"
        type="email"
        placeholder="Email Address"
        value={value}
        onChange={onChange}
        className="font-poppins h-12 w-full rounded-lg border border-gray-300 bg-white pr-4 pl-10 text-black placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        required
        aria-invalid={!!error} // Indicate invalid input
        aria-describedby="email-error" // Reference the error message
      />
      {error && (
        <p id="email-error" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
