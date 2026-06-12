'use client'

import {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
  type ReactNode,
} from 'react'
import { resolve, type Lang, type DictKey, type Vars } from './i18n'

// ── Types ────────────────────────────────────────────────────────────────────
interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** Resolve a dict key with optional vars/count */
  t: (key: DictKey, varsOrCount?: Vars | number) => string
}

// ── Context ──────────────────────────────────────────────────────────────────
const LangContext = createContext<LangContextValue>({
  lang: 'hinglish',
  setLang: () => {},
  t: (key) => key,
})

// ── Provider — wrap at AppShell level ────────────────────────────────────────
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('hinglish')

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('milakya_lang') as Lang | null
      if (stored && ['hinglish', 'en', 'hi'].includes(stored)) {
        setLangState(stored)
      }
    } catch {}
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('milakya_lang', l) } catch {}
  }, [])

  const t = useCallback(
    (key: DictKey, varsOrCount?: Vars | number) => resolve(key, lang, varsOrCount),
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useLanguage() {
  return useContext(LangContext)
}