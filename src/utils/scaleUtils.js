import { Scale, Key } from 'tonal'

// Pitch class map — handles both sharp and flat spellings
const PC_MAP = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4, 'F': 5, 'E#': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11,
}

export const SCALE_TYPES = [
  { label: 'Major',       value: 'major'             },
  { label: 'Minor',       value: 'minor'             },
  { label: 'Pentatonic',  value: 'major pentatonic'  },
  { label: 'Min Pent',    value: 'minor pentatonic'  },
  { label: 'Blues',       value: 'blues'             },
  { label: 'Dorian',      value: 'dorian'            },
  { label: 'Mixolydian',  value: 'mixolydian'        },
]

/**
 * Returns { pcs: number[], rootPc: number } for a given root + scale type.
 * pcs is an array of pitch classes (0–11) in the scale.
 */
export function getScalePCs(root, scaleType) {
  const scale = Scale.get(`${root} ${scaleType}`)
  if (!scale.notes || scale.notes.length === 0) return { pcs: [], rootPc: null }

  const pcs = scale.notes
    .map(n => PC_MAP[n.replace(/[0-9]/g, '')])
    .filter(pc => pc !== undefined)

  return { pcs, rootPc: PC_MAP[root] ?? null }
}

const MAJOR_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
const MINOR_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']

/**
 * Returns diatonic chords for a key as [{ chord, numeral }].
 * chord uses Tonal's chord name format (e.g. 'CM', 'Dm').
 */
export function getDiatonicChords(root, scaleType) {
  try {
    if (scaleType === 'major' || scaleType === 'major pentatonic') {
      const key = Key.majorKey(root)
      return (key.chords || []).slice(0, 7).map((c, i) => ({
        chord: c,
        numeral: MAJOR_NUMERALS[i] ?? `${i + 1}`,
      }))
    }
    if (scaleType === 'minor' || scaleType === 'minor pentatonic') {
      const key = Key.minorKey(root)
      return (key.natural?.chords || []).slice(0, 7).map((c, i) => ({
        chord: c,
        numeral: MINOR_NUMERALS[i] ?? `${i + 1}`,
      }))
    }
    // Modes: approximate with major key of the same root
    const key = Key.majorKey(root)
    return (key.chords || []).slice(0, 7).map((c, i) => ({
      chord: c,
      numeral: MAJOR_NUMERALS[i] ?? `${i + 1}`,
    }))
  } catch {
    return []
  }
}
