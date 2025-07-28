import { DEFAULT_LOCALE, locales } from '@/shared';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LOCALE
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
