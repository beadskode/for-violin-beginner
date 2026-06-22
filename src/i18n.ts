export type Lang = 'ko' | 'en'

export const STR = {
  appTitle: { ko: '바이올린 1포지션 운지 안내', en: 'Violin 1st Position Guide' },
  keySection: { ko: '조 선택', en: 'Key' },
  sharpKeys: { ko: '샵 (♯) 조', en: 'Sharp keys' },
  naturalKeys: { ko: '다장조 / 가단조', en: 'No accidentals' },
  flatKeys: { ko: '플랫 (♭) 조', en: 'Flat keys' },
  fingerboard: { ko: '지판', en: 'Fingerboard' },
  staff: { ko: '오선지', en: 'Staff' },
  clickHint: { ko: '운지점을 누르면 아래 오선지에 음이 표시됩니다.', en: 'Tap a note to show it on the staff.' },
} as const

export function t(key: keyof typeof STR, lang: Lang): string {
  return STR[key][lang]
}
