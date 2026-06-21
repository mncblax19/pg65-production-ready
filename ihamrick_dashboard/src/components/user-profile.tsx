'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Avatar from '@/assets/svg/Avatar.svg';
import { useGetCurrentUserQuery, useLogoutMutation } from '../../services/allApi';
import { Info, Shield, User, LogOut, ChevronDown, LoaderCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const settingsSubItems = [
  { icon: User, label: 'Profile', href: '/settings/profile' },
  { icon: Info, label: 'About Us', href: '/settings/about-us' },
  { icon: Shield, label: 'Privacy Policy', href: '/settings/privacy' },
];

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const { data: userData, isLoading } = useGetCurrentUserQuery();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />;
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      Cookies.remove('Ihamrickadmindashboardtoken');
      toast.success('Logout successful. See you soon!');
      router.replace('/login');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 transition hover:border-gray-300 active:scale-95"
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full border">
          <Image
            src={userData?.data?.profilePicture || Avatar}
            fill
            className="object-cover"
            alt="User"
          />
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180 text-black' : 'text-gray-400'}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-64 rounded-xl border border-gray-100 bg-white shadow-xl">
          {/* User Info */}
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 p-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <Image
                src={userData?.data?.profilePicture || Avatar}
                fill
                className="object-cover"
                alt="Profile"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {userData?.data?.userName || 'User Name'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {userData?.data?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-1 p-2">
            {settingsSubItems.map((item) => (
              <DropdownLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
                onClick={() => setIsOpen(false)}
              />
            ))}

            <div className="my-2 border-t border-gray-100" />

            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-default! disabled:opacity-50 disabled:hover:bg-inherit"
            >
              {logoutLoading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" /> Signing out...
                </>
              ) : (
                <>
                  <LogOut size={18} /> Sign Out
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

function DropdownLink({ href, label, icon: Icon, isActive, onClick }: DropdownLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group block rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-black/5 hover:text-black'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </div>
    </Link>
  );
}
