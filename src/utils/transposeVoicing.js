import { STANDARD_TUNING } from './midiToNotes'

/**
 * Given frets computed for standard tuning, return equivalent frets for
 * targetTuning that produce the exact same MIDI notes on each string.
 *
 * If a string can't reach the target note (fret < 0 or > 15), it is muted.
 */
export function transposeVoicingToTuning(standardFrets, targetTuning) {
  return standardFrets.map((fret, si) => {
    if (fret === null) return null
    const targetMidi = fret === 0 ? STANDARD_TUNING[si] : STANDARD_TUNING[si] + fret
    const newFret = targetMidi - targetTuning[si]
    if (newFret < 0 || newFret > 15) return null
    return newFret
  })
}

export function isStandardTuning(tuning) {
  return tuning.every((v, i) => v === STANDARD_TUNING[i])
}
