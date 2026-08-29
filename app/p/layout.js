// Recipient experience pages are private, one-time links — not for search indexing
export const metadata = {
  title: 'A Surprise Waiting for You | LovelyCrafts',
  description: 'Someone created a special interactive digital experience just for you. Open it to reveal a personalized surprise made with love.',
  robots: { index: false, follow: false },
};

export default function RecipientLayout({ children }) {
  return children;
}
