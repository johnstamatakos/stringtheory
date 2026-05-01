import { lookupVoicings } from './lookupVoicings'
import { positionToFrets } from './positionToFrets'
import { transposeVoicingToTuning, isStandardTuning } from './transposeVoicing'
import { STANDARD_TUNING } from './midiToNotes'

// Chords where chords-db voicing[0] has a non-root note on the low E string
const MUTE_LOW_E = new Set(['B', 'Bm', 'Bmaj7', 'Bm7', 'Bsus2', 'Bsus4'])

// Preferred enharmonic spelling per pitch class — matches ROOT_MAP keys in lookupVoicings
const PC_TO_NOTE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const NOTE_TO_PC = {
  'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,
  'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11,
}

/**
 * Transpose just the root of a chord name down by `semitones`.
 * e.g. transposeRootDown('F#m7', 2) → 'Em7'
 */
function transposeRootDown(chordName, semitones) {
  const m = chordName.match(/^([A-G][#b]?)(.*)$/)
  if (!m) return chordName
  const pc = NOTE_TO_PC[m[1]]
  if (pc === undefined) return chordName
  return PC_TO_NOTE[((pc - semitones) % 12 + 12) % 12] + m[2]
}

/**
 * Look up the first voicing for a chord and convert to our internal frets format.
 *
 * When capo > 0: looks up the chord transposed down by capo semitones (e.g. D with
 * capo 2 → look up C), then shifts all fretted positions up by capo so they land
 * above the capo bar.  Open strings (0) stay open — the capo raises their pitch.
 *
 * Also applies low-E muting overrides and alternate-tuning transposition.
 * Returns null if no voicing found.
 */
export function loadChordFrets(chordName, tuning = STANDARD_TUNING, capo = 0) {
  const lookupName = capo > 0 ? transposeRootDown(chordName, capo) : chordName
  const voicings = lookupVoicings(lookupName)
  if (!voicings.length) return null

  let frets = positionToFrets(voicings[0])

  if (MUTE_LOW_E.has(chordName)) {
    frets = [null, ...frets.slice(1)]
  }

  if (capo > 0) {
    // Shift fretted positions above the capo; open strings stay open
    frets = frets.map(f => {
      if (f === null || f === 0) return f
      const shifted = f + capo
      return shifted > 15 ? null : shifted
    })
  }

  if (!isStandardTuning(tuning)) {
    frets = transposeVoicingToTuning(frets, tuning)
  }

  return frets
}
