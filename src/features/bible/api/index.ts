import { Transition } from '@/entities/bible';
import { axiosInstance } from '@/shared';

export async function fetchTranslations() {
  const data = await axiosInstance<Record<string, Transition>>('/api/translations');

  return data;
}
