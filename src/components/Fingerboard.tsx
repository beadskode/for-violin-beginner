import { FINGER_POINTS, FINGER_COLOR, STRINGS, spell, koName, enName } from '../music'
import type { FingerPoint } from '../music'
import type { KeyGroup } from '../keys'
import { preferFor } from '../keys'

const VB_W = 320
const VB_H = 480
const NUT_Y = 36
const BOTTOM_Y = 456
const PAD_X = 40
const R = 23

function stringX(i: number): number {
  const span = (VB_W - PAD_X * 2) / (STRINGS.length - 1)
  return PAD_X + i * span
}
function offsetY(offset: number): number {
  return NUT_Y + (offset / 7) * (BOTTOM_Y - NUT_Y)
}

interface Props {
  selectedKey: KeyGroup
  onPick: (fp: FingerPoint) => void
  active: FingerPoint | null
}

export function Fingerboard({ selectedKey, onPick, active }: Props) {
  const prefer = preferFor(selectedKey)
  const stringIndex = (name: string) => STRINGS.findIndex((s) => s.name === name)

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" role="img" aria-label="fingerboard">
      {/* 지판 배경 */}
      <rect x={PAD_X - 18} y={NUT_Y - 6} width={VB_W - (PAD_X - 18) * 2} height={BOTTOM_Y - NUT_Y + 12} rx={8} fill="#3a2a1e" />
      {/* 너트 */}
      <rect x={PAD_X - 18} y={NUT_Y - 12} width={VB_W - (PAD_X - 18) * 2} height={8} rx={2} fill="#e8ded3" />

      {/* 현 */}
      {STRINGS.map((s, i) => (
        <line key={s.name} x1={stringX(i)} y1={NUT_Y - 10} x2={stringX(i)} y2={BOTTOM_Y} stroke="#cbb89a" strokeWidth={1 + i * 0.4} />
      ))}
      {/* 운지점 */}
      {FINGER_POINTS.map((fp) => {
        const cx = stringX(stringIndex(fp.string))
        const cy = offsetY(fp.offset)
        const inScale = selectedKey.scalePcs.includes(fp.pc)
        const sp = spell(fp.midi, prefer)
        const color = FINGER_COLOR[fp.finger]
        const isPlaying = active?.string === fp.string && active?.offset === fp.offset
        return (
          <g
            key={`${fp.string}-${fp.offset}`}
            opacity={inScale ? 1 : 0.22}
            style={{ cursor: inScale ? 'pointer' : 'default' }}
            onClick={inScale ? () => onPick(fp) : undefined}
          >
            <circle cx={cx} cy={cy} r={R} fill={isPlaying ? color : '#fff'} stroke={color} strokeWidth={3} />
            {/* 손가락 번호 배지 */}
            <circle cx={cx} cy={cy - R + 6} r={7} fill={color} />
            <text x={cx} y={cy - R + 9} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">
              {fp.finger}
            </text>
            {/* 한글 음이름 */}
            <text x={cx} y={cy + 3} textAnchor="middle" fontSize={16} fontWeight={700} fill={isPlaying ? '#fff' : '#222'}>
              {koName(sp)}
            </text>
            {/* 영어 음이름 */}
            <text x={cx} y={cy + 15} textAnchor="middle" fontSize={9} fill={isPlaying ? '#fff' : '#777'}>
              {enName(sp)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
