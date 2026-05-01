import { useState } from 'react'
import { STANDARD_TUNING, pitchClassName } from '../../utils/midiToNotes'
import styles from './TuningPanel.module.css'

export const PRESET_TUNINGS = [
  { name: 'Standard',    midi: [40, 45, 50, 55, 59, 64] },
  { name: 'Drop D',      midi: [38, 45, 50, 55, 59, 64] },
  { name: 'Open G',      midi: [38, 43, 50, 55, 59, 62] },
  { name: 'Open D',      midi: [38, 45, 50, 54, 57, 62] },
  { name: 'DADGAD',      midi: [38, 45, 50, 55, 57, 62] },
  { name: '½ Step ↓',    midi: [39, 44, 49, 54, 58, 63] },
  { name: 'Full Step ↓', midi: [38, 43, 48, 53, 57, 62] },
]

// Note options for custom pickers: E1 (28) to G5 (79)
const NOTE_OPTS = []
for (let m = 28; m <= 79; m++) {
  const octave = Math.floor(m / 12) - 1
  NOTE_OPTS.push({ midi: m, label: `${pitchClassName(m % 12)}${octave}` })
}

// String labels in display order (high e → low E)
const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']
// State indices in display order
const DISPLAY_ORDER = [5, 4, 3, 2, 1, 0]

function isSameTuning(a, b) {
  return a.every((v, i) => v === b[i])
}

export function TuningPanel({ tuning, onTuningChange }) {
  const [showCustom, setShowCustom] = useState(false)

  const activePreset = PRESET_TUNINGS.find(p => isSameTuning(p.midi, tuning))

  const handlePreset = (preset) => {
    setShowCustom(false)
    onTuningChange(preset.midi)
  }

  const handleStringChange = (stateIndex, midi) => {
    const next = [...tuning]
    next[stateIndex] = midi
    onTuningChange(next)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <span className={styles.label}>Tuning</span>
        <div className={styles.presets}>
          {PRESET_TUNINGS.map(p => (
            <button
              key={p.name}
              className={`${styles.btn} ${activePreset?.name === p.name && !showCustom ? styles.active : ''}`}
              onClick={() => handlePreset(p)}
            >
              {p.name}
            </button>
          ))}
          <button
            className={`${styles.btn} ${showCustom ? styles.active : ''}`}
            onClick={() => setShowCustom(v => !v)}
          >
            Custom
          </button>
        </div>
      </div>

      {showCustom && (
        <div className={styles.customRow}>
          {DISPLAY_ORDER.map((si, di) => (
            <div key={si} className={styles.stringPicker}>
              <span className={styles.stringLabel}>{STRING_LABELS[di]}</span>
              <select
                className={styles.select}
                value={tuning[si]}
                onChange={e => handleStringChange(si, Number(e.target.value))}
              >
                {NOTE_OPTS.map(o => (
                  <option key={o.midi} value={o.midi}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
