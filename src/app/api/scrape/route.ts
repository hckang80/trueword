import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
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

    return NextResponse.json({
      title,
      content
    });
  } catch (error) {
    console.error('Error scraping URL:', error);
    return NextResponse.json({ message: 'Error scraping URL' }, { status: 500 });
  }
}
