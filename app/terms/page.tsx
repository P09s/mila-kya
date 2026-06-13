'use client'

import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'

export default function TermsPage() {
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
          <FileText size={18} strokeWidth={1.8} color="var(--primary)" />
          <span style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            Terms of Service
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px' }}>

        {/* Last updated */}
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 28 }}>
          Last updated: June 2025
        </p>

        <Section title="Acceptance of Terms">
          By creating an account or using MilaKya ("the app", "the service"), you agree
          to these Terms of Service. If you do not agree, please do not use the app.
          These terms apply to all users of MilaKya.
        </Section>

        <Section title="What MilaKya Is">
          MilaKya is a personal item location tracker that helps you record and find
          your belongings across multiple homes and locations. It is a personal
          productivity tool — not a storage, logistics, or inventory management
          service for commercial use.
        </Section>

        <Section title="Your Account">
          <ul style={listStyle}>
            <li>You must be 18 years or older to use MilaKya.</li>
            <li>You are responsible for keeping your account credentials secure.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>One person may maintain one account. Creating multiple accounts to
            circumvent restrictions is not permitted.</li>
            <li>You may delete your account at any time via Profile → Delete Account.</li>
          </ul>
        </Section>

        <Section title="Acceptable Use">
          You agree to use MilaKya only for lawful personal purposes. You must not:
          <ul style={listStyle}>
            <li>Use the app for any commercial inventory or business purposes</li>
            <li>Attempt to reverse-engineer, hack, or disrupt the service</li>
            <li>Upload content that is illegal, harmful, or violates others' rights</li>
            <li>Use AI scan features to process content you do not own or have rights to</li>
            <li>Create accounts on behalf of others without their consent</li>
          </ul>
        </Section>

        <Section title="Your Data & Content">
          You own all content you add to MilaKya — your homes, rooms, items, notes,
          and photos. By using the service, you grant us a limited licence to store and
          process your content solely to provide the MilaKya service to you. We do not
          claim ownership of your data. See our{' '}
          <a href="/privacy" style={linkStyle}>Privacy Policy</a> for full details on
          how your data is handled.
        </Section>

        <Section title="AI Features">
          MilaKya's photo scan and diary scan features use AI to detect items from
          images. These are provided as a convenience and may not always be accurate.
          You are responsible for reviewing AI-detected items before saving them.
          We are not liable for errors in AI-generated item names or categories.
        </Section>

        <Section title="Service Availability">
          We aim to keep MilaKya available at all times but cannot guarantee
          uninterrupted access. The service may be temporarily unavailable due to
          maintenance, updates, or factors outside our control. We are not liable
          for any loss resulting from service downtime.
        </Section>

        <Section title="Free Service & Changes">
          MilaKya is currently provided free of charge. We reserve the right to:
          <ul style={listStyle}>
            <li>Introduce paid features or plans in the future</li>
            <li>Modify or discontinue features with reasonable notice</li>
            <li>Update these terms — we will notify you of significant changes in-app</li>
          </ul>
          Continued use of MilaKya after changes to the terms constitutes acceptance
          of the updated terms.
        </Section>

        <Section title="Limitation of Liability">
          MilaKya is provided "as is" without warranties of any kind. To the maximum
          extent permitted by law, we are not liable for:
          <ul style={listStyle}>
            <li>Loss of data due to technical failures</li>
            <li>Inaccuracies in AI-detected item information</li>
            <li>Any indirect, incidental, or consequential damages</li>
          </ul>
          Our total liability to you for any claim shall not exceed the amount you
          paid us in the 12 months prior to the claim (which, for free users, is ₹0).
        </Section>

        <Section title="Governing Law">
          These terms are governed by the laws of India. Any disputes shall be
          subject to the exclusive jurisdiction of the courts of India.
        </Section>

        <Section title="Contact Us">
          For any questions about these terms:
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