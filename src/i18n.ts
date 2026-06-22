export type Lang = 'ko' | 'en'

const STR = {
  appTitle: { ko: 'Vi-ginner', en: 'Vi-ginner' },
  position: { ko: '포지션', en: 'Position' },
  keySection: { ko: '조 선택', en: 'Key' },
  sharpKeys: { ko: '샵 (♯) 조', en: 'Sharp keys' },
  naturalKeys: { ko: '다장조 / 가단조', en: 'No accidentals' },
  flatKeys: { ko: '플랫 (♭) 조', en: 'Flat keys' },
  fingerboard: { ko: '지판', en: 'Fingerboard' },
  staff: { ko: '오선지', en: 'Staff' },
  clickHint: { ko: '운지점을 누르면 아래 오선지에 음이 표시됩니다.', en: 'Tap a note to show it on the staff.' },
  guide: { ko: '가이드', en: 'Guide' },
  quiz: { ko: '퀴즈', en: 'Quiz' },
  quizHint: { ko: '오선지의 음을 지판에서 찾아 누르세요.', en: 'Find the note on the fingerboard.' },
  score: { ko: '점수', en: 'Score' },
  reset: { ko: '초기화', en: 'Reset' },
  correct: { ko: '정답!', en: 'Correct!' },
  wrong: { ko: '오답', en: 'Wrong' },
} as const

export function t(key: keyof typeof STR, lang: Lang): string {
  return STR[key][lang]
}
