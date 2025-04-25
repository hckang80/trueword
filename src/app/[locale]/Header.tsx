import { ModeToggle } from './ModeToggle';

function Header() {
  return (
    <header className="pl-[var(--global-inset)] pr-[var(--global-inset)] pt-[10px] pb-[10px] text-right">
      <ModeToggle />
    </header>
  );
}

export default Header;
