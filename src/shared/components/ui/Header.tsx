'use client';

import { useBibleLanguage } from '@/features/bible';
import { Button, ModeToggle } from '@/shared';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const language = useBibleLanguage();
  return (
    <header className="guide-line-layout flex justify-end gap-[4px] pl-[var(--global-inset)] pr-[var(--global-inset)] pt-[10px] pb-[10px] text-right">
      <h1 className="mr-auto uppercase text-3xl font-bold shimmer-text">True Word</h1>
      <Button variant="ghost" size="icon" asChild>
        <Link href="#">{language}</Link>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href="mailto:hckang80@gmail.com">
          <Mail />
          <span className="sr-only">Send mail</span>
        </a>
      </Button>
      <ModeToggle />
    </header>
  );
}
