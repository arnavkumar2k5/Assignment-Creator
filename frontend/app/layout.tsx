import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
// @ts-expect-error CSS module declaration is provided by Next.js build/runtime.
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AssessAI — Intelligent Exam Creator',
  description: 'Generate professional academic question papers with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${jetbrains.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#faf8f2',
              border: '1px solid rgba(232,169,0,0.3)',
            },
            success: { iconTheme: { primary: '#e8a900', secondary: '#1a1a2e' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#faf8f2' } },
          }}
        />
      </body>
    </html>
  );
}