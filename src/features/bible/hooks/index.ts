import { translationsKeys } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { getLocalizedTranslationVersions } from '..';

export const useLocalizedTranslationVersions = (language: string) => {
  return useQuery({
    ...translationsKeys.data(language),
    queryFn: () => getLocalizedTranslationVersions(language),
    staleTime: 1000 * 60 * 5
  });
};
