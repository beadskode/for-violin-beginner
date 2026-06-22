import { useState } from 'react'
import { KeySelector } from './components/KeySelector'
import { Fingerboard } from './components/Fingerboard'
import { Staff } from './components/Staff'
import { getKey, DEFAULT_KEY_ID, preferFor } from './keys'
import { spell, POSITIONS } from './music'
import type { FingerPoint } from './music'
import { t } from './i18n'
import type { Lang } from './i18n'

const KEY_STORAGE = 'violin.keyId'

export default function App() {
  const [lang, setLang] = useState<Lang>('ko')
  const [keyId, setKeyId] = useState<string>(() => localStorage.getItem(KEY_STORAGE) ?? DEFAULT_KEY_ID)
  const [posId, setPosId] = useState(1)
  const [picked, setPicked] = useState<FingerPoint | null>(null)

  const selectedKey = getKey(keyId)
  const prefer = preferFor(selectedKey)
  const position = POSITIONS.find((p) => p.id === posId)!

  function selectKey(id: string) {
    setKeyId(id)
    localStorage.setItem(KEY_STORAGE, id)
  }

  function selectPosition(id: number) {
    setPosId(id)
    setPicked(null)
  }

  const pickedNote = picked ? spell(picked.midi, prefer) : undefined
  const headerKey =
    lang === 'ko'
      ? `${selectedKey.majorKo} · ${selectedKey.minorKo}`
      : `${selectedKey.majorEn} · ${selectedKey.minorEn}`

  return (
    <div className="app">
      <header className="topbar">
        <h1>{t('appTitle', lang)}</h1>
        <button className="lang-toggle" type="button" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>
          {lang === 'ko' ? 'EN' : '한국어'}
        </button>
      </header>

      <div className="pos-tabs">
        {POSITIONS.map((p) => (
          <button
            key={p.id}
            className={`pos-tab${p.id === posId ? ' active' : ''}`}
            type="button"
            onClick={() => selectPosition(p.id)}
          >
            {lang === 'ko' ? p.labelKo : p.labelEn}
          </button>
        ))}
      </div>

      <div className="layout">
        <div className="col col-left">
          <h2>{t('keySection', lang)}</h2>
          <KeySelector selectedId={keyId} onSelect={selectKey} lang={lang} />
        </div>

        <div className="col col-right">
          <div className="fb-section">
            <h2>{headerKey}</h2>
            <p className="hint">{t('clickHint', lang)}</p>
            <div className="fb-wrap">
              <Fingerboard selectedKey={selectedKey} position={position} onPick={setPicked} active={picked} />
            </div>
          </div>

          <div className="staff-section">
            <h2>{t('staff', lang)}</h2>
            <div className="staff-wrap">
              <Staff width={150} height={125} vbY={-30} sign={selectedKey.sign} count={selectedKey.count} note={pickedNote} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
