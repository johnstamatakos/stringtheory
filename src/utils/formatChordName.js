/**
 * Tonal v6 uses 'M' as the major qualifier in chord names:
 *   "DM"     → "D"      (bare major triad)
 *   "CMadd9" → "Cadd9"  (major add9 — M precedes a lowercase modifier)
 * Strip both forms. Leave minor ('m'), maj7, etc. untouched.
 */
export function formatChordName(chord) {
  if (!chord) return ''
  // "CMadd9" → "Cadd9"  (M directly before a lowercase letter)
  chord = chord.replace(/^([A-G][#b]?)M([a-z])/, '$1$2')
  // "DM" → "D"  (bare trailing M)
  chord = chord.replace(/^([A-G][#b]?)M$/, '$1')
  return chord
}
