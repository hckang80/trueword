import './globals.css';
import ProgressBar from './ProgressBar';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProgressBar />
      {children}
    </>
  );
}
