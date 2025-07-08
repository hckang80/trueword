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

/**
 * 1부터 max(포함)까지의 랜덤한 양의 정수를 반환합니다.
 *
 * @param {number} max - 반환할 수 있는 최대 정수값(1 이상이어야 함)
 * @returns {number} 1 이상 max 이하의 랜덤 정수
 *
 * @example
 * getRandomPositiveInt(5); // 1, 2, 3, 4, 5 중 하나 반환
 */
export function getRandomPositiveInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}
