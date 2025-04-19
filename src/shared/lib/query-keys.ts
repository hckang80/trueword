import { createQueryKeys } from '@lukemorales/query-key-factory';

// https://github.com/lukemorales/query-key-factory#readme
export const bibleKeys = createQueryKeys('bible', {
  data: (translation: string) => [translation]
});

export const translationsKeys = createQueryKeys('translations', {
  data: (language: string) => [language]
});

export const newsKeys = createQueryKeys('news');
