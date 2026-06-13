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
import { LangProvider } from '@/lib/useLanguage'
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

  // Prevent back navigation out of the app
  useEffect(() => {
    // Root cause: Google OAuth leaves accounts.google.com in the history stack.
    // popstate does NOT fire for cross-origin back-navigation (it's a full page
    // unload), so router.replace('/') never runs and the user escapes to Google.
    //
    // Fix: push a large buffer of same-origin '/' entries. Each "back" press
    // hits a '/' entry (same-origin → popstate fires), and we immediately push
    // a new one to replenish, so the user is locked to '/' indefinitely.
    const BUFFER = 30
    window.history.replaceState({ milakya: true }, '', '/')
    for (let i = 0; i < BUFFER; i++) {
      window.history.pushState({ milakya: true }, '', '/')
    }

    const handlePop = () => {
      // Each intercepted back-press: push a fresh entry to keep the buffer full
      window.history.pushState({ milakya: true }, '', '/')
    }

    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, []) // intentionally no deps — runs once on mount, needs no router ref

  // Warm up API routes on app load to avoid cold-start lag on first scan/search
  useEffect(() => {
    const routes = ['/api/scan/photo', '/api/scan/diary', '/api/search/semantic']
    routes.forEach(route => 
      fetch(route, { method: 'POST', body: '{}' })
        .catch(() => {}) // fire-and-forget, ignore errors
    )
  }, [])

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
    <LangProvider>
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
                  : i === 2 ? <ScanScreen onAdded={handleItemAdded} refreshKey={searchKey} />
                  :i === 3 ? <GharScreen 
                    isVisible={activeTab === 3 || showWalkthrough} 
                    onActiveHomeChanged={handleItemAdded} 
                    refreshKey={refreshKey} 
                  />
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
                  handleTabChange(3) 
                  setShowWalkthrough(true)
                }} />
              </div>
            )}

            {showWalkthrough && (
              <AppWalkthrough
                containerRef={appContainerRef}
                onTabChange={handleTabChange}
                onDone={() => { 
                  localStorage.setItem('milakya_walkthrough_seen', '1')
                  setShowWalkthrough(false)
                  handleTabChange(0) 
                }}
              />
            )}
          </div>
        </div>
      </AckProvider>
    </LangProvider>
  )
}