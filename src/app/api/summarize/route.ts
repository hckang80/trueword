import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || '');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `다음 게시글의 제목과 주요 내용 등을 간결하게 요약해주세요. HTML 시맨틱 마크업으로 출력해주세요. :

    ${content}`;
    const result = await model.generateContent([prompt]);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (
    // TODO: error: unknown type으로 개선 필요
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any
  ) {
    console.error('Error summarizing content:', error?.response?.data || error);
    return NextResponse.json(
      { message: 'Error summarizing content', error: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}
