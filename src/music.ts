// 바이올린 1포지션 음악 데이터 및 유틸

export type Accidental = 'sharp' | 'flat' | 'none'

// 영어 음이름(자연음) 인덱스: C=0 ... B=6
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
export type Letter = (typeof LETTERS)[number]

// 한글 음이름(고정도법)
const KO_SYLLABLE: Record<Letter, string> = {
  C: '도', D: '레', E: '미', F: '파', G: '솔', A: '라', B: '시',
}

// pitch class(0~11, C=0) → 샵 / 플랫 스펠링
const SHARP_SPELL: { letter: Letter; acc: Accidental }[] = [
  { letter: 'C', acc: 'none' }, { letter: 'C', acc: 'sharp' },
  { letter: 'D', acc: 'none' }, { letter: 'D', acc: 'sharp' },
  { letter: 'E', acc: 'none' }, { letter: 'F', acc: 'none' },
  { letter: 'F', acc: 'sharp' }, { letter: 'G', acc: 'none' },
  { letter: 'G', acc: 'sharp' }, { letter: 'A', acc: 'none' },
  { letter: 'A', acc: 'sharp' }, { letter: 'B', acc: 'none' },
]
const FLAT_SPELL: { letter: Letter; acc: Accidental }[] = [
  { letter: 'C', acc: 'none' }, { letter: 'D', acc: 'flat' },
  { letter: 'D', acc: 'none' }, { letter: 'E', acc: 'flat' },
  { letter: 'E', acc: 'none' }, { letter: 'F', acc: 'none' },
  { letter: 'G', acc: 'flat' }, { letter: 'G', acc: 'none' },
  { letter: 'A', acc: 'flat' }, { letter: 'A', acc: 'none' },
  { letter: 'B', acc: 'flat' }, { letter: 'B', acc: 'none' },
]

const ACC_GLYPH: Record<Accidental, string> = {
  sharp: '♯', flat: '♭', none: '',
}

// 조표에 붙는 변화표 순서
const SHARP_ORDER: Letter[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLAT_ORDER: Letter[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F']

// 해당 조표가 특정 음이름(letter)에 적용하는 변화표
function keySigAcc(letter: Letter, sign: 'sharp' | 'flat' | 'none', count: number): Accidental {
  if (sign === 'sharp') return SHARP_ORDER.slice(0, count).includes(letter) ? 'sharp' : 'none'
  if (sign === 'flat') return FLAT_ORDER.slice(0, count).includes(letter) ? 'flat' : 'none'
  return 'none'
}

// 오선지 음표 앞에 실제로 그려야 할 변화표 글리프.
// 조표가 이미 적용하는 변화표는 중복 표기하지 않고, 조표와 다를 때만 그린다(필요 시 제자리표).
export function noteDisplayAcc(note: SpelledNote, sign: 'sharp' | 'flat' | 'none', count: number): string {
  const ks = keySigAcc(note.letter, sign, count)
  if (note.acc === ks) return ''
  if (note.acc === 'none' && ks !== 'none') return '♮'
  return ACC_GLYPH[note.acc]
}

export interface SpelledNote {
  letter: Letter
  acc: Accidental
  octave: number
}

// midi(예: 60=C4) + 샵/플랫 선호 → 스펠링
export function spell(midi: number, prefer: 'sharp' | 'flat'): SpelledNote {
  const pc = ((midi % 12) + 12) % 12
  const table = prefer === 'flat' ? FLAT_SPELL : SHARP_SPELL
  const { letter, acc } = table[pc]
  // 옥타브: C4=60. B#/Cb 같은 경계 변환이 없으므로 단순 계산으로 충분.
  const octave = Math.floor(midi / 12) - 1
  return { letter, acc, octave }
}

export function koName(n: SpelledNote): string {
  return KO_SYLLABLE[n.letter] + ACC_GLYPH[n.acc]
}
export function enName(n: SpelledNote): string {
  return n.letter + ACC_GLYPH[n.acc]
}

// 오선지 배치를 위한 다이어토닉 인덱스 (octave*7 + letterIndex)
export function diatonicIndex(n: SpelledNote): number {
  return n.octave * 7 + LETTERS.indexOf(n.letter)
}

// ===== 현 / 운지점 =====

export interface StringDef {
  name: string // G, D, A, E
  openMidi: number
}

// 개방현: G3=55, D4=62, A4=69, E5=76
export const STRINGS: StringDef[] = [
  { name: 'G', openMidi: 55 },
  { name: 'D', openMidi: 62 },
  { name: 'A', openMidi: 69 },
  { name: 'E', openMidi: 76 },
]

// 반음 오프셋(0~7) → 손가락 번호. 각 손가락의 낮은/높은 위치 포함.
const FINGER_BY_OFFSET = [0, 1, 1, 2, 2, 3, 3, 4]
const FINGER_NO_OPEN = [1, 1, 2, 2, 3, 3, 4]

export interface Position {
  id: number
  labelKo: string
  labelEn: string
  shift: number
  includeOpen: boolean
}

export const POSITIONS: Position[] = [
  { id: 1, labelKo: '1포지션', labelEn: '1st', shift: 0, includeOpen: true },
  { id: 2, labelKo: '2포지션', labelEn: '2nd', shift: 2, includeOpen: false },
  { id: 3, labelKo: '3포지션', labelEn: '3rd', shift: 4, includeOpen: false },
  { id: 4, labelKo: '4포지션', labelEn: '4th', shift: 6, includeOpen: false },
]

export interface FingerPoint {
  string: string
  offset: number
  finger: number
  midi: number
  pc: number
}

export function fingerPointsForPosition(pos: Position): FingerPoint[] {
  return STRINGS.flatMap((s) => {
    if (pos.includeOpen) {
      return Array.from({ length: 8 }, (_, i) => {
        const midi = s.openMidi + i
        return { string: s.name, offset: i, finger: FINGER_BY_OFFSET[i], midi, pc: ((midi % 12) + 12) % 12 }
      })
    }
    return FINGER_NO_OPEN.map((finger, i) => {
      const offset = pos.shift + 1 + i
      const midi = s.openMidi + offset
      return { string: s.name, offset, finger, midi, pc: ((midi % 12) + 12) % 12 }
    })
  })
}

// 손가락 색상 (색 + 숫자 병기)
export const FINGER_COLOR: Record<number, string> = {
  0: '#9aa0a6', // 개방
  1: '#2f6fed', // 파랑
  2: '#1faa59', // 초록
  3: '#f08c00', // 주황
  4: '#e03131', // 빨강
}
