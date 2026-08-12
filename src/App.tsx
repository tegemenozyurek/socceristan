import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

type Lang = 'tr' | 'en'

const copy = {
  tr: {
    langTr: 'Türkçe',
    langEn: 'İngilizce',
  },
  en: {
    langTr: 'Turkish',
    langEn: 'English',
  },
} as const

function TurkishFlag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" fill="#E30A17" />
      <circle cx="10.2" cy="12" r="5.2" fill="#fff" />
      <circle cx="12" cy="12" r="4.2" fill="#E30A17" />
      <polygon
        fill="#fff"
        points="15.2,12 17.2,12.7 16,11 17.2,9.3 15.2,10 13.8,8.5 14.2,10.5 12.2,11.5 14.2,12.5 13.8,14.5"
      />
    </svg>
  )
}

function GbFlag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" fill="#012169" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="#fff" strokeWidth="3.2" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="#C8102E" strokeWidth="1.8" />
      <path d="M12,0 V24 M0,12 H24" stroke="#fff" strokeWidth="6" />
      <path d="M12,0 V24 M0,12 H24" stroke="#C8102E" strokeWidth="3.4" />
    </svg>
  )
}

function App() {
  const [lang, setLang] = useState<Lang>('tr')
  const t = copy[lang]

  return (
    <>
      <header className="site-header">
        <img className="brand-logo" src={logo} alt="socceristan" />

        <div className="lang-switch" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === 'tr' ? 'active' : undefined}
            onClick={() => setLang('tr')}
            aria-pressed={lang === 'tr'}
            aria-label={t.langTr}
            title={t.langTr}
          >
            <TurkishFlag />
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'active' : undefined}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
            aria-label={t.langEn}
            title={t.langEn}
          >
            <GbFlag />
          </button>
        </div>
      </header>
    </>
  )
}

export default App
