'use client';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: any) {
  return (
    <NextThemesProvider defaultTheme="system" attribute="class">
      <NextUIProvider>{children}</NextUIProvider>
    </NextThemesProvider>
  );
}
