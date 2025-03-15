import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Transition } from '@/entities/bible';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export function toReadableDate(
  date: Date,
  locales: Intl.LocalesArgument = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
) {
  return new Intl.DateTimeFormat(locales, options).format(date);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fetcher<T>(url: string | URL | Request, init?: RequestInit): Promise<T> {
  const getUrl =
    typeof url === 'string' && !url.startsWith('http') && !url.startsWith('/api')
      ? `${process.env.API_BASE_URL}${url}`
      : url;

  return fetch(getUrl, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }).then((res) => res.json());
}

// https://github.com/lukemorales/query-key-factory#readme
export const bibleKeys = createQueryKeys('bible', {
  data: (translation: Transition | undefined) => [translation]
});

export const translationsKeys = createQueryKeys('translations');
