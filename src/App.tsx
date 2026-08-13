import { useEffect, useRef, useState } from 'react'
import logoAndTitle from './assets/logoAndTitle.svg'
import './App.css'

type Lang = 'tr' | 'en' | 'de'

const languages: { code: Lang; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
]

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3c2.2 2.4 3.3 5.1 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.1-3.3-9s1.1-6.6 3.3-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function App() {
  const [lang, setLang] = useState<Lang>('tr')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const current = languages.find((item) => item.code === lang) ?? languages[0]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="glass-window">
      <img
        className="brand-mark"
        src={logoAndTitle}
        alt="socceristan"
      />

      <div className="lang-menu" ref={menuRef}>
        <button
          type="button"
          className="lang-button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <GlobeIcon />
          <span>{current.label}</span>
        </button>

        {open && (
          <ul className="lang-dropdown" role="listbox" aria-label="Language">
            {languages.map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.code === lang}
                  className={item.code === lang ? 'active' : undefined}
                  onClick={() => {
                    setLang(item.code)
                    setOpen(false)
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
