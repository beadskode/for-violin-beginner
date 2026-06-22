import { fingerPointsForPosition, FINGER_COLOR, STRINGS, spell, koName, enName } from '../music'
import type { FingerPoint, Position } from '../music'
import type { KeyGroup } from '../keys'
import { preferFor } from '../keys'
import { useMemo } from 'react'

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

function stringIndex(name: string): number {
  return STRINGS.findIndex((s) => s.name === name)
}

export interface FeedbackState {
  picked: FingerPoint
  answer: FingerPoint
  result: 'correct' | 'wrong'
}

interface Props {
  selectedKey: KeyGroup
  position: Position
  onPick: (fp: FingerPoint) => void
  active: FingerPoint | null
  feedback?: FeedbackState | null
}

export function Fingerboard({ selectedKey, position, onPick, active, feedback }: Props) {
  const prefer = preferFor(selectedKey)
  const points = useMemo(() => fingerPointsForPosition(position), [position])

  const offsets: number[] = []
  for (const fp of points) {
    if (fp.string === 'G') offsets.push(fp.offset)
  }
  const minOffset = Math.min(...offsets)
  const maxOffset = Math.max(...offsets)
  const range = maxOffset - minOffset || 1

  function offsetY(offset: number): number {
    return NUT_Y + ((offset - minOffset) / range) * (BOTTOM_Y - NUT_Y)
  }

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" role="img" aria-label="fingerboard">
      <rect x={PAD_X - 18} y={NUT_Y - 6} width={VB_W - (PAD_X - 18) * 2} height={BOTTOM_Y - NUT_Y + 12} rx={8} fill="#3a2a1e" />
      {position.includeOpen && (
        <rect x={PAD_X - 18} y={NUT_Y - 12} width={VB_W - (PAD_X - 18) * 2} height={8} rx={2} fill="#e8ded3" />
      )}

      {STRINGS.map((s, i) => (
        <line key={s.name} x1={stringX(i)} y1={NUT_Y - 10} x2={stringX(i)} y2={BOTTOM_Y} stroke="#cbb89a" strokeWidth={1 + i * 0.4} />
      ))}

      {points.map((fp) => {
        const cx = stringX(stringIndex(fp.string))
        const cy = offsetY(fp.offset)
        const inScale = selectedKey.scalePcs.includes(fp.pc)
        const sp = spell(fp.midi, prefer)
        const color = FINGER_COLOR[fp.finger]
        const isPlaying = active?.string === fp.string && active?.offset === fp.offset

        const isFbPicked = feedback && feedback.picked.string === fp.string && feedback.picked.offset === fp.offset
        const isFbAnswer = feedback && feedback.result === 'wrong' && feedback.answer.string === fp.string && feedback.answer.offset === fp.offset
        let fill = isPlaying ? color : '#fff'
        let strokeColor = color
        if (isFbPicked) {
          fill = feedback.result === 'correct' ? '#16a34a' : '#dc2626'
          strokeColor = fill
        } else if (isFbAnswer) {
          fill = '#16a34a'
          strokeColor = '#16a34a'
        }
        const textFill = (isPlaying || isFbPicked || isFbAnswer) ? '#fff' : '#222'

        return (
          <g
            key={`${fp.string}-${fp.offset}`}
            opacity={inScale ? 1 : 0.22}
            style={{ cursor: inScale && !feedback ? 'pointer' : 'default' }}
            onClick={inScale && !feedback ? () => onPick(fp) : undefined}
          >
            <circle cx={cx} cy={cy} r={R} fill={fill} stroke={strokeColor} strokeWidth={3} />
            <circle cx={cx} cy={cy - R + 6} r={7} fill={color} />
            <text x={cx} y={cy - R + 9} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">
              {fp.finger}
            </text>
            <text x={cx} y={cy + 3} textAnchor="middle" fontSize={16} fontWeight={700} fill={textFill}>
              {koName(sp)}
            </text>
            <text x={cx} y={cy + 15} textAnchor="middle" fontSize={9} fill={textFill === '#fff' ? '#eee' : '#777'}>
              {enName(sp)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
