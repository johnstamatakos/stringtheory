const OPEN_MIDI = [40, 45, 50, 55, 59, 64]

const PC_MAP = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7,
  'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
}

/**
 * Convert a chords-db position object to our internal frets array.
 *
 * chords-db format:  index 0 = low E, -1 = muted, 0 = open, N = relative fret
 * our format:        index 0 = low E, null = muted, 0 = open, N = absolute fret
 *
 * Absolute fret = baseFret + relativeFret - 1
 */
export function positionToFrets(position) {
  const { frets, baseFret } = position
  return frets.map(f => {
    if (f === -1) return null
    if (f === 0) return 0
    return baseFret + f - 1
  })
}

/**
 * From an array of chords-db positions, return the first one whose lowest
 * sounding string plays the root note (not an inversion / slash chord).
 * Falls back to the first position if none match.
 */
export function findPreferredVoicing(voicings, rootNote) {
  const rootPc = PC_MAP[rootNote]
  if (rootPc === undefined || voicings.length === 0) return voicings[0]

  const preferred = voicings.find(pos => {
    for (let i = 0; i < pos.frets.length; i++) {
      const f = pos.frets[i]
      if (f === -1) continue // muted — skip to next string
      const absoluteFret = f === 0 ? 0 : pos.baseFret + f - 1
      const pc = (OPEN_MIDI[i] + absoluteFret) % 12
      return pc === rootPc // lowest sounding string: must be root
    }
    return false
  })

  return preferred ?? voicings[0]
}
