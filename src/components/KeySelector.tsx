import { useState } from 'react'
import { SHARP_KEYS, NATURAL_KEYS, FLAT_KEYS, getKey } from '../keys'
import type { KeyGroup } from '../keys'
import { Staff } from './Staff'
import type { Lang } from '../i18n'

interface Props {
  selectedId: string
  onSelect: (id: string) => void
  lang: Lang
}

function KeyButton({ k, selected, onSelect, lang }: { k: KeyGroup; selected: boolean; onSelect: () => void; lang: Lang }) {
  const major = lang === 'ko' ? k.majorKo : k.majorEn
  const minor = lang === 'ko' ? k.minorKo : k.minorEn
  return (
    <button className={`key-btn${selected ? ' selected' : ''}`} onClick={onSelect} type="button">
      <span className="key-staff">
        <Staff width={140} height={72} sign={k.sign} count={k.count} />
      </span>
      <span className="key-names">
        <strong>{major}</strong>
        <small>{minor}</small>
      </span>
    </button>
  )
}

export function KeySelector({ selectedId, onSelect, lang }: Props) {
  const [open, setOpen] = useState(false)
  const selected = getKey(selectedId)
  const selectedLabel = lang === 'ko'
    ? `${selected.majorKo} · ${selected.minorKo}`
    : `${selected.majorEn} · ${selected.minorEn}`

  const allKeys = [...NATURAL_KEYS, ...SHARP_KEYS, ...FLAT_KEYS]

  function handleSelect(id: string) {
    onSelect(id)
    setOpen(false)
  }

  return (
    <div className="key-selector">
      <button className="key-summary" type="button" onClick={() => setOpen(!open)}>
        <span>{selectedLabel}</span>
        <span className={`key-chevron${open ? ' open' : ''}`}>&#x25BE;</span>
      </button>
      <div className={`key-list${open ? ' open' : ''}`}>
        <div className="key-grid">
          {allKeys.map((k) => (
            <KeyButton key={k.id} k={k} selected={k.id === selectedId} onSelect={() => handleSelect(k.id)} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  )
}
