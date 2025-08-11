import { translationVersionCode } from '@/features/bible';
import type { RouteProps } from '@/shared/types';
import { redirect } from 'next/navigation';

export default async function Bible({ params }: RouteProps) {
  const { locale } = await params;

  redirect(`/${locale}/bible/${translationVersionCode[locale]}/1/1`);
}
