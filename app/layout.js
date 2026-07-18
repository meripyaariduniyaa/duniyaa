import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata = { title: 'Sorry, sincerely — a little space to say it right', description: 'Create a thoughtful, expiring apology page.' };

export default function RootLayout({ children }) {
  return <html lang="en"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
