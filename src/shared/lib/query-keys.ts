import { createQueryKeys } from '@lukemorales/query-key-factory';

export const bibleKeys = createQueryKeys('bible', {
  data: (id: string) => [id]
});

export const translationsKeys = createQueryKeys('translations', {
  data: (language: string) => [language]
});

export const newsKeys = createQueryKeys('news', {
  data: ([source, id]: string[]) => [source, id]
});
