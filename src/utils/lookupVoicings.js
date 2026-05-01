import guitar from '@tombatossals/chords-db/lib/guitar.json'

// Map any note name → chords-db root key
// chords-db uses: C Csharp D Eb E F Fsharp G Ab A Bb B
const ROOT_MAP = {
  'C':  'C',
  'C#': 'Csharp',
  'Db': 'Csharp',
  'D':  'D',
  'D#': 'Eb',
  'Eb': 'Eb',
  'E':  'E',
  'F':  'F',
  'F#': 'Fsharp',
  'Gb': 'Fsharp',
  'G':  'G',
  'G#': 'Ab',
  'Ab': 'Ab',
  'A':  'A',
  'A#': 'Bb',
  'Bb': 'Bb',
  'B':  'B',
}

// Tonal chord suffix → chords-db suffix
const SUFFIX_MAP = {
  '':       'major',
  'M':      'major',
  'm':      'minor',
  'dim':    'dim',
  'dim7':   'dim7',
  'aug':    'aug',
  '6':      '6',
  '69':     '69',
  '7':      '7',
  '7b5':    '7b5',
  'aug7':   'aug7',
  '9':      '9',
  '9b5':    '9b5',
  'aug9':   'aug9',
  '11':     '11',
  '13':     '13',
  'maj7':   'maj7',
  'maj9':   'maj9',
  'maj11':  'maj11',
  'maj13':  'maj13',
  'm6':     'm6',
  'm7':     'm7',
  'm7b5':   'm7b5',
  'm9':     'm9',
  'm11':    'm11',
  'mmaj7':  'mmaj7',
  'mMaj7':  'mmaj7',
  'mmaj9':  'mmaj9',
  'mMaj9':  'mmaj9',
  'add9':   'add9',
  'Madd9':  'add9',   // Tonal emits 'M' major prefix for add9
  'madd9':  'madd9',
  'sus2':   'sus2',
  'sus4':   'sus4',
}

/**
 * Look up voicings for a Tonal chord token like "Cm7" or "G" or "F#maj7".
 * Returns an array of position objects from chords-db, or [].
 */
export function lookupVoicings(chordName) {
  if (!chordName) return []

  // Parse root (with optional # or b) and suffix
  const match = chordName.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return []

  const [, root, suffix] = match

  const dbRoot = ROOT_MAP[root]
  if (!dbRoot) return []

  const dbSuffix = SUFFIX_MAP[suffix]
  if (dbSuffix === undefined) return []

  const rootChords = guitar.chords[dbRoot]
  if (!rootChords) return []

  const entry = rootChords.find(c => c.suffix === dbSuffix)
  return entry ? entry.positions : []
}
