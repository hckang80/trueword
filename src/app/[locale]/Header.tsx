import { ModeToggle } from './ModeToggle';

function Header() {
  return (
    <header className="flex justify-between pl-[var(--global-inset)] pr-[var(--global-inset)] pt-[10px] pb-[10px] text-right">
      <h1 className="uppercase text-3xl font-bold shimmer-text">True Word</h1>
      <ModeToggle />
    </header>
  );
}

export default Header;
