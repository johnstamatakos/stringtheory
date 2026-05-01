import styles from './VoicingCard.module.css'

const NUM_STRINGS = 6
const NUM_FRETS = 5
const STRING_SPACING = 30
const FRET_SPACING = 28
const PADDING = { top: 32, left: 20, right: 20, bottom: 16 }
const DOT_RADIUS = 9

const WIDTH = PADDING.left + (NUM_STRINGS - 1) * STRING_SPACING + PADDING.right
const HEIGHT = PADDING.top + NUM_FRETS * FRET_SPACING + PADDING.bottom

/**
 * position: a chords-db position object
 * {
 *   baseFret: number,
 *   frets: [6 numbers, -1 = muted, 0 = open, 1–N = relative fret],
 *   fingers: [6 numbers],
 *   barres: [barre fret numbers],
 *   midi: [...],
 * }
 *
 * chords-db string order: index 0 = low E, index 5 = high e
 * We render low E on the left.
 */
export function VoicingCard({ position, chordName, onClick, isActive, onPlay }) {
  const { baseFret, frets, fingers, barres = [] } = position

  const showNut = baseFret === 1

  // x position of string i (0 = low E, left side)
  const sx = (i) => PADDING.left + i * STRING_SPACING
  // y position of fret f (1-based relative)
  const fy = (f) => PADDING.top + (f - 0.5) * FRET_SPACING

  // Barre arcs
  const barreElements = barres.map((barreFret) => {
    const stringIndices = frets
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => f === barreFret)
      .map(({ i }) => i)

    if (stringIndices.length < 2) return null
    const leftX = sx(Math.min(...stringIndices))
    const rightX = sx(Math.max(...stringIndices))
    const y = fy(barreFret)

    return (
      <rect
        key={`barre-${barreFret}`}
        x={leftX - DOT_RADIUS}
        y={y - DOT_RADIUS}
        width={rightX - leftX + DOT_RADIUS * 2}
        height={DOT_RADIUS * 2}
        rx={DOT_RADIUS}
        fill="var(--color-dot-active)"
      />
    )
  })

  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ''} ${isActive ? styles.cardActive : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {chordName && <div className={styles.label}>{chordName}</div>}
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
      >
        {/* Nut */}
        {showNut && (
          <rect
            x={PADDING.left - 2}
            y={PADDING.top - 4}
            width={(NUM_STRINGS - 1) * STRING_SPACING + 4}
            height={4}
            fill="var(--color-text)"
            rx={1}
          />
        )}

        {/* Base fret label */}
        {baseFret > 1 && (
          <text
            x={PADDING.left - 8}
            y={PADDING.top + FRET_SPACING * 0.5}
            textAnchor="end"
            fill="var(--color-text-muted)"
            fontSize={11}
            fontFamily="var(--font-mono)"
            dominantBaseline="middle"
          >
            {baseFret}fr
          </text>
        )}

        {/* Fret lines */}
        {Array.from({ length: NUM_FRETS + 1 }, (_, f) => (
          <line
            key={`fret-${f}`}
            x1={PADDING.left}
            x2={PADDING.left + (NUM_STRINGS - 1) * STRING_SPACING}
            y1={PADDING.top + f * FRET_SPACING}
            y2={PADDING.top + f * FRET_SPACING}
            stroke="var(--color-fret)"
            strokeWidth={1}
          />
        ))}

        {/* String lines */}
        {Array.from({ length: NUM_STRINGS }, (_, i) => (
          <line
            key={`str-${i}`}
            x1={sx(i)}
            x2={sx(i)}
            y1={PADDING.top}
            y2={PADDING.top + NUM_FRETS * FRET_SPACING}
            stroke="var(--color-string)"
            strokeWidth={i === 0 ? 2.5 : i === 1 ? 2 : i === 2 ? 1.5 : 1}
          />
        ))}

        {/* Barre */}
        {barreElements}

        {/* Dots */}
        {frets.map((fret, i) => {
          if (fret === -1) {
            // Muted — X above nut
            return (
              <text
                key={`x-${i}`}
                x={sx(i)}
                y={PADDING.top - 12}
                textAnchor="middle"
                fill="var(--color-dot-muted)"
                fontSize={13}
                dominantBaseline="middle"
              >
                ✕
              </text>
            )
          }
          if (fret === 0) {
            // Open — circle above nut
            return (
              <circle
                key={`open-${i}`}
                cx={sx(i)}
                cy={PADDING.top - 12}
                r={6}
                fill="none"
                stroke="var(--color-dot-open)"
                strokeWidth={1.5}
              />
            )
          }
          // Fretted dot
          const finger = fingers?.[i] ?? 0
          return (
            <g key={`dot-${i}`}>
              <circle
                cx={sx(i)}
                cy={fy(fret)}
                r={DOT_RADIUS}
                fill="var(--color-dot-active)"
              />
              {finger > 0 && (
                <text
                  x={sx(i)}
                  y={fy(fret)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--color-bg)"
                  fontSize={10}
                  fontWeight="600"
                >
                  {finger}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <div className={styles.footer}>
        {baseFret > 1 && <span className={styles.baseFret}>pos {baseFret}</span>}
        {onPlay && (
          <button
            className={styles.playBtn}
            onClick={e => { e.stopPropagation(); onPlay() }}
            title="Strum this voicing"
          >
            ▶
          </button>
        )}
      </div>
    </div>
  )
}
