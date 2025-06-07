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

export function extractUniqId(url: string) {
  const match = url.match(/(\d+)(?:\/?)$/);
  return match?.[1] || '';
}

export function getRandomPositiveInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}
