import { getDiatonicChords } from '../../utils/scaleUtils'
import { formatChordName } from '../../utils/formatChordName'
import { loadChordFrets } from '../../utils/loadChordFrets'
import { SCALE_TYPES } from '../../utils/scaleUtils'
import styles from './ChordSuggestions.module.css'

export function ChordSuggestions({ scaleKey, onChordSelect, tuning, capo, className }) {
  if (!scaleKey) return null

  const suggestions = getDiatonicChords(scaleKey.root, scaleKey.type)
  if (!suggestions.length) return null

  const scaleLabel = SCALE_TYPES.find(s => s.value === scaleKey.type)?.label ?? scaleKey.type

  return (
    <div className={`${styles.panel}${className ? ` ${className}` : ''}`}>
      <h2 className={styles.heading}>
        Chords in <span className={styles.key}>{scaleKey.root} {scaleLabel}</span>
      </h2>
      <div className={styles.row}>
        {suggestions.map(({ chord, numeral }) => {
          const displayName = formatChordName(chord)
          return (
            <button
              key={chord}
              className={styles.pill}
              onClick={() => {
                const frets = loadChordFrets(chord, tuning, capo)
                if (frets) onChordSelect(frets)
              }}
            >
              <span className={styles.numeral}>{numeral}</span>
              <span className={styles.name}>{displayName}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
