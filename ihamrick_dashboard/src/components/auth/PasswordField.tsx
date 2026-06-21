'use client';
// src/components/auth/PasswordField.tsx
import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';

interface PasswordFieldProps {
  placeholder: string;
  // support either controlled input shape:
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // ...or the older shape used elsewhere:
  password?: string;
  setPassword?: (val: string) => void;
  isConfirmPasswordField?: boolean;
}

export default function PasswordField({
  placeholder,
  value,
  onChange,
  password,
  setPassword,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputValue = value ?? password ?? '';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (setPassword) setPassword(e.target.value);
  };

  return (
    <div className="relative">
      <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="font-poppins h-12 w-full rounded-lg border border-gray-300 bg-white pr-12 pl-10 text-xs font-normal text-black placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
