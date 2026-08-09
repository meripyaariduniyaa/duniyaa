import Link from 'next/link';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '@/lib/seo';

export const metadata = {
  title: 'Terms of Service | LovelyCrafts',
  description: 'Read the LovelyCrafts Terms of Service — your rights and responsibilities when using our digital gifting platform, payment terms, refund policy, and content guidelines.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const EFFECTIVE_DATE = 'August 9, 2026';
const PRICE = '₹199';
const NOTE_EXPIRY_DAYS = 90;

export default function TermsPage() {
  return (
    <main className="shell" style={{ padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
          <Link href="/" style={{ color: '#ec4899', textDecoration: 'none' }}>Home</Link>
          {' > '}
          <span style={{ fontWeight: 600 }}>Terms of Service</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📄</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#111', marginBottom: '0.5rem' }}>Terms of Service</h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            <strong>Effective Date:</strong> {EFFECTIVE_DATE} &nbsp;|&nbsp;
            <strong>Platform:</strong> {SITE_NAME} ({SITE_URL})
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#9f1239' }}>
            📌 By accessing or using {SITE_NAME}, you agree to be bound by these Terms. If you do not agree, please do not use our services.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <Section title="1. Acceptance of Terms">
            <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of {SITE_NAME}, its website, features, and services (&ldquo;Service&rdquo;). These Terms constitute a legally binding agreement between you (&ldquo;User&rdquo;) and {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).</p>
            <p style={{ marginTop: '0.75rem' }}>By creating an account, making a payment, or using any feature of the Service, you confirm that you:</p>
            <ul>
              <li>Are at least 13 years of age.</li>
              <li>Have the legal capacity to enter into binding agreements.</li>
              <li>Have read, understood, and agree to these Terms and our Privacy Policy.</li>
            </ul>
          </Section>

          <Section title="2. Description of Service">
            <p>{SITE_NAME} is an online digital gifting platform that allows users to:</p>
            <ul>
              <li>Create personalized, interactive digital gift experiences (&ldquo;Notes&rdquo;) using pre-built animated templates.</li>
              <li>Upload personal photos and write custom messages, wishes, and other personal content.</li>
              <li>Generate a private shareable link to deliver the Note to a recipient.</li>
              <li>Access their created Notes via their account dashboard for up to {NOTE_EXPIRY_DAYS} days.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>The Service is provided on an &ldquo;as is&rdquo; basis. We reserve the right to modify, suspend, or discontinue any feature of the Service at any time with reasonable notice.</p>
          </Section>

          <Section title="3. Accounts & Authentication">
            <ul>
              <li>You may use the Service as a guest (device-based) or by signing in with your Google account via Firebase Authentication.</li>
              <li>You are responsible for maintaining the security of your Google account credentials.</li>
              <li>You agree to provide accurate and complete information during registration.</li>
              <li>We reserve the right to suspend or terminate accounts found to be in violation of these Terms.</li>
              <li>Guest users are identified by an anonymous device ID stored in their browser. Clearing browser data may result in loss of access to unpaid notes.</li>
            </ul>
          </Section>

          <Section title="4. Payments & Pricing">
            <SubHeading>4.1 Pricing</SubHeading>
            <p>Each Note template is priced at <strong>{PRICE}</strong> (inclusive of all applicable taxes). Prices are in Indian Rupees (INR) and subject to change with reasonable prior notice.</p>
            <p style={{ marginTop: '0.75rem' }}>We occasionally offer promotional coupon codes. Coupons are subject to their own terms and may have usage limits, expiry dates, and eligibility criteria.</p>

            <SubHeading>4.2 Payment Processing</SubHeading>
            <p>All payments are securely processed by <strong>Razorpay</strong>, a third-party payment gateway licensed by the Reserve Bank of India (RBI). By making a payment, you also agree to Razorpay&apos;s <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer" style={{ color: '#ec4899' }}>Terms of Service</a>.</p>
            <p style={{ marginTop: '0.5rem' }}>{SITE_NAME} does not store your payment card details, bank account information, or UPI credentials.</p>

            <SubHeading>4.3 Payment Verification</SubHeading>
            <p>After successful payment, your Note is unlocked and made accessible to the recipient for <strong>{NOTE_EXPIRY_DAYS} days</strong>. Payment confirmation is validated via Razorpay webhook verification.</p>
          </Section>

          <Section title="5. Refund Policy">
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#92400e' }}>
              ⚠️ <strong>Due to the immediate digital delivery nature of our service, all payments are generally non-refundable once the Note is unlocked and the recipient link is generated.</strong>
            </div>
            <p>We may, at our sole discretion, offer a refund or credit in the following situations:</p>
            <ul>
              <li>The payment was charged but the Note was never unlocked due to a verified technical error on our end.</li>
              <li>Duplicate payment was made for the same Note within the same session.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>To request a refund, email <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#ec4899' }}>{CONTACT_EMAIL}</a> within <strong>48 hours</strong> of payment, with your order/transaction ID. We will review and respond within 5 business days.</p>
            <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>Refunds, if approved, are processed back to the original payment method within 7–10 business days, subject to Razorpay&apos;s processing timelines.</p>
          </Section>

          <Section title="6. User-Generated Content">
            <SubHeading>6.1 Your Content</SubHeading>
            <p>You retain full ownership of the content you create on {SITE_NAME} — including text messages, uploaded photos, and personal details. By using the Service, you grant {SITE_NAME} a limited, non-exclusive, royalty-free license to store, process, and display your content solely for the purpose of delivering the Service to you and your recipient.</p>

            <SubHeading>6.2 Prohibited Content</SubHeading>
            <p>You agree NOT to submit content that:</p>
            <ul>
              <li>Is unlawful, obscene, defamatory, threatening, or constitutes harassment.</li>
              <li>Infringes the intellectual property, privacy, or other rights of any third party.</li>
              <li>Contains nudity, sexual content, or material that is harmful to minors.</li>
              <li>Contains malicious code, viruses, or any content intended to compromise security.</li>
              <li>Impersonates any individual, organization, or entity in a misleading way.</li>
              <li>Violates any applicable laws or regulations of India or the recipient&apos;s jurisdiction.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>We reserve the right to remove content and suspend accounts that violate these guidelines without prior notice.</p>

            <SubHeading>6.3 Content Responsibility</SubHeading>
            <p>You are solely responsible for the content you create and share using {SITE_NAME}. We do not pre-screen user-generated content but may review content upon receiving a complaint or for security purposes.</p>
          </Section>

          <Section title="7. Note Expiry & Data Deletion">
            <ul>
              <li>All Notes — paid and unpaid — are automatically and permanently deleted after <strong>{NOTE_EXPIRY_DAYS} days</strong> from the date of creation.</li>
              <li>Deleted Notes cannot be recovered. We strongly recommend recipients save any important content before expiry.</li>
              <li>We are under no obligation to retain or back up your Notes beyond the {NOTE_EXPIRY_DAYS}-day window.</li>
              <li>Uploaded photos may remain on Cloudinary servers even after Note deletion. You may request photo removal by contacting us.</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <SubHeading>8.1 Platform IP</SubHeading>
            <p>All templates, animations, design elements, code, branding, and other materials on {SITE_NAME} are the exclusive intellectual property of {SITE_NAME} and are protected under applicable copyright and intellectual property laws. You may not copy, reproduce, modify, distribute, or create derivative works of our templates or design assets.</p>

            <SubHeading>8.2 Feedback</SubHeading>
            <p>If you provide feedback, suggestions, or ideas to {SITE_NAME}, you grant us an unrestricted right to use them for any purpose without compensation or attribution.</p>
          </Section>

          <Section title="9. Prohibited Activities">
            <p>In addition to prohibited content, you agree not to:</p>
            <ul>
              <li>Use the Service for any commercial purpose or to generate revenue without our prior written consent.</li>
              <li>Attempt to reverse-engineer, scrape, or extract data from our platform.</li>
              <li>Use bots, automation scripts, or similar tools to interact with the Service.</li>
              <li>Use the Service to send spam or unsolicited messages to recipients.</li>
              <li>Circumvent, disable, or otherwise interfere with any security feature of the Service.</li>
              <li>Access data belonging to other users without their explicit consent.</li>
            </ul>
          </Section>

          <Section title="10. Disclaimer of Warranties">
            <p>The Service is provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> without warranties of any kind, either express or implied, including but not limited to:</p>
            <ul>
              <li>Uninterrupted, error-free, or secure access to the Service.</li>
              <li>The accuracy or completeness of any content generated by AI features on the platform.</li>
              <li>That the Service will meet your specific requirements or expectations.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>{SITE_NAME} expressly disclaims all implied warranties of merchantability, fitness for a particular purpose, and non-infringement to the fullest extent permitted by applicable law.</p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>To the maximum extent permitted by applicable Indian law, {SITE_NAME} and its founders, employees, and agents shall not be liable for:</p>
            <ul>
              <li>Any indirect, incidental, special, or consequential damages arising out of your use of the Service.</li>
              <li>Loss of data, including user-generated content, due to technical failures, expiry, or deletion.</li>
              <li>Any emotional distress, interpersonal disputes, or relationship outcomes arising from use of the Service.</li>
              <li>Actions of third-party payment processors or infrastructure providers.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>Our total cumulative liability to you for any claim arising from these Terms shall not exceed the amount you paid us in the <strong>3 months preceding the claim</strong>.</p>
          </Section>

          <Section title="12. Governing Law & Dispute Resolution">
            <p>These Terms are governed by and construed in accordance with the laws of <strong>India</strong>, without regard to conflict of law principles.</p>
            <p style={{ marginTop: '0.75rem' }}>In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the Service, you agree to first attempt to resolve it by contacting us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#ec4899' }}>{CONTACT_EMAIL}</a>. If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of the courts in <strong>India</strong>.</p>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>We reserve the right to modify these Terms at any time. Material changes will be communicated by updating the Effective Date at the top of this page. Continued use of the Service after such changes constitutes your acceptance of the revised Terms.</p>
            <p style={{ marginTop: '0.75rem' }}>We recommend checking this page periodically for updates.</p>
          </Section>

          <Section title="14. Termination">
            <p>We reserve the right to suspend or terminate your access to the Service immediately and without notice if you:</p>
            <ul>
              <li>Violate any provision of these Terms.</li>
              <li>Submit prohibited content or engage in prohibited activities.</li>
              <li>Engage in fraudulent or abusive behavior toward the platform or other users.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>Upon termination, your right to access the Service immediately ceases. Provisions of these Terms that by their nature should survive termination (including ownership, liability, and governing law) shall survive.</p>
          </Section>

          <Section title="15. Contact Us">
            <p>For any questions, complaints, or concerns regarding these Terms, please reach out to us:</p>
            <div style={{ background: '#f9fafb', padding: '1.25rem', borderRadius: '0.75rem', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.8, border: '1px solid #e5e7eb' }}>
              <strong>LovelyCrafts</strong><br />
              📧 Email: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#ec4899' }}>{CONTACT_EMAIL}</a><br />
              🌐 Website: <a href={SITE_URL} style={{ color: '#ec4899' }}>{SITE_URL}</a>
            </div>
          </Section>

        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/privacy" className="btn-secondary" style={{ fontSize: '0.9rem' }}>
            🔐 Read Privacy Policy
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
