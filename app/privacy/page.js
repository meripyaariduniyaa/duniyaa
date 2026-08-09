import Link from 'next/link';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '@/lib/seo';

export const metadata = {
  title: 'Privacy Policy | LovelyCrafts',
  description: 'Read the LovelyCrafts Privacy Policy to understand how we collect, use, store and protect your personal data and user-generated content on our platform.',
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const EFFECTIVE_DATE = 'August 9, 2026';

export default function PrivacyPolicyPage() {
  return (
    <main className="shell" style={{ padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
          <Link href="/" style={{ color: '#ec4899', textDecoration: 'none' }}>Home</Link>
          {' > '}
          <span style={{ fontWeight: 600 }}>Privacy Policy</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔐</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#111', marginBottom: '0.5rem' }}>Privacy Policy</h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> {EFFECTIVE_DATE} &nbsp;|&nbsp;
            <strong>Platform:</strong> {SITE_NAME} ({SITE_URL})
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#78350f' }}>
            ⚠️ <strong>Important:</strong> Please read this policy carefully before using {SITE_NAME}. By accessing or using our service, you agree to the practices described below.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <Section title="1. Who We Are">
            <p>{SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a digital gifting platform operated from India. We allow users (&ldquo;you&rdquo;) to create personalized, interactive digital gift experiences for personal use and share them with recipients via a private link.</p>
            <p style={{ marginTop: '0.75rem' }}>For privacy-related queries, contact us at: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#ec4899' }}>{CONTACT_EMAIL}</a></p>
          </Section>

          <Section title="2. Information We Collect">
            <SubHeading>2.1 Information You Provide</SubHeading>
            <ul>
              <li><strong>Account Information:</strong> If you sign in via Google OAuth, we collect your name, email address, and Google profile picture as provided by Google.</li>
              <li><strong>Gift Content:</strong> Recipient names, custom messages, promises, event details, and other text you enter when creating a gift experience.</li>
              <li><strong>Photos:</strong> Images you upload are stored on Cloudinary, our third-party media storage provider.</li>
              <li><strong>Payment Information:</strong> Payment transactions are processed by Razorpay. We do not store your card details or banking information on our servers.</li>
              <li><strong>Custom Link Slugs:</strong> If you create a custom shareable link, we store the slug you choose.</li>
            </ul>

            <SubHeading>2.2 Information Collected Automatically</SubHeading>
            <ul>
              <li><strong>Device Identifier:</strong> We generate and store an anonymous device ID in your browser&apos;s local storage to associate unpaid notes with your device for up to 90 days.</li>
              <li><strong>Usage Data:</strong> Standard server logs including IP address, browser type, referring URL, and pages visited may be retained for security and analytical purposes.</li>
              <li><strong>Cookies:</strong> We use session cookies required for authentication and minimal analytics cookies. We do not serve advertising cookies or track you across third-party websites.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To create, store, and deliver your personalized digital gift experiences.</li>
              <li>To process payments and verify subscription/unlock status via Razorpay.</li>
              <li>To authenticate you via Google Sign-In (Firebase Authentication).</li>
              <li>To send transactional communications (e.g., payment confirmations) to your registered email.</li>
              <li>To improve our platform, fix bugs, and enhance user experience.</li>
              <li>To enforce our Terms of Service and prevent abuse or fraud.</li>
            </ul>
            <p style={{ marginTop: '0.75rem', color: '#374151' }}>We <strong>do not</strong> sell, rent, or trade your personal data to any third party for marketing purposes.</p>
          </Section>

          <Section title="4. Data Retention">
            <ul>
              <li><strong>Gift Notes:</strong> All created notes are automatically deleted after <strong>90 days</strong> from creation, regardless of paid status, unless renewed.</li>
              <li><strong>Unpaid Drafts:</strong> Notes that are not paid for within 90 days are permanently deleted.</li>
              <li><strong>Account Data:</strong> If you sign in with Google, your user profile is retained until you request deletion.</li>
              <li><strong>Uploaded Images:</strong> Photos uploaded to Cloudinary may persist beyond the note expiry. You may request deletion by contacting us.</li>
              <li><strong>Payment Records:</strong> Transaction records are retained as required by Indian financial regulations (minimum 5 years).</li>
            </ul>
          </Section>

          <Section title="5. Third-Party Services">
            <p>We use the following trusted third-party services. Each operates under their own privacy policy:</p>
            <Table rows={[
              ['Firebase (Google)', 'Authentication, Firestore database', 'https://firebase.google.com/support/privacy'],
              ['Cloudinary', 'Image storage and delivery', 'https://cloudinary.com/privacy'],
              ['Razorpay', 'Payment processing (India)', 'https://razorpay.com/privacy/'],
              ['Vercel / Hosting Provider', 'Web hosting and CDN', 'https://vercel.com/legal/privacy-policy'],
            ]} />
          </Section>

          <Section title="6. Data Security">
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul>
              <li>All data is transmitted over HTTPS/TLS encryption.</li>
              <li>Firebase Firestore security rules restrict access to note data by owner device ID or authenticated UID.</li>
              <li>Payment data never touches our servers — it is handled entirely by Razorpay&apos;s PCI-DSS-compliant infrastructure.</li>
              <li>Uploaded images are stored on Cloudinary&apos;s secure CDN with restricted access settings.</li>
            </ul>
            <p style={{ marginTop: '0.75rem', color: '#6b7280', fontSize: '0.9rem' }}>No method of transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>Under applicable Indian data protection law and as a matter of good practice, you have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate personal information.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
              <li><strong>Withdraw Consent:</strong> Disconnect your Google account from {SITE_NAME} at any time through your Google account settings.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#ec4899' }}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>{SITE_NAME} is intended for users aged <strong>13 and above</strong>. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has submitted data to us, please contact us immediately and we will delete it promptly.</p>
          </Section>

          <Section title="9. Links to Third-Party Sites">
            <p>Our platform may include links to third-party websites (e.g., Google Maps venue links in wedding invitations). We are not responsible for the privacy practices of those sites. Please review their respective privacy policies before sharing personal information.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you by updating the &ldquo;Effective Date&rdquo; at the top of this page. Continued use of {SITE_NAME} after changes constitutes acceptance of the revised policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions, concerns, or complaints about this Privacy Policy, please contact:</p>
            <div style={{ background: '#f9fafb', padding: '1.25rem', borderRadius: '0.75rem', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.8, border: '1px solid #e5e7eb' }}>
              <strong>LovelyCrafts</strong><br />
              📧 Email: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#ec4899' }}>{CONTACT_EMAIL}</a><br />
              🌐 Website: <a href={SITE_URL} style={{ color: '#ec4899' }}>{SITE_URL}</a>
            </div>
          </Section>

        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/terms" className="btn-secondary" style={{ fontSize: '0.9rem' }}>
            📄 Read Terms of Service
          </Link>
          <Link href="/" className="btn-primary" style={{ fontSize: '0.9rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.75rem 1.5rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#9f1239', marginBottom: '1rem', marginTop: 0 }}>{title}</h2>
      <div style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function SubHeading({ children }) {
  return <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111', margin: '1rem 0 0.4rem 0' }}>{children}</h3>;
}

function Table({ rows }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: '#fff1f2' }}>
            {['Service', 'Purpose', 'Privacy Policy'].map((h) => (
              <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: '#9f1239', fontWeight: 700, borderBottom: '2px solid #ffe4e6' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([service, purpose, link], i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{service}</td>
              <td style={{ padding: '0.6rem 0.75rem', color: '#6b7280' }}>{purpose}</td>
              <td style={{ padding: '0.6rem 0.75rem' }}>
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#ec4899', fontSize: '0.8rem' }}>View Policy ↗</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
