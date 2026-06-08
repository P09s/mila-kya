'use client'

import { useState } from 'react'
import {
  Home, Building, Users, Heart, Briefcase, Package, Warehouse, Trees,
  Plus, ChevronRight, Check, MapPin, Sofa, UtensilsCrossed, BedDouble,
  Bath, BookOpen, Box, Rocket, PartyPopper, ArrowRight,
} from 'lucide-react'
import { createHome, setActiveHome } from '@/lib/homes'
import { createRoom } from '@/lib/rooms'

const HOME_ICONS = [
  { key: 'home',      Icon: Home,      label: 'Ghar'      },
  { key: 'building',  Icon: Building,  label: 'PG/Hostel' },
  { key: 'users',     Icon: Users,     label: 'Maika'     },
  { key: 'heart',     Icon: Heart,     label: 'Sasural'   },
  { key: 'briefcase', Icon: Briefcase, label: 'Office'    },
  { key: 'package',   Icon: Package,   label: 'Storage'   },
  { key: 'warehouse', Icon: Warehouse, label: 'Warehouse' },
  { key: 'trees',     Icon: Trees,     label: 'Farmhouse' },
]

const HOME_PRESETS = [
  { iconKey: 'home',      name: 'Ghar'        },
  { iconKey: 'building',  name: 'PG / Hostel' },
  { iconKey: 'users',     name: 'Maika'       },
  { iconKey: 'heart',     name: 'Sasural'     },
  { iconKey: 'briefcase', name: 'Office'      },
  { iconKey: 'package',   name: 'Storage'     },
]

const ROOM_PRESETS = [
  { icon: BedDouble,       name: 'Bedroom'     },
  { icon: UtensilsCrossed, name: 'Kitchen'     },
  { icon: Sofa,            name: 'Living Room' },
  { icon: Bath,            name: 'Bathroom'    },
  { icon: BookOpen,        name: 'Study Room'  },
  { icon: Box,             name: 'Store Room'  },
]

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [homeName, setHomeName] = useState('')
  const [homeIconKey, setHomeIconKey] = useState('home')
  const [homeCity, setHomeCity] = useState('')
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Bedroom'])
  const [customRoom, setCustomRoom] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function toggleRoom(name: string) {
    setSelectedRooms(prev =>
      prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]
    )
  }

  function addCustomRoom() {
    const t = customRoom.trim()
    if (!t || selectedRooms.includes(t)) return
    setSelectedRooms(prev => [...prev, t])
    setCustomRoom('')
  }

  async function handleFinish() {
    setLoading(true)
    try {
      const home = await createHome({
        name: homeName.trim(),
        icon: homeIconKey,
        city: homeCity.trim() || null,
        address: null,
      })
      await setActiveHome(home.id)
      await Promise.all(selectedRooms.map(r => createRoom(home.id, r)))
      setDone(true)
      setTimeout(onComplete, 1800)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const ActiveHomeIcon = HOME_ICONS.find(i => i.key === homeIconKey)?.Icon ?? Home

  // Outer shell — matches AppShell's 430px container
  const shell: React.CSSProperties = {
    position: 'absolute', inset: 0,
    background: 'var(--bg-base)',
    display: 'flex', flexDirection: 'column',
    zIndex: 50,
    overflowY: 'auto', overflowX: 'hidden',
    isolation: 'isolate',
  }

  if (done) {
    return (
      <div style={{ ...shell, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(200,96,58,0.4)',
          animation: 'spring-in 400ms var(--spring) both',
        }}>
          <Check size={40} strokeWidth={2.5} color="#FAF6F0" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
          <PartyPopper size={22} strokeWidth={1.8} color="var(--primary)" />
          Sab ready hai!
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          {homeName} set up ho gaya
        </div>
      </div>
    )
  }

  return (
    <div style={shell}>
      {/* Progress bar */}
      <div style={{ padding: '52px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{
              flex: 1, height: 3, borderRadius: 100,
              background: n <= step ? 'var(--primary)' : 'var(--bg-elevated)',
              transition: 'background 300ms',
            }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 24px 48px', display: 'flex', flexDirection: 'column' }}>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div style={{ animation: 'slideIn 350ms var(--ease-out) both' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={stepLabel}>Step 1 of 3</div>
              <h1 style={heading}>Pehla ghar banao</h1>
              <Home size={26} strokeWidth={1.6} color="var(--primary)" style={{ margin: '6px 0 8px' }} />
              <p style={sub}>Kahan rehte ho? Ghar, PG, hostel — jo bhi ho.</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelSt}>Quick select karo</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {HOME_PRESETS.map(p => {
                  const Icon = HOME_ICONS.find(i => i.key === p.iconKey)!.Icon
                  const isSel = homeName === p.name && homeIconKey === p.iconKey
                  return (
                    <button key={p.name} onClick={() => { setHomeIconKey(p.iconKey); setHomeName(p.name) }}
                      style={chipStyle(isSel)}>
                      <Icon size={14} strokeWidth={isSel ? 2.2 : 1.8} />{p.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelSt}>Naam *</label>
              <input type="text" value={homeName} onChange={e => setHomeName(e.target.value)}
                placeholder="Ghar, PG, Sasural..." style={inputSt} autoFocus />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelSt}>Icon</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {HOME_ICONS.map(({ key, Icon, label }) => {
                  const isSel = homeIconKey === key
                  return (
                    <button key={key} onClick={() => setHomeIconKey(key)} title={label}
                      style={iconBtnStyle(isSel)}>
                      <Icon size={20} strokeWidth={isSel ? 2.2 : 1.7} color={isSel ? 'var(--primary)' : 'var(--text-secondary)'} />
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelSt}>City (optional)</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} color="var(--text-tertiary)"
                  style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" value={homeCity} onChange={e => setHomeCity(e.target.value)}
                  placeholder="Delhi, Jaipur, Lucknow..." style={{ ...inputSt, paddingLeft: 36 }} />
              </div>
            </div>

            <button onClick={() => homeName.trim() && setStep(2)} disabled={!homeName.trim()}
              style={primaryBtn(!homeName.trim())}>
              Aage badho <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div style={{ animation: 'slideIn 350ms var(--ease-out) both' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={stepLabel}>Step 2 of 3</div>
              <h1 style={heading}>Rooms add karo</h1>
              <Sofa size={26} strokeWidth={1.6} color="var(--primary)" style={{ margin: '6px 0 8px' }} />
              <p style={sub}><span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{homeName}</span> mein kaun kaun se rooms hain?</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelSt}>Tap karke select karo</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ROOM_PRESETS.map(({ icon: RIcon, name }) => {
                  const isSel = selectedRooms.includes(name)
                  return (
                    <button key={name} onClick={() => toggleRoom(name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 14,
                        border: isSel ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)',
                        background: isSel ? 'var(--primary-pale)' : 'var(--bg-surface)',
                        cursor: 'pointer', transition: 'all 150ms', textAlign: 'left',
                      }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: isSel ? 'rgba(200,96,58,0.15)' : 'var(--bg-elevated)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <RIcon size={18} strokeWidth={1.8} color={isSel ? 'var(--primary)' : 'var(--text-secondary)'} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: isSel ? 'var(--primary)' : 'var(--text-primary)', flex: 1 }}>
                        {name}
                      </span>
                      {isSel && <Check size={16} strokeWidth={2.5} color="var(--primary)" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelSt}>Ya khud likho</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" value={customRoom} onChange={e => setCustomRoom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomRoom()}
                  placeholder="Terrace, Balcony, Pooja room..." style={{ ...inputSt, flex: 1 }} />
                <button onClick={addCustomRoom} style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0, border: 'none',
                  background: customRoom.trim() ? 'var(--primary)' : 'var(--bg-elevated)',
                  cursor: customRoom.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms',
                }}>
                  <Plus size={18} strokeWidth={2.5} color={customRoom.trim() ? '#FAF6F0' : 'var(--text-tertiary)'} />
                </button>
              </div>
              {selectedRooms.filter(r => !ROOM_PRESETS.map(p => p.name).includes(r)).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {selectedRooms.filter(r => !ROOM_PRESETS.map(p => p.name).includes(r)).map(r => (
                    <div key={r} onClick={() => toggleRoom(r)} style={{
                      padding: '5px 12px', borderRadius: 100, cursor: 'pointer',
                      background: 'var(--primary-pale)', border: '1px solid rgba(200,96,58,0.2)',
                      fontSize: 12, fontWeight: 500, color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      {r} <span style={{ opacity: 0.6 }}>×</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={backBtn}>
                <ArrowRight size={18} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} color="var(--text-secondary)" />
              </button>
              <button onClick={() => selectedRooms.length > 0 && setStep(3)} disabled={selectedRooms.length === 0}
                style={{ ...primaryBtn(selectedRooms.length === 0), flex: 1 }}>
                Aage badho <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div style={{ animation: 'slideIn 350ms var(--ease-out) both' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={stepLabel}>Step 3 of 3</div>
              <h1 style={heading}>Sab theek hai?</h1>
              <Check size={26} strokeWidth={2} color="var(--primary)" style={{ margin: '6px 0 8px' }} />
              <p style={sub}>Ek baar check karo, phir shuru karte hain!</p>
            </div>

            <div style={{
              background: 'var(--bg-surface)', borderRadius: 20,
              border: '1px solid var(--border-soft)', padding: 20, marginBottom: 20,
              boxShadow: '0 2px 12px rgba(42,27,16,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(200,96,58,0.3)',
                }}>
                  <ActiveHomeIcon size={24} strokeWidth={2} color="#FAF6F0" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{homeName}</div>
                  {homeCity && (
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={11} strokeWidth={2} /> {homeCity}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border-soft)', marginBottom: 14 }} />
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                {selectedRooms.length} Rooms
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedRooms.map(r => (
                  <div key={r} style={{
                    padding: '5px 12px', borderRadius: 100,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
                    fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
                  }}>{r}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(2)} style={backBtn}>
                <ArrowRight size={18} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} color="var(--text-secondary)" />
              </button>
              <button onClick={handleFinish} disabled={loading} style={{ ...primaryBtn(loading), flex: 1 }}>
                {loading ? 'Setting up...' : <><Rocket size={16} strokeWidth={2} /> Shuru karo</>}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────
const stepLabel: React.CSSProperties = {
  fontSize: 13, color: 'var(--primary)', fontWeight: 600,
  marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase',
}
const heading: React.CSSProperties = {
  fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800,
  color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0,
}
const sub: React.CSSProperties = {
  fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0,
}
const labelSt: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.02em',
}
const inputSt: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: '1px solid var(--border-soft)', background: 'var(--bg-surface)',
  fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif',
  outline: 'none', boxSizing: 'border-box',
}
const backBtn: React.CSSProperties = {
  width: 48, height: 52, borderRadius: 14, flexShrink: 0,
  background: 'var(--bg-surface)', border: '1px solid var(--border-soft)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
}
function chipStyle(sel: boolean): React.CSSProperties {
  return {
    padding: '8px 14px', borderRadius: 12, fontSize: 13, fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 150ms',
    border: sel ? '1.5px solid var(--primary)' : '1px solid var(--border-soft)',
    background: sel ? 'var(--primary-pale)' : 'var(--bg-surface)',
    color: sel ? 'var(--primary)' : 'var(--text-secondary)',
  }
}
function iconBtnStyle(sel: boolean): React.CSSProperties {
  return {
    width: 44, height: 44, borderRadius: 12, cursor: 'pointer', transition: 'all 150ms',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: sel ? '2px solid var(--primary)' : '1px solid var(--border-soft)',
    background: sel ? 'var(--primary-pale)' : 'var(--bg-surface)',
  }
}
function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '14px 20px', borderRadius: 16, border: 'none',
    background: disabled ? 'var(--bg-elevated)' : 'var(--primary)',
    color: disabled ? 'var(--text-tertiary)' : '#FAF6F0',
    fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 4px 16px rgba(200,96,58,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all 200ms', width: '100%',
  }
}