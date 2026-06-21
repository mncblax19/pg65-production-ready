'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  LayoutDashboard,
  FileText,
  Video,
  Mic,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  Info,
  Shield,
  Quote,
  ImageIcon,
  Layers,
  Layers2,
  Contact,
} from 'lucide-react';
import { useLogoutMutation } from '../../services/allApi';
import Cookies from 'js-cookie'; // For cookie management

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Manage Blog', href: '/manage-blog' },
  { icon: Video, label: 'Manage Videos', href: '/manage-videos' },
  { icon: Mic, label: 'Manage Podcasts', href: '/manage-podcasts' },
  {
    icon: BookOpen,
    label: 'Manage Publications',
    href: '/manage-publications',
  },
  {
    icon: User,
    label: 'RSS',
    href: '/rss',
  },
];

const settingsSubItems = [
  { icon: User, label: 'Profile', href: '/settings/profile' },
  { icon: Info, label: 'About Us', href: '/settings/about-us' },
  { icon: Shield, label: 'Privacy', href: '/settings/privacy' },
  { icon: FileText, label: 'Disclaimer', href: '/settings/disclaimer' },
  { icon: ImageIcon, label: 'Banner', href: '/settings/banner' },
  { icon: Quote, label: 'Motivation', href: '/settings/motivation' },
  { icon: Contact, label: 'Contact Text', href: '/settings/contact-text' },
  { icon: Layers, label: 'Footer Text 1', href: '/settings/footer-text-1' },
  { icon: Layers2, label: 'Footer Text 2', href: '/settings/footer-text-2' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Use the logout mutation
  const [logout] = useLogoutMutation(); // use the logout mutation

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logout().unwrap(); // Call the logout mutation (no need to catch the response)
      // Remove the authentication token from cookies
      Cookies.remove('Ihamrickadmindashboardtoken');

      // Show success toast
      toast.success('Logout successful. See you soon!');

      // Redirect to login page after logout
      setTimeout(() => {
        router.replace('/login'); // Adjust the route to your login page
      }, 1200); // Wait for toast to show before redirecting
    } catch (error) {
      console.error('Logout failed:', error);
      // Show error toast if logout fails
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-neutral-900 p-2 text-white lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-neutral-900 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-4">
          {/* Logo/Title */}
          <div className="mb-8 px-3 pt-4">
            <h1 className="font-poppins text-lg font-semibold text-neutral-400">Dashboard</h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-poppins flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-neutral-900'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Settings with Dropdown */}
            <div>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="font-poppins flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Settings className="h-5 w-5" />
                Settings
                {isSettingsOpen ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </button>

              {/* Settings Submenu */}
              {isSettingsOpen && (
                <div className="mt-1 space-y-1 pl-4">
                  {settingsSubItems.map((subItem) => {
                    const isActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className={`font-poppins flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-white text-neutral-900'
                            : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        <subItem.icon className="h-4 w-4" />
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="font-poppins flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>
    </div>
  );
}
