import { VoicingCard } from '../VoicingCard/VoicingCard'
import { positionToFrets } from '../../utils/positionToFrets'
import { transposeVoicingToTuning, isStandardTuning } from '../../utils/transposeVoicing'
import { STANDARD_TUNING } from '../../utils/midiToNotes'
import styles from './VoicingGallery.module.css'

export function VoicingGallery({ voicings, chordName, activeFrets, onVoicingSelect, onVoicingPlay, tuning = STANDARD_TUNING, className }) {
  if (!voicings || voicings.length === 0) return null

  const needsTranspose = !isStandardTuning(tuning)

  return (
    <div className={`${styles.wrapper}${className ? ` ${className}` : ''}`}>
      <h2 className={styles.heading}>
        Other ways to play <span className={styles.name}>{chordName}</span>
      </h2>
      <div className={styles.scroll}>
        {voicings.map((position, i) => {
          const stdFrets = positionToFrets(position)
          const converted = needsTranspose ? transposeVoicingToTuning(stdFrets, tuning) : stdFrets
          const isActive = activeFrets && converted.every((f, si) => f === activeFrets[si])
          return (
            <VoicingCard
              key={i}
              position={position}
              onClick={onVoicingSelect ? () => onVoicingSelect(converted) : undefined}
              onPlay={onVoicingPlay ? () => onVoicingPlay(converted) : undefined}
              isActive={isActive}
            />
          )
        })}
      </div>
    </div>
  )
}
