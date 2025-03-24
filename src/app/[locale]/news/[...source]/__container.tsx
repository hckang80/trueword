'use client';

export default function NewsIdContainer({ data }: { data: string }) {
  return (
    <article className="p-[var(--global-inset)]">
      <h2 className="text-lg font-medium mb-[10px]">요약 결과</h2>
      <div className="text-gray-700 whitespace-pre-line">{data}</div>
    </article>
  );
}
