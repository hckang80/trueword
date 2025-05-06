import { Button } from '@/shared/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { Mail } from 'lucide-react';
function Header() {
  return (
    <header className="flex justify-end gap-[4px] pl-[var(--global-inset)] pr-[var(--global-inset)] pt-[10px] pb-[10px] text-right">
      <h1 className="mr-auto uppercase text-3xl font-bold shimmer-text">True Word</h1>
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

export default Header;
