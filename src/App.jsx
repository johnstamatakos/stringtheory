import { useState, useCallback } from 'react'
import { Fretboard } from './components/Fretboard/Fretboard'
import { ChordResult } from './components/ChordResult/ChordResult'
import { VoicingGallery } from './components/VoicingGallery/VoicingGallery'
import { ChordLibrary } from './components/ChordLibrary/ChordLibrary'
import { KeySelector } from './components/KeySelector/KeySelector'
import { ChordSuggestions } from './components/ChordSuggestions/ChordSuggestions'
import { TuningPanel } from './components/TuningPanel/TuningPanel'
import { useChordIdentifier } from './hooks/useChordIdentifier'
import { formatChordName } from './utils/formatChordName'
import { getScalePCs } from './utils/scaleUtils'
import { strumChord } from './utils/audioEngine'
import { STANDARD_TUNING } from './utils/midiToNotes'
import styles from './App.module.css'

const INITIAL_FRETS = [null, null, null, null, null, null]

export default function App() {
  const [frets, setFrets] = useState(INITIAL_FRETS)
  const [tuning, setTuning] = useState(STANDARD_TUNING)
  const [capo, setCapo] = useState(0)
  const [scaleKey, setScaleKey] = useState(null)

  const { notes, chords, voicings } = useChordIdentifier(frets, tuning, capo)
  const scalePCData = scaleKey ? getScalePCs(scaleKey.root, scaleKey.type) : { pcs: [], rootPc: null }

  const handleClear = useCallback(() => { setFrets(INITIAL_FRETS); setCapo(0) }, [])
  const handleStrum = useCallback(() => strumChord(frets, tuning, capo), [frets, tuning, capo])
  const handleVoicingPlay = useCallback((v) => strumChord(v, tuning, capo), [tuning, capo])

  const showSubPanels = voicings?.length > 0 || scaleKey !== null

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>StringTheory</h1>
        <div className={styles.headerActions}>
          <button className={styles.strumBtn} onClick={handleStrum}>▶ Strum</button>
          <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
        </div>
      </header>

      <main className={styles.main}>

        {/* Row 1 — Tuning + Capo */}
        <section className={styles.toolbarSection}>
          <TuningPanel tuning={tuning} onTuningChange={setTuning} />
          <div className={styles.capoPanel}>
            <span className={styles.capoLabel}>Capo</span>
            <div className={styles.capoControls}>
              <button className={styles.capoBtn} onClick={() => setCapo(c => Math.max(0, c - 1))} disabled={capo === 0}>−</button>
              <span className={styles.capoValue}>{capo}</span>
              <button className={styles.capoBtn} onClick={() => setCapo(c => Math.min(11, c + 1))} disabled={capo === 11}>+</button>
            </div>
          </div>
        </section>

        {/* Row 2 — Fretboard + chord result blended on the right */}
        <div className={styles.fretRow}>
          <div className={styles.fretboardSection}>
            <Fretboard
              frets={frets}
              onFretsChange={setFrets}
              tuning={tuning}
              capo={capo}
              scalePCs={scalePCData.pcs}
              scaleRootPC={scalePCData.rootPc}
            />
          </div>
          <div className={styles.chordResultCol}>
            <ChordResult notes={notes} chords={chords} />
          </div>
        </div>

        {/* Row 3 — Chord Library (left 50%) + Key Selector (right 50%), equal height */}
        <div className={styles.panelRow}>
          <ChordLibrary onChordSelect={setFrets} tuning={tuning} capo={capo} />
          <KeySelector scaleKey={scaleKey} onScaleKeyChange={setScaleKey} />
        </div>

        {/* Row 4 — Sub-panels: voicings under library, suggestions under key selector */}
        {showSubPanels && (
          <div className={styles.panelRow}>
            {voicings?.length > 0 && (
              <VoicingGallery
                className={styles.leftCell}
                voicings={voicings}
                chordName={formatChordName(chords[0])}
                activeFrets={frets}
                onVoicingSelect={setFrets}
                onVoicingPlay={handleVoicingPlay}
                tuning={tuning}
              />
            )}
            {scaleKey && (
              <ChordSuggestions
                className={styles.rightCell}
                scaleKey={scaleKey}
                onChordSelect={setFrets}
                tuning={tuning}
                capo={capo}
              />
            )}
          </div>
        )}

      </main>
    </div>
  )
}
