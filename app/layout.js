import './globals.css';
import { Fredoka, Caveat } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Script from 'next/script';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-bold', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], weight: ['700'], variable: '--font-cursive', display: 'swap' });

export const metadata = {
  title: 'Note Retro — A beautiful space for your thoughts',
  description: 'Create thoughtful, private pages. Add your words and photos, then share a beautiful link.',
  keywords: 'notes, private message, Note Retro, beautiful letter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${caveat.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Script src="/oneko/oneko.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
