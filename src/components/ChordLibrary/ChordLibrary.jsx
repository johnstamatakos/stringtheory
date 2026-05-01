import { useState, useEffect } from 'react'
import { loadChordFrets } from '../../utils/loadChordFrets'
import styles from './ChordLibrary.module.css'

const ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

const QUALITIES = [
  { label: 'Major',  suffix: ''     },
  { label: 'Minor',  suffix: 'm'    },
  { label: '7',      suffix: '7'    },
  { label: 'Maj7',   suffix: 'maj7' },
  { label: 'm7',     suffix: 'm7'   },
  { label: 'Sus2',   suffix: 'sus2' },
  { label: 'Sus4',   suffix: 'sus4' },
  { label: 'Dim',    suffix: 'dim'  },
  { label: 'Aug',    suffix: 'aug'  },
  { label: 'Add9',   suffix: 'add9' },
]

export function ChordLibrary({ onChordSelect, tuning, capo, clearSignal }) {
  const [root, setRoot] = useState(null)
  const [quality, setQuality] = useState(QUALITIES[0])

  useEffect(() => {
    if (!clearSignal) return
    setRoot(null)
    setQuality(QUALITIES[0])
  }, [clearSignal])

  // Load chord onto fretboard whenever root, quality, tuning, or capo changes
  useEffect(() => {
    if (!root) {
      onChordSelect(Array(6).fill(null))
      return
    }
    const frets = loadChordFrets(root + quality.suffix, tuning, capo)
    if (frets) onChordSelect(frets)
  }, [root, quality, tuning, capo])

  const handleRoot = (r) => {
    setRoot(prev => prev === r ? null : r)
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Chord Library</h2>

      <div className={styles.group}>
        <div className={styles.row}>
          {ROOTS.map(r => (
            <button
              key={r}
              className={`${styles.btn} ${styles.rootBtn} ${root === r ? styles.active : ''}`}
              onClick={() => handleRoot(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.row}>
          {QUALITIES.map(q => (
            <button
              key={q.suffix}
              className={`${styles.btn} ${styles.qualityBtn} ${quality.suffix === q.suffix ? styles.active : ''}`}
              onClick={() => setQuality(q)}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {root && (
        <div className={styles.selected}>
          {root}{quality.label !== 'Major' ? quality.label : ''}
        </div>
      )}
    </div>
  )
}
