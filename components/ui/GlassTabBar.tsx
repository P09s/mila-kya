import { Home, Search, Camera, Building2, User } from 'lucide-react'

const TABS = [
  { icon: Home,      label: 'Home',    index: 0 },
  { icon: Search,    label: 'Dhoondo', index: 1 },
  { icon: Camera,    label: 'Scan',    index: 2 },
  { icon: Building2, label: 'Ghar',    index: 3 },
  { icon: User,      label: 'Profile', index: 4 },
]

interface GlassTabBarProps {
  activeTab: number
  onTabChange: (index: number) => void
  userInitial?: string
}

export function GlassTabBar({ activeTab, onTabChange, userInitial }: GlassTabBarProps) {
  return (
    <div className="tab-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 4px 8px' }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.index
        const Icon = tab.icon
        return (
          <button
            key={tab.index}
            data-walkthrough={`tab-${tab.index}`}
            onClick={() => onTabChange(tab.index)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '8px 16px', cursor: 'pointer', background: 'none', border: 'none',
              position: 'relative', transition: 'transform 120ms var(--spring)',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)' }}
            onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = '' }}
            onTouchStart={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)' }}
            onTouchEnd={(e) => { (e.currentTarget as HTMLElement).style.transform = '' }}
            aria-label={tab.label}
          >
            {tab.index === 0 && userInitial ? (
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 700,
                color: '#FAF6F0',
                boxShadow: isActive ? '0 0 0 2px var(--primary-pale)' : 'none',
                transition: 'all 200ms',
              }}>
                {userInitial}
              </div>
            ) : (
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.7}
                color={isActive ? 'var(--primary)' : 'var(--text-tertiary)'}
                style={{ transition: 'color 200ms' }}
              />
            )}
            <span style={{
              fontSize: 10, fontWeight: 500,
              color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
              letterSpacing: '0.01em', transition: 'color 200ms',
            }}>
              {tab.label}
            </span>
            {isActive && (
              <span style={{
                position: 'absolute', bottom: 2,
                width: 32, height: 3, borderRadius: 100,
                background: 'var(--primary)',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}