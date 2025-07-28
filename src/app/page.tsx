import { DEFAULT_LOCALE } from '@/shared';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const acceptLanguage = (await headers()).get('accept-language') || DEFAULT_LOCALE;
  const [userLang] = acceptLanguage.split(',');

  redirect(`/${userLang.slice(0, 2)}/home`);
}
