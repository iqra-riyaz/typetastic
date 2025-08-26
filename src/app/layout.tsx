import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { BubbleBackground } from '@/components/BubbleBackground';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/MainLayout';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

export const metadata: Metadata = {
  title: 'Typetastic',
  description: 'A beautiful, interactive typing tutor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body">
        <ThemeProvider>
          <ProfileProvider>
            <SettingsProvider>
              <BubbleBackground />
              <MainLayout>{children}</MainLayout>
              <Toaster />
            </SettingsProvider>
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
