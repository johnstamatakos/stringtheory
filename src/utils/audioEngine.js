import { STANDARD_TUNING } from './midiToNotes'

let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

/**
 * Karplus-Strong plucked string synthesis.
 * Pre-computes the decay buffer in JS and plays it as a BufferSource.
 */
function pluckString(midi, startTime, gain = 0.55) {
  const ctx = getCtx()
  const freq = 440 * Math.pow(2, (midi - 69) / 12)
  const sr = ctx.sampleRate
  const N = Math.max(2, Math.round(sr / freq))
  const duration = 3.0
  const total = Math.ceil(sr * duration)

  const buffer = ctx.createBuffer(1, total, sr)
  const data = buffer.getChannelData(0)

  // Seed with white noise
  for (let i = 0; i < N; i++) data[i] = Math.random() * 2 - 1

  // Karplus-Strong averaging filter with slight decay
  const decay = 0.996
  for (let i = N; i < total; i++) {
    data[i] = decay * 0.5 * (data[i - N] + data[i - N + 1])
  }

  const src = ctx.createBufferSource()
  src.buffer = buffer

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(gain, startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  src.connect(gainNode)
  gainNode.connect(ctx.destination)
  src.start(startTime)
}

const STRUM_DELAY = 0.028 // seconds between strings

/**
 * Strum all active strings low E → high e.
 * frets: internal format (null=muted, 0=open, N=fret)
 */
export function strumChord(frets, tuning = STANDARD_TUNING, capo = 0) {
  const ctx = getCtx()
  const now = ctx.currentTime
  let i = 0
  frets.forEach((fret, si) => {
    if (fret === null) return
    const midi = fret === 0 ? tuning[si] + capo : tuning[si] + fret
    pluckString(midi, now + i * STRUM_DELAY)
    i++
  })
}
