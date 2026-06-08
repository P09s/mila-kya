'use client'

import { useEffect, useState } from 'react'
import {
  User, Globe, Users, FileDown, LogOut, ChevronRight,
  Home, Package, Star, Sun, Moon, Trash2, AlertTriangle,
} from 'lucide-react'
import { LargeTitle } from '@/components/ui/LargeTitle'
import { createClient } from '@/lib/supabase'
import { getHomes } from '@/lib/homes'
import { getAllItems } from '@/lib/items'
import type { ItemWithLocation } from '@/lib/types'
import { useTheme } from '@/lib/useTheme'
import { BottomSheet } from '@/components/ui/BottomSheet'

interface UserProfile {
  email: string | null
  name: string | null
  avatar: string | null
  provider: string
}

interface Stats {
  homes: number
  items: number
  important: number
}

type Dialog = 'signout' | 'delete' | null

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [toast, setToast] = useState('')
  const [dialog, setDialog] = useState<Dialog>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const meta = user.user_metadata ?? {}
      const identities = user.identities ?? []
      setProfile({
        email:    user.email ?? null,
        name:     meta.full_name ?? meta.name ?? null,
        avatar:   meta.avatar_url ?? meta.picture ?? null,
        provider: identities[0]?.provider ?? 'email',
      })
    })
    Promise.all([getHomes(), getAllItems()]).then(([homes, items]) => {
      setStats({
        homes: homes.length,
        items: items.length,
        important: (items as ItemWithLocation[]).filter(i => i.is_important).length,
      })
    }).catch(console.error)
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function providerLabel(p: string) {
    if (p === 'google') return 'Google se login kiya'
    if (p === 'email')  return 'Email se login kiya'
    return 'Logged in'
  }

  const displayName = profile?.name ?? profile?.email ?? '—'
  const avatarLetter = (profile?.name ?? profile?.email ?? '?')[0].toUpperCase()

  async function handleSignOut() {
    setActionLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    // Only clear the per-session onboarding flag — DB re-check restores it on next login.
    // Preserve milakya_intro_seen and milakya_walkthrough_seen so neither replays.
    localStorage.removeItem('milakya_onboarded')
    window.location.replace('/auth/login')
  }

  async function handleDeleteAccount() {
    setActionLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('delete_user_account')
      if (error) throw error
      await supabase.auth.signOut()
      localStorage.clear()  // Full wipe is correct for account deletion
      window.location.replace('/intro')
    } catch (e) {
      console.error(e)
      showToast('Kuch gadbad ho gayi. Dobara try karo.')
      setActionLoading(false)
      setDialog(null)
    }
  }

  const dialogConfig = {
    signout: {
      icon: <LogOut size={24} strokeWidth={1.8} color="#C0392B" />,
      iconBg: 'rgba(192,57,43,0.1)',
      title: 'Sign out karo?',
      body: 'Aap sign out ho jayenge. Dobara login karke wapas aa sakte hain.',
      confirmLabel: 'Haan, sign out karo',
      onConfirm: handleSignOut,
    },
    delete: {
      icon: <AlertTriangle size={24} strokeWidth={1.8} color="#C0392B" />,
      iconBg: 'rgba(192,57,43,0.1)',
      title: 'Account delete karo?',
      body: 'Yeh action undo nahi ho sakta. Aapke saare ghar, rooms, aur items hamesha ke liye delete ho jayenge.',
      confirmLabel: 'Haan, delete karo',
      onConfirm: handleDeleteAccount,
    },
  }

  const activeDialog = dialog ? dialogConfig[dialog] : null

  return (
    <div>
      <LargeTitle title="Profile" subtitle="Aapka account" />

      {toast && (
        <div style={{
          position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: '#FAF6F0',
          padding: '8px 18px', borderRadius: 100, fontSize: 12, fontWeight: 500,
          zIndex: 1100, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>{toast}</div>
      )}

      <BottomSheet isOpen={!!dialog} onClose={() => !actionLoading && setDialog(null)}>
        {activeDialog && (
          <div style={{ padding: '8px 24px 32px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: activeDialog.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {activeDialog.icon}
            </div>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700,
              color: 'var(--text-primary)', textAlign: 'center', margin: '0 0 8px',
            }}>{activeDialog.title}</h2>
            <p style={{
              fontSize: 13, color: 'var(--text-tertiary)',
              textAlign: 'center', lineHeight: 1.6, margin: '0 0 24px',
            }}>{activeDialog.body}</p>
            <button onClick={activeDialog.onConfirm} disabled={actionLoading} style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none',
              background: actionLoading ? 'var(--bg-elevated)' : '#C0392B',
              color: actionLoading ? 'var(--text-tertiary)' : '#FFFFFF',
              fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              cursor: actionLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 12,
            }}>
              {actionLoading ? 'Wait karo...' : activeDialog.confirmLabel}
            </button>
            <button onClick={() => setDialog(null)} disabled={actionLoading} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
              fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              Nahi, wapas jao
            </button>
          </div>
        )}
      </BottomSheet>

      <div style={{ padding: '0 16px' }}>
        
        <div data-walkthrough="profile-top-section">
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 20,
            border: '1px solid var(--border-soft)', padding: 16, marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 1px 4px rgba(42,27,16,0.07)',
          }}>
            {profile?.avatar ? (
              <img src={profile.avatar} alt="avatar" referrerPolicy="no-referrer"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 52, height: 52, borderRadius: '50%', background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, color: '#FAF6F0',
              }}>
                {profile ? avatarLetter : <User size={24} strokeWidth={1.8} color="#FAF6F0" />}
              </div>
            )}
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{displayName}</div>
              {profile?.name && profile?.email && (
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{profile.email}</div>
              )}
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                {profile ? providerLabel(profile.provider) : 'Loading...'}
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)', borderRadius: 18,
            border: '1px solid var(--border-soft)', padding: '14px 8px',
            marginBottom: 12, display: 'flex', alignItems: 'center',
            boxShadow: '0 1px 4px rgba(42,27,16,0.07)',
          }}>
            {[
              { Icon: Home,    value: stats?.homes,     label: 'Ghars',     color: 'var(--primary)' },
              { Icon: Package, value: stats?.items,     label: 'Items',     color: 'var(--sage)'    },
              { Icon: Star,    value: stats?.important, label: 'Important', color: 'var(--gold)'    },
            ].map(({ Icon, value, label, color }, i, arr) => (
              <div key={label} style={{
                flex: 1, textAlign: 'center',
                borderRight: i < arr.length - 1 ? '1px solid var(--border-soft)' : 'none',
                padding: '0 8px',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `color-mix(in srgb, ${color} 12%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px',
                }}>
                  <Icon size={16} strokeWidth={1.8} color={color} />
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {value ?? '—'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)', borderRadius: 16,
          border: '1px solid var(--border-soft)', overflow: 'hidden',
          marginBottom: 12, boxShadow: '0 1px 4px rgba(42,27,16,0.07)',
        }}>
          <div className="press-scale" onClick={toggle} style={settingRow(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {theme === 'dark'
                ? <Moon size={16} strokeWidth={1.8} color="var(--text-secondary)" />
                : <Sun  size={16} strokeWidth={1.8} color="var(--text-secondary)" />}
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <div style={{
              width: 36, height: 20, borderRadius: 100,
              background: theme === 'dark' ? 'var(--primary)' : 'var(--bg-elevated)',
              border: '1px solid var(--border-soft)', position: 'relative', transition: 'background 200ms',
            }}>
              <div style={{
                position: 'absolute', top: 2,
                left: theme === 'dark' ? 18 : 2,
                width: 14, height: 14, borderRadius: '50%',
                background: theme === 'dark' ? '#FAF6F0' : 'var(--text-tertiary)',
                transition: 'left 200ms var(--spring)',
              }} />
            </div>
          </div>

          <div style={settingRow(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Globe size={16} strokeWidth={1.8} color="var(--text-secondary)" />
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Bhasha (Language)</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--primary)' }}>English</span>
          </div>

          <div className="press-scale" onClick={() => showToast('Jald aayega — Phase 2!')} style={settingRow(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={16} strokeWidth={1.8} color="var(--text-secondary)" />
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Family Sharing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, background: 'var(--primary-pale)', color: 'var(--primary)', padding: '2px 7px', borderRadius: 100, fontWeight: 500 }}>Jald</span>
              <ChevronRight size={14} strokeWidth={2} color="var(--text-tertiary)" />
            </div>
          </div>

          <div className="press-scale" onClick={() => showToast('Jald aayega — Phase 2!')} style={settingRow(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileDown size={16} strokeWidth={1.8} color="var(--text-secondary)" />
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Export Inventory</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, background: 'var(--primary-pale)', color: 'var(--primary)', padding: '2px 7px', borderRadius: 100, fontWeight: 500 }}>Jald</span>
              <ChevronRight size={14} strokeWidth={2} color="var(--text-tertiary)" />
            </div>
          </div>
        </div>

        <div className="press-scale" onClick={() => setDialog('signout')} style={{
          background: 'var(--bg-surface)', borderRadius: 16,
          border: '1px solid var(--border-soft)', padding: '13px 16px',
          marginBottom: 8, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(42,27,16,0.07)',
        }}>
          <LogOut size={16} strokeWidth={1.8} color="#C0392B" />
          <span style={{ fontSize: 14, color: '#C0392B', fontWeight: 500 }}>Sign Out</span>
        </div>

        <div className="press-scale" onClick={() => setDialog('delete')} style={{
          background: 'var(--bg-surface)', borderRadius: 16,
          border: '1px solid rgba(192,57,43,0.15)', padding: '13px 16px',
          marginBottom: 12, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, cursor: 'pointer',
        }}>
          <Trash2 size={15} strokeWidth={1.8} color="rgba(192,57,43,0.5)" />
          <span style={{ fontSize: 13, color: 'rgba(192,57,43,0.5)', fontWeight: 500 }}>Delete Account</span>
        </div>

        <div style={{ textAlign: 'center', padding: 12, fontSize: 12, color: 'var(--text-tertiary)' }}>
          MilaKya v1.0 · Bharat ke liye 🇮🇳
        </div>
      </div>
    </div>
  )
}

function settingRow(hasBorder: boolean): React.CSSProperties {
  return {
    padding: '13px 16px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', cursor: 'pointer',
    borderBottom: hasBorder ? '1px solid var(--border-soft)' : 'none',
  }
}