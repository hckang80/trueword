import type { RouteProps } from '@/shared/types';
import { redirect } from 'next/navigation';

export default async function RootPage({ params }: RouteProps) {
  const { locale } = await params;

  redirect(`/${locale}/bible`);
}
