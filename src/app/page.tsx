import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function Home() {
  const acceptLanguage = (await headers()).get('accept-language') || 'en';
  const [userLang] = acceptLanguage.split(',');

  redirect(`/${userLang.slice(0, 2)}/bible`);
}
