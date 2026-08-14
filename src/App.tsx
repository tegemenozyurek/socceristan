import { useEffect, useRef, useState } from 'react'
import logoAndTitle from './assets/logoAndTitle.svg'
import { SoccerBall } from './components/SoccerBall'
import './App.css'

type Lang = 'tr' | 'en' | 'de'
type AuthMode = 'anonymous' | 'authenticated'

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
    anonymous: 'ANONİM',
    authenticated: 'HESAPLI',
    choose: 'TOP RENGİ VE TAKMA AD SEÇ',
    nickname: 'TakmaAd',
    start: 'BAŞLA',
    email: 'E-posta',
    password: 'Şifre',
    loginStart: 'GİRİŞ YAP VE BAŞLA',
    pickBall: 'Top rengi seç',
    howToPlay: 'NASIL OYNANIR',
  },
  en: {
    anonymous: 'ANONYMOUS',
    authenticated: 'AUTHENTICATED',
    choose: 'CHOOSE A BALL COLOR AND A NICKNAME',
    nickname: 'Nickname',
    start: 'START',
    email: 'Email',
    password: 'Password',
    loginStart: 'SIGN IN AND START',
    pickBall: 'Pick a ball color',
    howToPlay: 'HOW TO PLAY',
  },
  de: {
    anonymous: 'ANONYM',
    authenticated: 'ANGEMELDET',
    choose: 'WÄHLE EINE BALLFARBE UND EINEN SPITZNAMEN',
    nickname: 'Spitzname',
    start: 'START',
    email: 'E-Mail',
    password: 'Passwort',
    loginStart: 'ANMELDEN UND STARTEN',
    pickBall: 'Ballfarbe wählen',
    howToPlay: 'SO SPIELT MAN',
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
  const [mode, setMode] = useState<AuthMode>('anonymous')
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
        <section className="entry-panel" aria-label="Entry">
          <div className="entry-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'anonymous'}
              className={mode === 'anonymous' ? 'active' : undefined}
              onClick={() => setMode('anonymous')}
            >
              {t.anonymous}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'authenticated'}
              className={mode === 'authenticated' ? 'active' : undefined}
              onClick={() => setMode('authenticated')}
            >
              {t.authenticated}
            </button>
          </div>

          <div className="entry-body">
            {mode === 'anonymous' ? (
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
            ) : (
              <div className="entry-auth">
                <input type="email" placeholder={t.email} aria-label={t.email} />
                <input type="password" placeholder={t.password} aria-label={t.password} />
              </div>
            )}

            <button type="button" className="start-button">
              <PlayIcon />
              <span>{mode === 'anonymous' ? t.start : t.loginStart}</span>
            </button>
          </div>
        </section>

        <section className="howto-panel" aria-label={t.howToPlay}>
          <div className="howto-tabs-spacer" aria-hidden="true" />
          <div className="howto-body">
            <h2 className="howto-title">{t.howToPlay}</h2>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
