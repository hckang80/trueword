export * from './browser';
export * from './query-keys';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_LOCALE } from '../config';

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

/**
 * UTC 기준의 년월일을 반환합니다.
 * 예: 1980-07-28
 */
export function getTodaysDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export const generateNonce = async (): Promise<string[]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return [nonce, hashedNonce];
};
