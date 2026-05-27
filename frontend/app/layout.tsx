import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'VedaAI - Assignment Creator',
  description: 'Create and manage AI-assisted classroom assignments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#d1d1d1] text-veda-ink font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f1f1f',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
            },
            success: { iconTheme: { primary: '#42c978', secondary: '#1f1f1f' } },
            error: { iconTheme: { primary: '#ff4b42', secondary: '#1f1f1f' } },
          }}
        />
      </body>
    </html>
  );
}
