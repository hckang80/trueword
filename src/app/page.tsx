import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function Home() {
  const acceptLanguage = (await headers()).get('accept-language') || 'en';
  const [userLang] = acceptLanguage.split(',').slice(0, 2);

  redirect(`/${userLang}/bible`);
}
