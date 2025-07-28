import type { PhotoParams } from '@/entities/background';
import { Redis } from '@upstash/redis';
import { type NextRequest, NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const CACHE_TTL = 24 * 60 * 60;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params = Object.fromEntries(searchParams.entries()) as unknown as PhotoParams;
  const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
  });

  const cacheKey = `background_photo:${searchParams.toString()}`;
  const cached = await redis.get<string>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const { response } = await unsplash.search.getPhotos(params);
    await redis.set(cacheKey, response, { ex: CACHE_TTL });

    return NextResponse.json(response);
  } catch (error) {
    console.error('error occurred: ', error);
    return NextResponse.json({ error: 'Failed to fetch background' }, { status: 500 });
  }
}
