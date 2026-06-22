import { useState } from 'react'
import { GuidePage } from './components/GuidePage'
import { QuizPage } from './components/QuizPage'
import { t } from './i18n'
import type { Lang } from './i18n'

type Page = 'guide' | 'quiz'

export default function App() {
  const [lang, setLang] = useState<Lang>('ko')
  const [page, setPage] = useState<Page>('guide')

  return (
    <div className="app">
      <header className="topbar">
        <h1>{t('appTitle', lang)}</h1>
        <div className="topbar-right">
          <nav className="page-nav">
            <button
              className={`nav-btn${page === 'guide' ? ' active' : ''}`}
              type="button"
              onClick={() => setPage('guide')}
            >
              {t('guide', lang)}
            </button>
            <button
              className={`nav-btn${page === 'quiz' ? ' active' : ''}`}
              type="button"
              onClick={() => setPage('quiz')}
            >
              {t('quiz', lang)}
            </button>
          </nav>
          <button className="lang-toggle" type="button" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>
            {lang === 'ko' ? 'EN' : '한국어'}
          </button>
        </div>
      </header>

      {page === 'guide' ? <GuidePage lang={lang} /> : <QuizPage lang={lang} />}
    </div>
  )
}
