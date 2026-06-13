'use client'

import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div style={{
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg-base)',
        padding: '0 0 48px',
        WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
            borderRadius: 10, padding: '7px 14px', fontSize: 13,
            color: 'var(--text-secondary)', cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} strokeWidth={1.8} color="var(--primary)" />
          <span style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            Privacy Policy
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px' }}>

        {/* Last updated */}
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 28 }}>
          Last updated: June 2025
        </p>

        <Section title="Who We Are">
          MilaKya ("we", "our", "us") is a personal item location tracker built for people
          managing belongings across multiple homes — such as a primary home, PG, parents'
          home, or office. The app is operated as an independent project and can be reached
          at <a href="mailto:support@mila-kya.vercel.app" style={linkStyle}>support@mila-kya.vercel.app</a>.
        </Section>

        <Section title="What Data We Collect">
          We collect only what is necessary to provide the service:
          <ul style={listStyle}>
            <li><strong>Account information:</strong> Your name and email address when you sign in with Google, or your email and password if you register directly.</li>
            <li><strong>Item data:</strong> Names, categories, locations, notes, and photos of items you add to the app.</li>
            <li><strong>Home and room data:</strong> Names and details of homes and rooms you create.</li>
            <li><strong>Device information:</strong> Browser type and approximate location (city-level only, entered manually by you — we do not use GPS).</li>
          </ul>
          We do <strong>not</strong> collect payment information, precise GPS location, contacts, or any data unrelated to item tracking.
        </Section>

        <Section title="How We Use Your Data">
          Your data is used solely to:
          <ul style={listStyle}>
            <li>Provide and personalise the MilaKya service</li>
            <li>Save and retrieve your item and home information</li>
            <li>Enable AI-powered photo and diary scanning features</li>
            <li>Allow semantic search across your items</li>
          </ul>
          We do <strong>not</strong> use your data for advertising, profiling, or sale to third parties.
        </Section>

        <Section title="AI Features & Your Photos">
          When you use the photo scan or diary scan features, your image is sent to our
          AI processing service (Groq API) for item detection. Images are processed in
          real-time and are <strong>not stored</strong> on our servers or by our AI provider
          beyond the duration of a single request. Detected item names are stored only
          if you choose to save them.
        </Section>

        <Section title="Data Storage & Security">
          Your data is stored securely in our database (Supabase / PostgreSQL) with:
          <ul style={listStyle}>
            <li>Row-level security — you can only access your own data</li>
            <li>Encrypted connections (HTTPS/TLS) for all data in transit</li>
            <li>Encrypted storage at rest</li>
          </ul>
          We do not share your personal data with any third party except the services
          required to operate MilaKya (Supabase for storage, Groq for AI, Vercel for hosting).
        </Section>

        <Section title="Third-Party Services">
          MilaKya uses the following third-party services, each with their own privacy policies:
          <ul style={listStyle}>
            <li><strong>Supabase</strong> — database and authentication (supabase.com/privacy)</li>
            <li><strong>Google OAuth</strong> — optional sign-in (policies.google.com/privacy)</li>
            <li><strong>Groq API</strong> — AI image and text processing (groq.com/privacy)</li>
            <li><strong>Vercel</strong> — app hosting (vercel.com/legal/privacy-policy)</li>
          </ul>
        </Section>

        <Section title="Your Rights">
          You have the right to:
          <ul style={listStyle}>
            <li><strong>Access</strong> all data we hold about you</li>
            <li><strong>Delete</strong> your account and all associated data at any time via Profile → Delete Account</li>
            <li><strong>Export</strong> your data (coming in a future update)</li>
            <li><strong>Correct</strong> any inaccurate information</li>
          </ul>
          To exercise any of these rights, use the in-app settings or email us at{' '}
          <a href="mailto:support@mila-kya.vercel.app" style={linkStyle}>support@mila-kya.vercel.app</a>.
        </Section>

        <Section title="Data Retention">
          We retain your data for as long as your account is active. When you delete your
          account, all your homes, rooms, items, and personal information are permanently
          deleted within 30 days. Backups may retain data for up to 30 additional days
          before being purged.
        </Section>

        <Section title="Children's Privacy">
          MilaKya is intended for users aged 18 and above. We do not knowingly collect
          data from anyone under 18. If you believe a minor has created an account,
          please contact us and we will delete it promptly.
        </Section>

        <Section title="Changes to This Policy">
          We may update this policy as the app evolves. We will notify you of significant
          changes via the app. Continued use after changes means you accept the updated policy.
        </Section>

        <Section title="Contact Us">
          For any privacy-related questions or requests:
          <br /><br />
          <strong>Email:</strong>{' '}
          <a href="mailto:support@mila-kya.vercel.app" style={linkStyle}>
            support@mila-kya.vercel.app
          </a>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{
        fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: 10,
        paddingBottom: 8, borderBottom: '1px solid var(--border-soft)',
      }}>
        {title}
      </h2>
      <div style={{
        fontSize: 14, color: 'var(--text-secondary)',
        lineHeight: 1.75,
      }}>
        {children}
      </div>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  color: 'var(--primary)', textDecoration: 'none', fontWeight: 500,
}

const listStyle: React.CSSProperties = {
  marginTop: 8, marginBottom: 4, paddingLeft: 20,
  display: 'flex', flexDirection: 'column', gap: 6,
} as React.CSSProperties