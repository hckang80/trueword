import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export async function POST(request: NextRequest) {
  try {
    const { content, language = 'ko' } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    const key = `summary:${language}:${Buffer.from(content).toString('base64')}`;
    const cached = await redis.get<string>(key);

    if (cached) {
      return NextResponse.json({ summary: cached });
    }

    const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || '');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptText =
      language === 'en'
        ? `Summarize the following article concisely, including the title and main content. Output in semantic HTML markup. Respond in English only:`
        : `다음 게시글의 제목과 주요 내용 등을 간결하게 요약해주세요. HTML 시맨틱 마크업으로 출력해주세요. :`;

    const prompt = `${promptText}

    ${content}`;

    const generationConfig = {
      temperature: 0.2,
      topP: 0.8,
      topK: 40
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig
    });

    const summary = result.response.text();

    await redis.set(key, summary);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing content:', error);
    return NextResponse.json({ message: 'Error summarizing content' }, { status: 500 });
  }
}
