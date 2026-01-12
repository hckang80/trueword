import { Flex } from '@radix-ui/themes';
import './globals.css';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex direction='column' height='100dvh'>
      {children}
    </Flex>
  );
}
