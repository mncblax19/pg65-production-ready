import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('Ihamrickadmindashboardtoken')?.value;

  if (token) {
    redirect('/dashboard');
  }

  return children;
}
