import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { DEFAULT_LOCALE, locales } from '@/shared';

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LOCALE
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
