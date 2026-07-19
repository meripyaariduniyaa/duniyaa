import './globals.css';
import { Fredoka, Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-fredoka', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  title: 'Note Retro — A little space to say it right',
  description: 'Create a thoughtful, private apology page. Add your words, photos, and memories — share a link that disappears after 15 days.',
  keywords: 'apology, sorry, private message, note, retro, heartfelt letter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
