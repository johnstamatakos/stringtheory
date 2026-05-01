export const STANDARD_TUNING = [40, 45, 50, 55, 59, 64] // E2 A2 D3 G3 B3 E4

const PITCH_CLASS_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

export function pitchClassName(pc) {
  return PITCH_CLASS_NAMES[pc]
}

/** Return the open-string note label for a given string index and tuning. */
export function openStringName(stringIndex, tuning = STANDARD_TUNING) {
  return PITCH_CLASS_NAMES[tuning[stringIndex] % 12]
}

/**
 * Fret → MIDI.
 * Capo raises open strings only; fretted notes are absolute from the nut.
 */
export function fretToMidi(stringIndex, fret, tuning = STANDARD_TUNING, capo = 0) {
  if (fret === null) return null
  if (fret === 0) return tuning[stringIndex] + capo
  return tuning[stringIndex] + fret
}

export function midiToPitchClass(midi) {
  return midi % 12
}

/**
 * Returns unique pitch class names in string order (low E → high e).
 * First occurrence wins for duplicates.
 */
export function fretsToNotes(frets, tuning = STANDARD_TUNING, capo = 0) {
  const seen = new Set()
  const result = []
  frets.forEach((fret, si) => {
    const midi = fretToMidi(si, fret, tuning, capo)
    if (midi !== null) {
      const pc = midiToPitchClass(midi)
      if (!seen.has(pc)) {
        seen.add(pc)
        result.push(pitchClassName(pc))
      }
    }
  })
  return result
}
