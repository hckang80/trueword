import { translationsKeys } from '@/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getLocalizedTranslationVersions } from '..';

export const useLocalizedTranslationVersions = (language: string) => {
  return useSuspenseQuery({
    ...translationsKeys.data(language),
    queryFn: () => getLocalizedTranslationVersions(language),
    staleTime: Infinity
  });
};
