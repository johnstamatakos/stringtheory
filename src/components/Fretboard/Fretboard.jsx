import { useCallback } from 'react'
import { openStringName, STANDARD_TUNING } from '../../utils/midiToNotes'
import styles from './Fretboard.module.css'

const NUM_FRETS = 12
const FRET_MARKERS = new Set([3, 5, 7, 9, 12])
const DOUBLE_DOT = new Set([12])
const HIGHLIGHT_FRETS = new Set([3, 5, 7, 9])
const DISPLAY_ORDER = [5, 4, 3, 2, 1, 0] // high e → low E

// Thickness class for each display row (0=high e, 5=low E)
const THICKNESS = ['thickness0', 'thickness1', 'thickness2', 'thickness3', 'thickness4', 'thickness5']

export function Fretboard({ frets, onFretsChange, tuning = STANDARD_TUNING, capo = 0, scalePCs = [], scaleRootPC = null }) {
  const handleNutClick = useCallback((si) => {
    const next = [...frets]
    next[si] = next[si] === null ? 0 : null
    onFretsChange(next)
  }, [frets, onFretsChange])

  const handleFretClick = useCallback((si, fret) => {
    const next = [...frets]
    next[si] = next[si] === fret ? null : fret
    onFretsChange(next)
  }, [frets, onFretsChange])

  const hasScale = scalePCs.length > 0

  return (
    <div className={styles.wrapper}>
      {/* String name labels */}
      <div className={styles.stringLabels}>
        <div className={styles.labelSpacer} />
        {DISPLAY_ORDER.map(si => (
          <div key={si} className={styles.stringLabel}>
            {openStringName(si, tuning)}
          </div>
        ))}
      </div>

      {/* Nut column */}
      <div className={styles.nutColumn}>
        <div className={styles.labelSpacer} />
        {DISPLAY_ORDER.map(si => {
          const state = frets[si]
          const openPC = (tuning[si] + capo) % 12
          const openInScale = hasScale && scalePCs.includes(openPC)
          const openIsRoot = openPC === scaleRootPC
          return (
            <button
              key={si}
              className={`${styles.nutCell} ${state === null ? styles.muted : state === 0 ? styles.open : ''}`}
              onClick={() => handleNutClick(si)}
              title={state === null ? 'Muted — click to open' : 'Open — click to mute'}
            >
              {state === null ? '✕' : '○'}
              {state === 0 && openInScale && (
                <span className={`${styles.nutScaleDot} ${openIsRoot ? styles.rootDot : ''}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Fret grid */}
      <div className={styles.grid}>
        {/* Fret number headers */}
        <div className={styles.fretNumbers}>
          {Array.from({ length: NUM_FRETS }, (_, f) => (
            <div key={f + 1} className={styles.fretLabel}>
              {f + 1}
              {FRET_MARKERS.has(f + 1) && (
                <span className={`${styles.marker} ${DOUBLE_DOT.has(f + 1) ? styles.double : ''}`}>
                  {DOUBLE_DOT.has(f + 1) ? '●●' : '●'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Capo bar */}
        {capo > 0 && (
          <div
            className={styles.capoBar}
            style={{ left: `${((capo - 1) / NUM_FRETS) * 100}%` }}
            title={`Capo ${capo}`}
          />
        )}

        {/* String rows */}
        {DISPLAY_ORDER.map((si, di) => (
          <div key={si} className={`${styles.stringRow} ${styles[THICKNESS[di]]}`}>
            <div className={styles.stringLine} />
            {Array.from({ length: NUM_FRETS }, (_, f) => {
              const fretNum = f + 1
              const isActive = frets[si] === fretNum
              const isBehindCapo = capo > 0 && fretNum <= capo
              const fretPC = (tuning[si] + fretNum) % 12
              const inScale = hasScale && scalePCs.includes(fretPC)
              const isRoot = inScale && fretPC === scaleRootPC

              return (
                <button
                  key={fretNum}
                  className={[
                    styles.fretCell,
                    isActive ? styles.active : '',
                    isBehindCapo ? styles.behindCapo : '',
                    HIGHLIGHT_FRETS.has(fretNum) ? styles.markerCol : '',
                  ].join(' ')}
                  onClick={isBehindCapo ? undefined : () => handleFretClick(si, fretNum)}
                  disabled={isBehindCapo}
                  aria-label={`String ${openStringName(si, tuning)} fret ${fretNum}`}
                >
                  {inScale && (
                    <span className={`${styles.scaleDot} ${isRoot ? styles.rootDot : ''}`} />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
