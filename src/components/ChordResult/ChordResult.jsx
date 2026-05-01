import { formatChordName } from '../../utils/formatChordName'
import styles from './ChordResult.module.css'

export function ChordResult({ notes, chords }) {
  const hasNotes = notes.length > 0
  const hasChords = chords.length > 0

  return (
    <div className={styles.panel}>
      {!hasNotes && (
        <p className={styles.empty}>Click strings and frets to identify a chord.</p>
      )}

      {hasNotes && (
        <>
          <div className={styles.notes}>
            {notes.map(n => (
              <span key={n} className={styles.note}>{n}</span>
            ))}
          </div>

          {hasChords ? (
            <div className={styles.chords}>
              <div className={styles.primary}>{formatChordName(chords[0])}</div>
              {chords.length > 1 && (
                <div className={styles.alternates}>
                  {chords.slice(1).map(c => (
                    <span key={c} className={styles.alt}>{formatChordName(c)}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noMatch}>No chord match</div>
          )}
        </>
      )}
    </div>
  )
}
