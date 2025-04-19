import type { BibleInstance, TransitionVersion } from '@/entities/bible';
import { axiosInstance } from '@/shared';

export async function fetchTranslations() {
  const { data } = await axiosInstance<Record<string, TransitionVersion>>('/api/translations');

  return data;
}

export async function fetchTranslationsByLanguage(abbreviation: string) {
  const { data } = await axiosInstance<BibleInstance>(`/translations/${abbreviation}`);

  return data;
}
