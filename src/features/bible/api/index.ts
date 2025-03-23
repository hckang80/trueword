import type { BibleInstance, Transition } from '@/entities/bible';
import { axiosInstance } from '@/shared';

export async function fetchTranslations() {
  const data = await axiosInstance<Record<string, Transition>>('/api/translations');

  return data;
}

export async function fetchTranslationsByLanguage(abbreviation: string) {
  const { data } = await axiosInstance<BibleInstance>(`/translations/${abbreviation}`);

  return data;
}
