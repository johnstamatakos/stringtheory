import { useMemo } from 'react'
import { Chord } from 'tonal'
import { fretsToNotes, STANDARD_TUNING } from '../utils/midiToNotes'
import { lookupVoicings } from '../utils/lookupVoicings'

export function useChordIdentifier(frets, tuning = STANDARD_TUNING, capo = 0) {
  return useMemo(() => {
    const notes = fretsToNotes(frets, tuning, capo)

    const hasFrettedString = frets.some(f => f !== null && f > 0)

    if (!hasFrettedString || notes.length < 2) {
      return { notes, chords: [], voicings: [] }
    }

    const chords = Chord.detect(notes)
    const voicings = chords.length > 0 ? lookupVoicings(chords[0]) : []

    return { notes, chords, voicings }
  }, [frets, tuning, capo])
}
