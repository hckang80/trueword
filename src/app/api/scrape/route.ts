import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const MIN_CONTENT_LENGTH = 100;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }

    const key = `scrape:${url}`;
    const cached = await redis.get<{
      title: string | null | undefined;
      content: string | null | undefined;
    }>(key);

    if (cached) {
      return NextResponse.json(cached);
    }

    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': globalThis.navigator.userAgent
      }
    });

    const root = parse(html);

    const title =
      root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      root.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      root.querySelector('title')?.text ||
      '';

    let content = '';
    const possibleContentSelectors = [
      'article',
      '.article',
      '.post',
      '.content',
      '#content',
      '.article-container',
      '.article-content',
      '.post-content',
      '.entry-content',
      'main',
      '[role="main"]'
    ];

    for (const selector of possibleContentSelectors) {
      const element = root.querySelector(selector);

      if (element) {
        element
          .querySelectorAll(
            'script, style, nav, header, footer, .comments, .sidebar, .ad, .advertisement'
          )
          .forEach((el) => el.remove());
        content = element.text.trim();
      }

      if (MIN_CONTENT_LENGTH >= 100) break;
    }

    if (!content || MIN_CONTENT_LENGTH < 100) {
      const body = root.querySelector('body');
      if (body) {
        body.querySelectorAll('script, style, nav, header, footer').forEach((el) => el.remove());
        content = body.text.trim();
      }
    }

    const result = { title, content: content.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim() };

    await redis.set(key, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scraping URL:', error);
    return NextResponse.json({ message: 'Error scraping URL' }, { status: 500 });
  }
}
