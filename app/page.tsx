'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { GlassTabBar } from '@/components/ui/GlassTabBar'
import { FAB } from '@/components/ui/FAB'
import { QuickAddSheet } from '@/components/ui/QuickAddSheet'
import { OnboardingWizard } from '@/components/ui/OnboardingWizard'
import { AppWalkthrough } from '@/components/ui/AppWalkthrough'
import { AckProvider } from '@/components/ui/ActionConfirmation'
import { HomeScreen }    from './components/HomeScreen'
import { SearchScreen }  from './components/SearchScreen'
import { ScanScreen }    from './components/ScanScreen'
import { GharScreen }    from './components/GharScreen'
import { ProfileScreen } from './components/ProfileScreen'

export default function AppShell() {
  const router = useRouter()
  const [authed, setAuthed]               = useState(false)
  const [activeTab, setActiveTab]         = useState(0)
  const [sheetOpen, setSheetOpen]         = useState(false)
  const [refreshKey, setRefreshKey]       = useState(0)
  const [profileKey, setProfileKey] = useState(0)
  const [searchKey, setSearchKey]     = useState(0)
  const [userInitial, setUserInitial]     = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  const sliderRef = useRef<HTMLDivElement>(null)
  const appContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        if (!localStorage.getItem('milakya_intro_seen')) {
          router.replace('/intro')
        } else {
          router.replace('/auth/login')
        }
        return
      }

      if (!localStorage.getItem('milakya_onboarded')) {
        const { data: homes } = await supabase.from('homes').select('id').limit(1)
        if (!homes || homes.length === 0) {
          setShowOnboarding(true)
        } else {
          localStorage.setItem('milakya_onboarded', '1')
          if (!localStorage.getItem('milakya_walkthrough_seen')) setShowWalkthrough(true)
        }
      } else if (!localStorage.getItem('milakya_walkthrough_seen')) {
        setShowWalkthrough(true)
      }

      setAuthed(true)
    })

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const meta = user.user_metadata ?? {}
      const name = meta.full_name ?? meta.name ?? user.email ?? ''
      setUserInitial(name[0]?.toUpperCase() ?? '?')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/auth/login')
    })

    return () => subscription.unsubscribe()
  }, [router])

  function handleTabChange(index: number) {
    setActiveTab(index)
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${index * 20}%)`
    }
  }

  const handleItemAdded = useCallback(() => { 
    setRefreshKey((k) => k + 1)
    setProfileKey((k) => k + 1)
    setSearchKey((k) => k + 1)
  }, [])

  if (!authed) return null

  return (
    // AckProvider wraps everything — position:fixed overlay renders here, above all tabs
    <AckProvider>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100dvh', background: 'var(--bg-base)' }}>
        <div
          ref={appContainerRef}
          style={{
            width: '100%', maxWidth: 430, height: '100dvh',
            background: 'var(--bg-base)', position: 'relative',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            overscrollBehavior: 'none',
          }}
        >
          <div ref={sliderRef} className="tab-slider" style={{ flex: 1 }}>
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="tab-slide scrollbar-hide">
                {i === 0 ? <HomeScreen key={refreshKey} onViewAll={() => handleTabChange(1)} onMutated={handleItemAdded} />
                : i === 1 ? <SearchScreen onMutated={handleItemAdded} refreshKey={searchKey} />
                : i === 2 ? <ScanScreen onAdded={handleItemAdded} />
                : i === 3 ? <GharScreen isVisible={activeTab === 3} onActiveHomeChanged={handleItemAdded} refreshKey={refreshKey} />
                : <ProfileScreen refreshKey={refreshKey}/>}
              </div>
            ))}
          </div>

          {!showOnboarding && (
            <>
              <div className="fab" style={{
                opacity: activeTab === 2 || showWalkthrough ? 0 : 1,
                transform: activeTab === 2 || showWalkthrough ? 'scale(0.6)' : 'scale(1)',
                pointerEvents: activeTab === 2 || showWalkthrough ? 'none' : 'auto',
                transition: 'opacity 200ms ease, transform 200ms var(--spring)',
              }}>
                <FAB onClick={() => setSheetOpen(true)} />
              </div>
              <GlassTabBar activeTab={activeTab} onTabChange={handleTabChange} userInitial={userInitial} />
            </>
          )}

          <QuickAddSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} onAdded={handleItemAdded} />

          {showOnboarding && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 100, overflowY: 'auto', overscrollBehavior: 'contain', background: 'var(--bg-base)' }}>
              <OnboardingWizard onComplete={() => {
                localStorage.setItem('milakya_onboarded', '1')
                setShowOnboarding(false)
                setRefreshKey(k => k + 1)
                setShowWalkthrough(true)
              }} />
            </div>
          )}

          {showWalkthrough && (
            <AppWalkthrough
              containerRef={appContainerRef}
              onTabChange={handleTabChange}
              onDone={() => { setShowWalkthrough(false); handleTabChange(0) }}
            />
          )}
        </div>
      </div>
    </AckProvider>
  )
}