import { Transition } from '@/@types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

// https://github.com/lukemorales/query-key-factory#readme
export const bibleKeys = createQueryKeys('bible', {
  data: (translation: Transition | undefined) => [translation]
});

export const translationsKeys = createQueryKeys('translations');
