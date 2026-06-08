'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')
  const [resendCooldown, setResendCooldown] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('milakya_phone')
    if (!stored) { router.push('/login'); return }
    setPhone(stored)
    // Focus first input
    inputRefs.current[0]?.focus()

    // Cooldown timer
    const interval = setInterval(() => {
      setResendCooldown((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [router])

  function handleOtpInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    // Auto-verify when all 6 filled
    if (newOtp.every((d) => d) && newOtp.join('').length === 6) {
      verifyOTP(newOtp.join(''))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  async function verifyOTP(code: string) {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    })
    setLoading(false)
    if (err) {
      setError('Galat OTP hai. Dobara try karo.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } else {
      sessionStorage.removeItem('milakya_phone')
      router.push('/')
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    const supabase = createClient()
    await supabase.auth.signInWithOtp({ phone, options: { channel: 'sms' } })
    setResendCooldown(30)
  }

  const maskedPhone = phone.replace(/(\+91)(\d{5})(\d{5})/, '$1 XXXXX $3')

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
    }}>
      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{
          position: 'absolute', top: 20, left: 20,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
          borderRadius: 10, padding: '8px 14px', fontSize: 13,
          color: 'var(--text-secondary)', cursor: 'pointer',
        }}
      >
        ← Wapas
      </button>

      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--bg-surface)',
        borderRadius: 24,
        border: '1px solid var(--border-soft)',
        boxShadow: '0 4px 24px rgba(42,27,16,0.08)',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📱</div>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 6,
        }}>
          OTP daalo
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 28 }}>
          6-digit code bheja gaya<br />
          <strong style={{ color: 'var(--text-secondary)' }}>{maskedPhone}</strong> par
        </p>

        {/* OTP inputs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 44, height: 52,
                textAlign: 'center',
                fontSize: 22, fontWeight: 700,
                fontFamily: 'Outfit, sans-serif',
                borderRadius: 12,
                border: error
                  ? '2px solid #D94F4F'
                  : digit
                  ? '2px solid var(--primary)'
                  : '1.5px solid var(--border-soft)',
                background: digit ? 'var(--primary-pale)' : 'var(--bg-surface)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 150ms',
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ fontSize: 12, color: '#D94F4F', marginBottom: 14 }}>{error}</p>
        )}

        {/* Verify button */}
        <button
          onClick={() => verifyOTP(otp.join(''))}
          disabled={loading || otp.join('').length < 6}
          style={{
            width: '100%', padding: '13px',
            borderRadius: 14,
            background: otp.join('').length < 6 ? 'var(--bg-elevated)' : 'var(--primary)',
            color: otp.join('').length < 6 ? 'var(--text-tertiary)' : '#FAF6F0',
            border: 'none', fontSize: 15, fontWeight: 600,
            fontFamily: 'Outfit, sans-serif',
            cursor: otp.join('').length < 6 ? 'not-allowed' : 'pointer',
            boxShadow: otp.join('').length >= 6 ? '0 4px 16px rgba(200,96,58,0.35)' : 'none',
          }}
        >
          {loading ? 'Check kar raha hoon...' : 'Verify karo ✓'}
        </button>

        {/* Resend */}
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          style={{
            marginTop: 16, fontSize: 13,
            color: resendCooldown > 0 ? 'var(--text-tertiary)' : 'var(--primary)',
            background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer',
          }}
        >
          {resendCooldown > 0
            ? `Dobara bhejo (${resendCooldown}s)`
            : 'OTP nahi aaya? Dobara bhejo'}
        </button>
      </div>
    </div>
  )
}