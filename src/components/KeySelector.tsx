import { SHARP_KEYS, NATURAL_KEYS, FLAT_KEYS } from '../keys'
import type { KeyGroup } from '../keys'
import { Staff } from './Staff'
import { t } from '../i18n'
import type { Lang } from '../i18n'

interface Props {
  selectedId: string
  onSelect: (id: string) => void
  lang: Lang
}

function KeyButton({ k, selected, onSelect, lang }: { k: KeyGroup; selected: boolean; onSelect: () => void; lang: Lang }) {
  // 장조/단조 운지가 동일하므로 한 버튼에 두 이름을 함께 표시
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
  const sections: { label: string; keys: KeyGroup[] }[] = [
    { label: t('naturalKeys', lang), keys: NATURAL_KEYS },
    { label: t('sharpKeys', lang), keys: SHARP_KEYS },
    { label: t('flatKeys', lang), keys: FLAT_KEYS },
  ]
  return (
    <div className="key-selector">
      {sections.map((sec) => (
        <section key={sec.label} className="key-section">
          <h3>{sec.label}</h3>
          <div className="key-grid">
            {sec.keys.map((k) => (
              <KeyButton key={k.id} k={k} selected={k.id === selectedId} onSelect={() => onSelect(k.id)} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
