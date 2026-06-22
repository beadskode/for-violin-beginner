import { useState, useCallback, useEffect, useRef } from 'react'
import { KeySelector } from './KeySelector'
import { Fingerboard } from './Fingerboard'
import type { FeedbackState } from './Fingerboard'
import { Staff } from './Staff'
import { getKey, DEFAULT_KEY_ID, preferFor } from '../keys'
import { spell, fingerPointsForPosition, POSITIONS } from '../music'
import type { FingerPoint } from '../music'
import { t } from '../i18n'
import type { Lang } from '../i18n'

const KEY_STORAGE = 'violin.keyId'

function pickRandom(points: FingerPoint[], scalePcs: number[], prevMidi?: number): FingerPoint {
  const candidates = points.filter((fp) => scalePcs.includes(fp.pc) && fp.midi !== prevMidi)
  if (candidates.length === 0) {
    const all = points.filter((fp) => scalePcs.includes(fp.pc))
    return all[Math.floor(Math.random() * all.length)]
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function QuizPage({ lang }: { lang: Lang }) {
  const [keyId, setKeyId] = useState<string>(() => localStorage.getItem(KEY_STORAGE) ?? DEFAULT_KEY_ID)
  const [posId, setPosId] = useState(1)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedKey = getKey(keyId)
  const prefer = preferFor(selectedKey)
  const position = POSITIONS.find((p) => p.id === posId)!
  const points = fingerPointsForPosition(position)

  const [target, setTarget] = useState<FingerPoint>(() => pickRandom(points, selectedKey.scalePcs))

  const nextQuestion = useCallback((prevMidi?: number) => {
    const pts = fingerPointsForPosition(position)
    setTarget(pickRandom(pts, selectedKey.scalePcs, prevMidi))
    setFeedback(null)
  }, [position, selectedKey])

  function selectKey(id: string) {
    setKeyId(id)
    localStorage.setItem(KEY_STORAGE, id)
  }

  function selectPosition(id: number) {
    setPosId(id)
  }

  useEffect(() => {
    nextQuestion()
    setScore({ correct: 0, total: 0 })
  }, [keyId, posId])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function handlePick(fp: FingerPoint) {
    if (feedback) return

    const isCorrect = fp.pc === target.pc
    const fb: FeedbackState = { picked: fp, answer: target, result: isCorrect ? 'correct' : 'wrong' }
    setFeedback(fb)
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))

    timerRef.current = setTimeout(() => {
      nextQuestion(target.midi)
    }, isCorrect ? 800 : 1500)
  }

  function handleReset() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setScore({ correct: 0, total: 0 })
    nextQuestion()
  }

  const targetNote = spell(target.midi, prefer)
  const headerKey =
    lang === 'ko'
      ? `${selectedKey.majorKo} · ${selectedKey.minorKo}`
      : `${selectedKey.majorEn} · ${selectedKey.minorEn}`

  return (
    <>
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
          <div className="quiz-header">
            <div className="quiz-info">
              <h2>{headerKey}</h2>
              <p className="hint">{t('quizHint', lang)}</p>
            </div>
            <div className="quiz-score">
              <span className="score-label">{t('score', lang)}</span>
              <span className="score-value">{score.correct} / {score.total}</span>
              <button className="reset-btn" type="button" onClick={handleReset}>{t('reset', lang)}</button>
            </div>
          </div>

          {feedback && (
            <div className={`quiz-feedback ${feedback.result}`}>
              {feedback.result === 'correct' ? t('correct', lang) : t('wrong', lang)}
            </div>
          )}

          <div className="quiz-body">
            <div className="quiz-staff-wrap">
              <Staff width={150} height={125} vbY={-30} sign={selectedKey.sign} count={selectedKey.count} note={targetNote} />
            </div>
            <div className="fb-wrap">
              <Fingerboard
                selectedKey={selectedKey}
                position={position}
                onPick={handlePick}
                active={null}
                feedback={feedback}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
