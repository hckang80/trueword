import type { PhotoParams } from '@/entities/background';
import { type NextRequest, NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params = Object.fromEntries(searchParams.entries()) as unknown as PhotoParams;
  const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
  });

  try {
    const { response } = await unsplash.search.getPhotos(params);
    return NextResponse.json(response);
  } catch (error) {
    console.error('error occurred: ', error);
    return NextResponse.json({ error: 'Failed to fetch background' }, { status: 500 });
  }
}
