import type { Transition } from '@/entities/bible';
import { createQueryKeys } from '@lukemorales/query-key-factory';

// https://github.com/lukemorales/query-key-factory#readme
export const bibleKeys = createQueryKeys('bible', {
  data: (translation: string) => [translation]
});

export const translationsKeys = createQueryKeys('translations');

export const newsKeys = createQueryKeys('news');
