import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fetcher<T>(url: string | URL | Request, init?: RequestInit): Promise<T> {
  const getUrl =
    typeof url === 'string' && !url.startsWith('http') && !url.startsWith('/v2')
      ? `${process.env.BASE_URL}${url}`
      : url;

  return fetch(getUrl, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }).then((res) => res.json());
}
