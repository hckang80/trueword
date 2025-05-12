import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }

    const key = `scrape:${url}`;
    const cached = await redis.get<{
      title: string | null | undefined;
      textContent: string | null | undefined;
    }>(key);

    if (cached) {
      const { title, textContent: content } = cached;
      return NextResponse.json({
        title,
        content
      });
    }

    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': globalThis.navigator.userAgent
      }
    });
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json({ message: 'Could not extract content' }, { status: 422 });
    }

    const { title, textContent: content } = article;

    await redis.set(key, article);

    return NextResponse.json({
      title,
      content
    });
  } catch (error) {
    console.error('Error scraping URL:', error);
    return NextResponse.json({ message: 'Error scraping URL' }, { status: 500 });
  }
}
