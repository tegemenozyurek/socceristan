import { useEffect, useRef, useState } from 'react'
import logoAndTitle from './assets/logoAndTitle.svg'
import { SoccerBall } from './components/SoccerBall'
import './App.css'

type Lang = 'tr' | 'en' | 'de'

const languages: { code: Lang; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
]

const ballColors = [
  '#F4F7F5',
  '#2ECC71',
  '#3498DB',
  '#E74C3C',
  '#F1C40F',
  '#E67E22',
  '#9B59B6',
  '#FF4DA6',
] as const

const copy = {
  tr: {
    signIn: 'GİRİŞ YAP',
    choose: 'KARAKTER VE TAKMA AD SEÇ',
    nickname: 'TakmaAd',
    start: 'BAŞLA',
    pickBall: 'Top rengi seç',
    howToPlay: 'NASIL OYNANIR',
    or: 'veya',
    google: 'Google ile devam et',
    terms: 'KULLANIM ŞARTLARI',
    privacy: 'GİZLİLİK',
    contact: 'İLETİŞİM',
  },
  en: {
    signIn: 'SIGN IN',
    choose: 'CHOOSE A CHARACTER AND A NICKNAME',
    nickname: 'Nickname',
    start: 'START',
    pickBall: 'Pick a ball color',
    howToPlay: 'HOW TO PLAY',
    or: 'or',
    google: 'Continue with Google',
    terms: 'TERMS OF SERVICE',
    privacy: 'PRIVACY',
    contact: 'CONTACT',
  },
  de: {
    signIn: 'ANMELDEN',
    choose: 'WÄHLE EINEN CHARAKTER UND SPITZNAMEN',
    nickname: 'Spitzname',
    start: 'START',
    pickBall: 'Ballfarbe wählen',
    howToPlay: 'SO SPIELT MAN',
    or: 'oder',
    google: 'Mit Google fortfahren',
    terms: 'NUTZUNGSBEDINGUNGEN',
    privacy: 'DATENSCHUTZ',
    contact: 'KONTAKT',
  },
} as const

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

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function ChangeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 10a7.5 7.5 0 0 1 12.8-5.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 3v4h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 14a7.5 7.5 0 0 1-12.8 5.2L5 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 21v-4h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function randomNickname(lang: Lang) {
  const n = Math.floor(1000 + Math.random() * 9000)
  if (lang === 'tr') return `Futbolcu${n}`
  if (lang === 'de') return `Kicker${n}`
  return `CoolNickname${n}`
}

function App() {
  const [lang, setLang] = useState<Lang>('tr')
  const [open, setOpen] = useState(false)
  const [nickname, setNickname] = useState(() => randomNickname('tr'))
  const [ballColor, setBallColor] = useState<string>(ballColors[1])
  const [pickerOpen, setPickerOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const t = copy[lang]
  const current = languages.find((item) => item.code === lang) ?? languages[0]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (!open && !pickerOpen) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (open && !menuRef.current?.contains(target)) setOpen(false)
      if (pickerOpen && !pickerRef.current?.contains(target)) setPickerOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setPickerOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, pickerOpen])

  return (
    <div className="glass-window">
      <header className="window-top">
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
                      setNickname(randomNickname(item.code))
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

        <img className="brand-mark" src={logoAndTitle} alt="socceristan" />
        <div className="top-spacer" aria-hidden="true" />
      </header>

      <div className="window-body">
        <section className="entry-panel" aria-label={t.signIn}>
          <div className="entry-body">
            <h2 className="entry-heading">{t.signIn}</h2>

            <div className="entry-content">
              <div className="entry-anonymous">
                <div className="avatar-wrap" ref={pickerRef}>
                  <div className="avatar">
                    <SoccerBall color={ballColor} title={t.pickBall} />
                  </div>
                  <button
                    type="button"
                    className="avatar-shuffle"
                    aria-label={t.pickBall}
                    aria-expanded={pickerOpen}
                    onClick={() => setPickerOpen((value) => !value)}
                  >
                    <ChangeIcon />
                  </button>

                  {pickerOpen && (
                    <div className="ball-picker" role="listbox" aria-label={t.pickBall}>
                      {ballColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          role="option"
                          aria-selected={color === ballColor}
                          className={color === ballColor ? 'active' : undefined}
                          onClick={() => {
                            setBallColor(color)
                            setPickerOpen(false)
                          }}
                        >
                          <SoccerBall color={color} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="entry-fields">
                  <p>{t.choose}</p>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    aria-label={t.nickname}
                    maxLength={20}
                  />
                </div>
              </div>

              <button type="button" className="start-button">
                <PlayIcon />
                <span>{t.start}</span>
              </button>

              <div className="entry-or" role="separator" aria-label={t.or}>
                <span>{t.or}</span>
              </div>

              <button type="button" className="google-button">
                <GoogleIcon />
                <span>{t.google}</span>
              </button>
            </div>
          </div>
        </section>

        <section className="howto-panel" aria-label={t.howToPlay}>
          <div className="howto-body">
            <h2 className="howto-title">{t.howToPlay}</h2>
          </div>
        </section>
      </div>

      <footer className="window-footer">
        <span className="footer-brand">rexe games</span>
        <nav className="footer-links" aria-label="Legal">
          <a href="#terms">{t.terms}</a>
          <a href="#privacy">{t.privacy}</a>
          <a href="#contact">{t.contact}</a>
        </nav>
        <span className="footer-credit">by egemenozyurek</span>
      </footer>
    </div>
  )
}

export default App
