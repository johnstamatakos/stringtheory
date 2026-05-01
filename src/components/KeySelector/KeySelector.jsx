import { SCALE_TYPES } from '../../utils/scaleUtils'
import styles from './KeySelector.module.css'

const ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

/**
 * scaleKey: { root, type } | null
 * onScaleKeyChange: (key | null) => void
 */
export function KeySelector({ scaleKey, onScaleKeyChange }) {
  const root = scaleKey?.root ?? null
  const type = scaleKey?.type ?? SCALE_TYPES[0].value

  const handleRoot = (r) => {
    if (root === r) {
      onScaleKeyChange(null) // deselect
    } else {
      onScaleKeyChange({ root: r, type })
    }
  }

  const handleType = (t) => {
    if (!root) return
    onScaleKeyChange({ root, type: t })
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Scale / Key</h2>

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

      <div className={styles.row}>
        {SCALE_TYPES.map(s => (
          <button
            key={s.value}
            className={`${styles.btn} ${styles.typeBtn} ${type === s.value && root ? styles.active : ''}`}
            onClick={() => handleType(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {scaleKey && (
        <div className={styles.selected}>
          {scaleKey.root} {SCALE_TYPES.find(s => s.value === scaleKey.type)?.label}
        </div>
      )}
    </div>
  )
}
