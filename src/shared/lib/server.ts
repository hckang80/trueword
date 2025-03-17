'use server';

import { headers } from 'next/headers';

const DEFAULT_HOST = 'localhost:3000';

export async function getOrigin(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || DEFAULT_HOST;
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    return `${protocol}://${host}`;
  } catch (error) {
    console.error(error);
    return `http://${DEFAULT_HOST}`;
  }
}
