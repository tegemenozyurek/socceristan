import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import logoAndTitle from './assets/logoAndTitle.svg'
import bull from './assets/characters/bull.png'
import cat from './assets/characters/cat.png'
import chicken from './assets/characters/chicken.png'
import crocs from './assets/characters/crocs.png'
import dog from './assets/characters/dog.png'
import flamingo from './assets/characters/flamingo.png'
import racoon from './assets/characters/racoon.png'
import snake from './assets/characters/snake.png'
import './App.css'

type Lang = 'tr' | 'en' | 'de'
type ModeId =
  | 'classic'
  | 'quick'
  | 'penalty'
  | 'tournament'
  | 'friends'
  | 'ranked'
  | 'arcade'
  | 'training'
  | 'custom'

const languages: { code: Lang; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
]

const characters = [bull, cat, chicken, crocs, dog, flamingo, racoon, snake] as const
const playerCapacityOptions = [2, 4, 6, 8] as const

function randomCharacter(exclude?: string) {
  const options = exclude
    ? characters.filter((item) => item !== exclude)
    : [...characters]
  return options[Math.floor(Math.random() * options.length)] ?? characters[0]
}

const modes: { id: ModeId; icon: string }[] = [
  { id: 'classic', icon: '⚽' },
  { id: 'quick', icon: '⚡' },
  { id: 'penalty', icon: '🥅' },
  { id: 'tournament', icon: '🏆' },
  { id: 'friends', icon: '🤝' },
  { id: 'ranked', icon: '📈' },
  { id: 'arcade', icon: '🎮' },
  { id: 'training', icon: '🎯' },
  { id: 'custom', icon: '⚙️' },
]

const copy = {
  tr: {
    signIn: 'GİRİŞ YAP',
    choose: 'KARAKTER VE TAKMA AD SEÇ',
    nickname: 'TakmaAd',
    start: 'HIZLI BAŞLA',
    pickCharacter: 'Karakter değiştir',
    howToPlay: 'NASIL OYNANIR',
    or: 'veya',
    google: 'Google ile devam et',
    terms: 'KULLANIM ŞARTLARI',
    privacy: 'GİZLİLİK',
    contact: 'İLETİŞİM',
    back: 'GERİ',
    players: 'OYUNCULAR',
    empty: 'BOŞ',
    presets: 'MODLAR',
    invite: 'DAVET ET',
    startMatch: 'BAŞLAT',
    playersCount: (n: number) => `${n} OYUNCU`,
    soundOn: 'Sesi aç',
    soundOff: 'Sesi kapat',
    modes: {
      classic: 'KLASİK',
      quick: 'HIZLI',
      penalty: 'PENALTI',
      tournament: 'TURNUVA',
      friends: 'ARKADAŞ',
      ranked: 'SIRALI',
      arcade: 'ARCADE',
      training: 'ANTRENMAN',
      custom: 'ÖZEL',
    },
    modeDesc: {
      classic: 'Standart maç. Zamanlı oynayın veya ilk golü atan kazansın.',
      quick: 'Kısa turlar, hızlı skor. Atlayın ve hemen oynayın.',
      penalty: 'Sadece penaltı. Noktadan sırayla şut atın.',
      tournament: 'Birden fazla maçlık bracket turnuvası.',
      friends: 'Arkadaşlarla özel lobi, rahat kurallar.',
      ranked: 'Rekabetçi puanlarla sıralamada yüksel.',
      arcade: 'Çılgın kurallar ve güçlendirmelerle kaos.',
      training: 'Yalnız veya yapay zekaya karşı antrenman.',
      custom: 'Kendi kurallarını ve maç süreni belirle.',
    },
  },
  en: {
    signIn: 'SIGN IN',
    choose: 'CHOOSE A CHARACTER AND A NICKNAME',
    nickname: 'Nickname',
    start: 'QUICK START',
    pickCharacter: 'Change character',
    howToPlay: 'HOW TO PLAY',
    or: 'or',
    google: 'Continue with Google',
    terms: 'TERMS OF SERVICE',
    privacy: 'PRIVACY',
    contact: 'CONTACT',
    back: 'BACK',
    players: 'PLAYERS',
    empty: 'EMPTY',
    presets: 'MODES',
    invite: 'INVITE',
    startMatch: 'START',
    playersCount: (n: number) => `${n} PLAYERS`,
    soundOn: 'Unmute sound',
    soundOff: 'Mute sound',
    modes: {
      classic: 'CLASSIC',
      quick: 'QUICK',
      penalty: 'PENALTY',
      tournament: 'TOURNAMENT',
      friends: 'FRIENDS',
      ranked: 'RANKED',
      arcade: 'ARCADE',
      training: 'TRAINING',
      custom: 'CUSTOM',
    },
    modeDesc: {
      classic: 'Standard match. Play timed or first goal wins.',
      quick: 'Short rounds, fast scoring. Jump in and play.',
      penalty: 'Penalties only. Take turns from the spot.',
      tournament: 'Bracket competition across multiple matches.',
      friends: 'Private lobby with friends and casual rules.',
      ranked: 'Climb the ladder with competitive scoring.',
      arcade: 'Wild rules and power-ups for chaotic fun.',
      training: 'Practice alone or vs AI — no pressure.',
      custom: 'Build your own rules and match length.',
    },
  },
  de: {
    signIn: 'ANMELDEN',
    choose: 'WÄHLE EINEN CHARAKTER UND SPITZNAMEN',
    nickname: 'Spitzname',
    start: 'SCHNELLSTART',
    pickCharacter: 'Charakter wechseln',
    howToPlay: 'SO SPIELT MAN',
    or: 'oder',
    google: 'Mit Google fortfahren',
    terms: 'NUTZUNGSBEDINGUNGEN',
    privacy: 'DATENSCHUTZ',
    contact: 'KONTAKT',
    back: 'ZURÜCK',
    players: 'SPIELER',
    empty: 'LEER',
    presets: 'MODI',
    invite: 'EINLADEN',
    startMatch: 'START',
    playersCount: (n: number) => `${n} SPIELER`,
    soundOn: 'Ton einschalten',
    soundOff: 'Ton ausschalten',
    modes: {
      classic: 'KLASSISCH',
      quick: 'SCHNELL',
      penalty: 'ELFMETER',
      tournament: 'TURNIER',
      friends: 'FREUNDE',
      ranked: 'RANGLISTE',
      arcade: 'ARCADE',
      training: 'TRAINING',
      custom: 'CUSTOM',
    },
    modeDesc: {
      classic: 'Standardspiel. Zeitlich oder erstes Tor gewinnt.',
      quick: 'Kurze Runden, schnelle Tore. Rein und spielen.',
      penalty: 'Nur Elfmeter. Abwechselnd vom Punkt schießen.',
      tournament: 'Bracket-Turnier über mehrere Spiele.',
      friends: 'Private Lobby mit Freunden und lockeren Regeln.',
      ranked: 'Steige mit Wettbewerbs-Punkten in der Rangliste.',
      arcade: 'Wilde Regeln und Power-ups für Chaos-Spaß.',
      training: 'Allein oder gegen KI trainieren — ohne Druck.',
      custom: 'Eigene Regeln und Spieldauer festlegen.',
    },
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

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14.5 6 8.5 12l6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 16 6.5 9l3.5 3.5L12 7l2 5.5L17.5 9 20 16H4z"
        fill="currentColor"
      />
    </svg>
  )
}

function EmptyAvatarIcon() {
  return (
    <svg className="empty-avatar" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.12)" />
      <circle cx="14" cy="17" r="2.1" fill="rgba(255,255,255,0.55)" />
      <circle cx="26" cy="17" r="2.1" fill="rgba(255,255,255,0.55)" />
      <path
        d="M13 28c2.2-2.4 5-3.6 7-3.6s4.8 1.2 7 3.6"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5H4z"
        fill="currentColor"
      />
      <path
        d="M15.2 9.2a3.4 3.4 0 0 1 0 5.6M17.6 7a6 6 0 0 1 0 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5H4z"
        fill="currentColor"
      />
      <path
        d="M16 9.5 20.5 14M20.5 9.5 16 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
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
  const location = useLocation()
  const navigate = useNavigate()
  const isLobby = location.pathname === '/mod'
  const [lang, setLang] = useState<Lang>('tr')
  const [open, setOpen] = useState(false)
  const [nickname, setNickname] = useState(() => randomNickname('tr'))
  const [character, setCharacter] = useState(() => randomCharacter())
  const [capacity, setCapacity] = useState<(typeof playerCapacityOptions)[number]>(8)
  const [mode, setMode] = useState<ModeId>('classic')
  const [soundOn, setSoundOn] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const t = copy[lang]
  const current = languages.find((item) => item.code === lang) ?? languages[0]
  const filledSlots = 1

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
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

  if (location.pathname !== '/' && location.pathname !== '/mod') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="glass-window">
      <header className="window-top">
        {isLobby ? (
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/')}
          >
            <BackIcon />
            <span>{t.back}</span>
          </button>
        ) : (
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
        )}

        <img className="brand-mark" src={logoAndTitle} alt="socceristan" />

        <button
          type="button"
          className={soundOn ? 'sound-button' : 'sound-button muted'}
          aria-pressed={!soundOn}
          aria-label={soundOn ? t.soundOff : t.soundOn}
          onClick={() => setSoundOn((value) => !value)}
        >
          {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </header>

      {!isLobby ? (
        <div className="window-body">
          <section className="entry-panel" aria-label={t.signIn}>
            <div className="entry-body">
              <h2 className="entry-heading">{t.signIn}</h2>

              <div className="entry-content">
                <div className="entry-anonymous">
                  <div className="avatar-wrap">
                    <div className="avatar">
                      <img src={character} alt="" />
                    </div>
                    <button
                      type="button"
                      className="avatar-shuffle"
                      aria-label={t.pickCharacter}
                      onClick={() => setCharacter((current) => randomCharacter(current))}
                    >
                      <ChangeIcon />
                    </button>
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

                <button
                  type="button"
                  className="start-button"
                  onClick={() => navigate('/mod')}
                >
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
      ) : (
        <div className="lobby-body">
          <section className="lobby-panel players-panel" aria-label={t.players}>
            <div className="lobby-panel-head">
              <h2>
                {t.players}{' '}
                <span>
                  {filledSlots}/{capacity}
                </span>
              </h2>
              <label className="capacity-select">
                <span className="sr-only">{t.players}</span>
                <select
                  value={capacity}
                  onChange={(event) =>
                    setCapacity(Number(event.target.value) as (typeof playerCapacityOptions)[number])
                  }
                >
                  {playerCapacityOptions.map((count) => (
                    <option key={count} value={count}>
                      {t.playersCount(count)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ul className="player-list">
              <li className="player-slot filled" style={{ '--slot': 0 } as CSSProperties}>
                <img src={character} alt="" />
                <span className="player-name">{nickname || t.nickname}</span>
                <span className="host-badge" title="Host">
                  <CrownIcon />
                </span>
              </li>
              {Array.from({ length: capacity - 1 }, (_, index) => (
                <li
                  key={index}
                  className="player-slot empty"
                  style={{ '--slot': index + 1 } as CSSProperties}
                >
                  <EmptyAvatarIcon />
                  <span className="player-name">{t.empty}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="lobby-panel modes-panel" aria-label={t.presets}>
            <h2 className="modes-heading">{t.presets}</h2>

            <div className="modes-grid">
              {modes.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={mode === item.id ? 'mode-card active' : 'mode-card'}
                  style={{ '--i': index } as CSSProperties}
                  onClick={() => setMode(item.id)}
                >
                  <span className="mode-face mode-face-default">
                    <span className="mode-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="mode-title">{t.modes[item.id]}</span>
                  </span>
                  <span className="mode-face mode-face-detail" aria-hidden="true">
                    <span className="mode-title">{t.modes[item.id]}</span>
                    <span className="mode-desc">{t.modeDesc[item.id]}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="lobby-actions">
              <button type="button" className="invite-button">
                {t.invite}
              </button>
              <button type="button" className="match-start-button">
                {t.startMatch}
              </button>
            </div>
          </section>
        </div>
      )}

      {!isLobby && (
        <footer className="window-footer">
          <span className="footer-brand">rexe games</span>
          <nav className="footer-links" aria-label="Legal">
            <a href="#terms">{t.terms}</a>
            <a href="#privacy">{t.privacy}</a>
            <a href="#contact">{t.contact}</a>
          </nav>
          <span className="footer-credit">by egemenozyurek</span>
        </footer>
      )}
    </div>
  )
}

export default App
