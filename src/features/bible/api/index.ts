import type { BibleInstance, TransitionVersion, TranslationBooks } from '@/entities/bible';
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

export async function fetchBibleInstance(
  abbreviation: string,
  bookNumber: string,
  chapterNumber: string
) {
  const { data } = await axiosInstance<BibleInstance>(
    `/translations/${abbreviation}/${bookNumber}/${chapterNumber}`
  );

  return data;
}

export async function fetchTranslationBooks(translation: string) {
  const { data } = await axiosInstance<TranslationBooks>(`/translations/${translation}`);
  return data;
}
