import { redirect } from 'next/navigation';

export default async function LocalePage() {
  redirect('/home');
}
