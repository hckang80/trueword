import type { BibleInstance, TransitionVersion } from '@/entities/bible';
import { axiosInstance } from '@/shared';
import { availableTranslationVersions } from '..';

export async function getLocalizedTranslationVersions(language: string) {
  const data = await fetchTranslationVersions();

  return data.filter(({ lang }) => lang === language);
}

export async function fetchTranslationVersions() {
  const { data } = await axiosInstance<Record<string, TransitionVersion>>('/api/translations');

  return availableTranslationVersions(data);
}

export async function fetchBibleInstance(abbreviation: string) {
  const { data } = await axiosInstance<BibleInstance>(`/translations/${abbreviation}`);

  return data;
}
