import type { Metadata } from 'next';
import './globals.css';
import ClientWrapper from '../../services/ClientWrapper';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Admin Portal - PG 65',
  description: 'Admin portal for PG 65 application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <ClientWrapper>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ClientWrapper>
      </body>
    </html>
  );
}
