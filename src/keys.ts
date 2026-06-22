// 조(Key) 데이터 — 운지(스케일 구성음)가 동일한 관계조(장조+나란한 단조)는
// 하나의 그룹(버튼)으로 병합한다.

export type Sign = 'sharp' | 'flat' | 'none'

const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11]

function majorScale(tonicPc: number): number[] {
  return MAJOR_STEPS.map((s) => (tonicPc + s) % 12)
}

export interface KeyGroup {
  id: string
  sign: Sign
  count: number // 조표 개수
  tonicPc: number // 장조 으뜸음 (스펠링/스케일 기준)
  scalePcs: number[] // 스케일 구성음 (장조=나란한 단조 동일)
  majorKo: string
  majorEn: string
  minorKo: string
  minorEn: string
}

interface Seed {
  sign: Sign
  count: number
  tonicPc: number
  majorKo: string
  majorEn: string
  minorKo: string
  minorEn: string
}

// 조표 기준 정렬: 샵 조 / 다장조 / 플랫 조
const SEEDS: Seed[] = [
  // 샵 조
  { sign: 'sharp', count: 1, tonicPc: 7, majorKo: '사장조', majorEn: 'G Major', minorKo: '마단조', minorEn: 'E minor' },
  { sign: 'sharp', count: 2, tonicPc: 2, majorKo: '라장조', majorEn: 'D Major', minorKo: '나단조', minorEn: 'B minor' },
  { sign: 'sharp', count: 3, tonicPc: 9, majorKo: '가장조', majorEn: 'A Major', minorKo: '올림바단조', minorEn: 'F♯ minor' },
  { sign: 'sharp', count: 4, tonicPc: 4, majorKo: '마장조', majorEn: 'E Major', minorKo: '올림다단조', minorEn: 'C♯ minor' },
  { sign: 'sharp', count: 5, tonicPc: 11, majorKo: '나장조', majorEn: 'B Major', minorKo: '올림사단조', minorEn: 'G♯ minor' },
  // 다장조(조표 없음)
  { sign: 'none', count: 0, tonicPc: 0, majorKo: '다장조', majorEn: 'C Major', minorKo: '가단조', minorEn: 'A minor' },
  // 플랫 조
  { sign: 'flat', count: 1, tonicPc: 5, majorKo: '바장조', majorEn: 'F Major', minorKo: '라단조', minorEn: 'D minor' },
  { sign: 'flat', count: 2, tonicPc: 10, majorKo: '내림나장조', majorEn: 'B♭ Major', minorKo: '사단조', minorEn: 'G minor' },
  { sign: 'flat', count: 3, tonicPc: 3, majorKo: '내림마장조', majorEn: 'E♭ Major', minorKo: '다단조', minorEn: 'C minor' },
  { sign: 'flat', count: 4, tonicPc: 8, majorKo: '내림가장조', majorEn: 'A♭ Major', minorKo: '바단조', minorEn: 'F minor' },
]

const KEY_GROUPS: KeyGroup[] = SEEDS.map((s) => ({
  id: `${s.sign}${s.count}`,
  sign: s.sign,
  count: s.count,
  tonicPc: s.tonicPc,
  scalePcs: majorScale(s.tonicPc),
  majorKo: s.majorKo,
  majorEn: s.majorEn,
  minorKo: s.minorKo,
  minorEn: s.minorEn,
}))

export const DEFAULT_KEY_ID = 'none0'

export function getKey(id: string): KeyGroup {
  return KEY_GROUPS.find((k) => k.id === id) ?? KEY_GROUPS.find((k) => k.id === DEFAULT_KEY_ID)!
}

export const SHARP_KEYS = KEY_GROUPS.filter((k) => k.sign === 'sharp')
export const NATURAL_KEYS = KEY_GROUPS.filter((k) => k.sign === 'none')
export const FLAT_KEYS = KEY_GROUPS.filter((k) => k.sign === 'flat')

// 음이름 스펠링 선호 (플랫 조는 플랫, 그 외는 샵)
export function preferFor(key: KeyGroup): 'sharp' | 'flat' {
  return key.sign === 'flat' ? 'flat' : 'sharp'
}
