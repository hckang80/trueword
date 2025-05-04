import { Button } from '@/shared/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { Mail } from 'lucide-react';
import Link from 'next/link';

function Header() {
  return (
    <header className="flex justify-between pl-[var(--global-inset)] pr-[var(--global-inset)] pt-[10px] pb-[10px] text-right">
      <h1 className="uppercase text-3xl font-bold shimmer-text">True Word</h1>
      <Button variant="outline" size="icon" asChild>
        <a href="mailto:hckang80@gmail.com">
          <Mail />
        </a>
      </Button>
      <ModeToggle />
    </header>
  );
}

export default Header;
