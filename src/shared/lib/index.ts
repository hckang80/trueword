export * from './browser';
export * from './query-keys';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_LOCALE } from '..';

export function toReadableDate(
  date: Date,
  locales: Intl.LocalesArgument = DEFAULT_LOCALE,
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
  return fetch(`${process.env.API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }).then((res) => res.json());
}

export function extractUniqId(url: string) {
  const match = url.match(/(\d+)(?:\/?)$/);
  return match?.[1] || '';
}
