import { getLanguageFullName, localizedTranslationVersionsQueryOptions } from '@/features/bible';
import type { RouteProps } from '@/shared';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function Bible({ params }: RouteProps) {
  const { locale } = await params;

  const queryClient = new QueryClient();

  const localizedTranslationVersions = await queryClient.fetchQuery(
    localizedTranslationVersionsQueryOptions(getLanguageFullName(locale, 'en'))
  );

  const [defaultTranslation] = localizedTranslationVersions;

  redirect(`/${locale}/bible/${defaultTranslation.short_name}/1/1`);
}
