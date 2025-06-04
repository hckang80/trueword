import { createQueryKeys } from '@lukemorales/query-key-factory';
import { type Locale } from '..';

export const bibleKeys = createQueryKeys('bible', {
  data: ([id, nr, chapter]: string[]) => [id, nr, chapter]
});

export const translationsKeys = createQueryKeys('translations', {
  data: (language: Locale) => [language]
});

export const newsKeys = createQueryKeys('news', {
  data: ([source, id]: string[]) => [source, id]
});
