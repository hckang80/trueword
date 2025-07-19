import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Redis } from '@upstash/redis';
import { DEFAULT_LOCALE } from '@/shared';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const CACHE_TTL = 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const locale = request.headers.get('Accept-Language') || DEFAULT_LOCALE;
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    const key = `summary:${locale}:${Buffer.from(content).toString('base64')}`;
    const cached = await redis.get<string>(key);

    if (cached) {
      return NextResponse.json({ summary: cached });
    }

    const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || '');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const promptText = `
      당신은 크리스천 뉴스 전문 요약가입니다.
      다음 게시글의 주요 내용을 **간결하게 요약**해주세요.
      요약에는 다음 사항이 포함되어야 합니다:

      1.  **요약 언어는 ${locale.toLocaleUpperCase()}**
      2.  **가장 중요한 핵심 사건이나 주제**.
      3.  **해당 뉴스 기사가 기독교 공동체나 신앙에 미치는 영향**.
      4.  **기사에서 강조하는 영적 또는 신학적 시사점** (있을 경우).

      출력은 HTML 시맨틱 태그(<body> 내부의 <section> 또는 <article>을 활용)로 마크업하여 <p>, <ul>, <ol> 등을 적절히 사용해 구조화해주세요.     

      ${content}
    `;

    const generationConfig = {
      temperature: 0.2,
      topP: 0.8,
      topK: 40
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig
    });

    const summary = result.response.text();

    await redis.set(key, summary, { ex: CACHE_TTL });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing content:', error);
    return NextResponse.json({ message: 'Error summarizing content' }, { status: 500 });
  }
}
