import type { SpelledNote } from '../music'
import { diatonicIndex, noteDisplayAcc } from '../music'
import type { Sign } from '../keys'

// 높은음자리표 (Wikimedia GClef, 정통 음악 폰트 스타일, 원본 15.186 x 40.768)
const CLEF_PATH =
  'm12.049 3.5296c0.305 3.1263-2.019 5.6563-4.0772 7.7014-0.9349 0.897-0.155 0.148-0.6437 0.594-0.1022-0.479-0.2986-1.731-0.2802-2.11 0.1304-2.6939 2.3198-6.5875 4.2381-8.0236 0.309 0.5767 0.563 0.6231 0.763 1.8382zm0.651 16.142c-1.232-0.906-2.85-1.144-4.3336-0.885-0.1913-1.255-0.3827-2.51-0.574-3.764 2.3506-2.329 4.9066-5.0322 5.0406-8.5394 0.059-2.232-0.276-4.6714-1.678-6.4836-1.7004 0.12823-2.8995 2.156-3.8019 3.4165-1.4889 2.6705-1.1414 5.9169-0.57 8.7965-0.8094 0.952-1.9296 1.743-2.7274 2.734-2.3561 2.308-4.4085 5.43-4.0046 8.878 0.18332 3.334 2.5894 6.434 5.8702 7.227 1.2457 0.315 2.5639 0.346 3.8241 0.099 0.2199 2.25 1.0266 4.629 0.0925 6.813-0.7007 1.598-2.7875 3.004-4.3325 2.192-0.5994-0.316-0.1137-0.051-0.478-0.252 1.0698-0.257 1.9996-1.036 2.26-1.565 0.8378-1.464-0.3998-3.639-2.1554-3.358-2.262 0.046-3.1904 3.14-1.7356 4.685 1.3468 1.52 3.833 1.312 5.4301 0.318 1.8125-1.18 2.0395-3.544 1.8325-5.562-0.07-0.678-0.403-2.67-0.444-3.387 0.697-0.249 0.209-0.059 1.193-0.449 2.66-1.053 4.357-4.259 3.594-7.122-0.318-1.469-1.044-2.914-2.302-3.792zm0.561 5.757c0.214 1.991-1.053 4.321-3.079 4.96-0.136-0.795-0.172-1.011-0.2626-1.475-0.4822-2.46-0.744-4.987-1.116-7.481 1.6246-0.168 3.4576 0.543 4.0226 2.184 0.244 0.577 0.343 1.197 0.435 1.812zm-5.1486 5.196c-2.5441 0.141-4.9995-1.595-5.6343-4.081-0.749-2.153-0.5283-4.63 0.8207-6.504 1.1151-1.702 2.6065-3.105 4.0286-4.543 0.183 1.127 0.366 2.254 0.549 3.382-2.9906 0.782-5.0046 4.725-3.215 7.451 0.5324 0.764 1.9765 2.223 2.7655 1.634-1.102-0.683-2.0033-1.859-1.8095-3.227-0.0821-1.282 1.3699-2.911 2.6513-3.198 0.4384 2.869 0.9413 6.073 1.3797 8.943-0.5054 0.1-1.0211 0.143-1.536 0.143z'

// 오선지 기하: 위에서부터 F5,D5,B4,G4,E4 (다이어토닉 인덱스 38,36,34,32,30)
const TOP = 20 // F5 y좌표
const HALF = 5 // 다이어토닉 1스텝 = 5px
const LINE_IDX = [38, 36, 34, 32, 30]

function yOf(idx: number): number {
  return TOP + (38 - idx) * HALF
}

// 조표 액시던틀 위치 (다이어토닉 인덱스 순서)
const SHARP_POS = [38, 35, 39, 36, 33, 37, 34] // F#,C#,G#,D#,A#,E#,B#
const FLAT_POS = [34, 37, 33, 36, 32, 35, 31] // Bb,Eb,Ab,Db,Gb,Cb,Fb

const ACC_GAP = 9 // 조표 변화표 가로 간격
const INK = '#1a1a1a'

// 샵 (정통 음악 폰트 스타일: 긴 세로획 2개 + 위로 기운 가로획 2개)
function Sharp({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} fill="none">
      <line x1={x - 2.4} y1={y - 9} x2={x - 2.4} y2={y + 13} strokeWidth={1.3} />
      <line x1={x + 2.4} y1={y - 13} x2={x + 2.4} y2={y + 9} strokeWidth={1.3} />
      <line x1={x - 3.6} y1={y - 2} x2={x + 3.6} y2={y - 6} strokeWidth={3} />
      <line x1={x - 3.6} y1={y + 6} x2={x + 3.6} y2={y + 2} strokeWidth={3} />
    </g>
  )
}

// 플랫 (샵과 동일한 얇은 선 스타일: 긴 세로획 + 가는 보울)
function Flat({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <line x1={x - 3} y1={y - 16} x2={x - 3} y2={y + 7} />
      <path d={`M ${x - 3} ${y - 3} C ${x + 4.6} ${y - 4.8}, ${x + 4.6} ${y + 5.6}, ${x - 3} ${y + 6.6}`} />
    </g>
  )
}

interface Props {
  width: number
  height: number
  sign?: Sign
  count?: number
  note?: SpelledNote
  vbY?: number // viewBox 상단 y (스템 클리핑 방지용)
}

export function Staff({ width, height, sign = 'none', count = 0, note, vbY = 0 }: Props) {
  const lineX0 = 4
  const lineX1 = width - 4
  const accStartX = 42
  const noteAcc = note ? noteDisplayAcc(note, sign, count) : ''

  // 조표 액시던틀
  const positions = sign === 'flat' ? FLAT_POS : SHARP_POS
  const accs = sign === 'none' ? [] : positions.slice(0, count)
  const sigWidth = accs.length * ACC_GAP

  // 음표 위치: 조표 이후 영역의 가로 가운데에서 조표 쪽으로 6px 당김
  const noteX = (accStartX + sigWidth + lineX1) / 2 - 6

  const ledgers: number[] = []
  if (note) {
    const idx = diatonicIndex(note)
    if (idx > 38) for (let e = 40; e <= idx; e += 2) ledgers.push(e)
    if (idx < 30) for (let e = 28; e >= idx; e -= 2) ledgers.push(e)
  }

  return (
    <svg viewBox={`0 ${vbY} ${width} ${height}`} width="100%" height="100%" role="img">
      {/* 오선 5줄 */}
      {LINE_IDX.map((idx) => (
        <line key={idx} x1={lineX0} y1={yOf(idx)} x2={lineX1} y2={yOf(idx)} stroke="#333" strokeWidth={1} />
      ))}

      {/* 높은음자리표 (정통 음악 폰트 스타일) */}
      <path d={CLEF_PATH} transform="translate(10, 8) scale(1.47)" fill="#1a1a1a" />


      {/* 조표 */}
      {accs.map((diatonic, i) =>
        sign === 'flat' ? (
          <Flat key={diatonic} x={accStartX + i * ACC_GAP} y={yOf(diatonic)} />
        ) : (
          <Sharp key={diatonic} x={accStartX + i * ACC_GAP} y={yOf(diatonic)} />
        )
      )}

      {/* 덧줄 */}
      {ledgers.map((e) => (
        <line key={`l${e}`} x1={noteX - 9} y1={yOf(e)} x2={noteX + 9} y2={yOf(e)} stroke="#333" strokeWidth={1} />
      ))}

      {/* 음표 */}
      {note && (
        <g>
          {noteAcc && (
            <text x={noteX - 13} y={yOf(diatonicIndex(note)) + 4} fontSize={15} textAnchor="middle">
              {noteAcc}
            </text>
          )}
          <ellipse cx={noteX} cy={yOf(diatonicIndex(note))} rx={5.5} ry={4} fill="#111" transform={`rotate(-20 ${noteX} ${yOf(diatonicIndex(note))})`} />
          <line
            x1={noteX + 5}
            y1={yOf(diatonicIndex(note)) - 1}
            x2={noteX + 5}
            y2={yOf(diatonicIndex(note)) - 32}
            stroke="#111"
            strokeWidth={1.4}
          />
        </g>
      )}
    </svg>
  )
}
