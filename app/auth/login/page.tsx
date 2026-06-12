'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  // ✅ Don't render the form until we've confirmed there's no active session
  const [sessionChecked, setSessionChecked] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    window.history.replaceState(null, '', '/auth/login')
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/')
        return
      }
      if (!localStorage.getItem('milakya_intro_seen')) {
        router.replace('/intro')
        return
      }
      // ✅ Only now is it safe to show the login form
      setSessionChecked(true)
    })
  }, [router])

  // ✅ Return null while session check is in flight.
  // If a logged-in user lands here via back navigation, they'll see a blank
  // screen for ~100ms then get silently redirected to '/'. No form flash.
  if (!sessionChecked) return null

  async function handleEmailAuth() {
    if (!email.trim() || !password.trim()) {
      setError('Email aur password dono bharein')
      return
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye')
      return
    }
    setLoading(true)
    setError('')
    setSuccessMsg('')
    const supabase = createClient()
    if (mode === 'register') {
      const { error: err } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (err) {
        setError(err.message)
      } else {
        setSuccessMsg('Account ban gaya! Ab login karo.')
        setMode('login')
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (err) {
        setError('Email ya password galat hai')
      } else {
        router.replace('/')
      }
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (err) {
      setError(err.message)
      setGoogleLoading(false)
    }
  }

  // ... rest of the JSX stays exactly the same
  return (
    <div style={{
      position: 'fixed', inset: 0, overflowY: 'auto',
      background: 'var(--bg-base)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      padding: '48px 20px 32px', WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ margin: '0 auto 14px', width: 80, height: 80 }}>
          <img src="/app-icon.png" alt="MilaKya" style={{ width: 80, height: 80, borderRadius: 20, boxShadow: '0 8px 24px rgba(200,96,58,0.25)' }} />
        </div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>MilaKya</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3 }}>Apna saman, apni jagah</p>
      </div>

      <div style={{ width: '100%', maxWidth: 380, background: 'var(--bg-surface)', borderRadius: 24, border: '1px solid var(--border-soft)', boxShadow: '0 4px 24px rgba(42,27,16,0.08)', padding: '28px 24px' }}>
        <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
          {(['login', 'register'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccessMsg('') }}
              style={{ flex: 1, padding: '8px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif', cursor: 'pointer', transition: 'all 180ms', background: mode === m ? 'var(--bg-surface)' : 'transparent', color: mode === m ? 'var(--primary)' : 'var(--text-tertiary)', boxShadow: mode === m ? '0 1px 4px rgba(42,27,16,0.1)' : 'none' }}>
              {m === 'login' ? 'Login karo' : 'Register karo'}
            </button>
          ))}
        </div>

        <button onClick={handleGoogle} disabled={googleLoading}
          style={{ width: '100%', padding: '12px', borderRadius: 14, marginBottom: 16, background: googleLoading ? 'var(--bg-elevated)' : 'var(--bg-surface)', border: '1.5px solid var(--border-soft)', fontSize: 14, fontWeight: 600, fontFamily: 'Outfit, sans-serif', color: googleLoading ? 'var(--text-tertiary)' : 'var(--text-primary)', cursor: googleLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 180ms' }}>
          {googleLoading ? 'Redirect ho raha hoon...' : (
            <>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google se {mode === 'login' ? 'login' : 'register'} karo
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>YA</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Email</label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aap@example.com" onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()} style={{ ...inputStyle, paddingLeft: 38 }} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Kam se kam 6 characters' : '••••••••'} onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()} style={{ ...inputStyle, paddingLeft: 38, paddingRight: 42 }} />
            <button onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
              {showPassword ? <EyeOff size={15} color="var(--text-tertiary)" /> : <Eye size={15} color="var(--text-tertiary)" />}
            </button>
          </div>
        </div>

        {error && <div style={{ fontSize: 12, color: '#D94F4F', marginBottom: 12, padding: '8px 12px', background: '#FDF0F0', borderRadius: 8 }}>{error}</div>}
        {successMsg && <div style={{ fontSize: 12, color: '#4A7C59', marginBottom: 12, padding: '8px 12px', background: '#EDF3ED', borderRadius: 8 }}>{successMsg}</div>}

        <button onClick={handleEmailAuth} disabled={loading}
          style={{ width: '100%', padding: '13px', borderRadius: 14, background: loading ? 'var(--bg-elevated)' : 'var(--primary)', color: loading ? 'var(--text-tertiary)' : '#FAF6F0', border: 'none', fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: !loading ? '0 4px 16px rgba(200,96,58,0.35)' : 'none', transition: 'all 200ms' }}>
          {loading ? (mode === 'login' ? 'Login ho raha hoon...' : 'Account ban raha hoon...') : (mode === 'login' ? 'Login karo →' : 'Account banao →')}
        </button>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 20, textAlign: 'center', maxWidth: 300 }}>
        Login karke aap hamare Terms & Privacy Policy se agree karte hain
      </p>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.02em',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12,
  border: '1px solid var(--border-soft)', background: 'var(--bg-elevated)',
  fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif',
  outline: 'none',
}