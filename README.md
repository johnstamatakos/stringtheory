# StringTheory

A guitar chord identifier and explorer built as a static web app. Click frets on the fretboard to identify chords, browse voicings, and explore scales and diatonic chord suggestions.

<img width="1704" height="964" alt="image" src="https://github.com/user-attachments/assets/d3a63e03-46fb-4632-b869-edc228e1616e" />


## Features

- **Chord identification** — tap any combination of frets to instantly identify the chord and its enharmonic equivalents
- **Voicing gallery** — see alternative ways to play the identified chord, click any to load it on the fretboard
- **Chord library** — browse chords by root and quality; selecting one loads the first voicing automatically
- **Scale explorer** — choose a key and scale type to overlay scale tones on the fretboard (blue = scale tone, pink = root)
- **Diatonic chord suggestions** — when a scale is active, see the diatonic chords for that key and click to play them
- **Alternate tunings** — supports common alternate tunings; voicings and identifications update accordingly
- **Capo support** — set a capo fret; chord library selections transpose to the correct position above the capo
- **Strum** — plays the current voicing through the browser's audio engine

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:

```bash
npm run build
```

The output in `dist/` is fully static and can be deployed to any static host (GitHub Pages, Netlify, Vercel, etc.).

## How to Use

1. **Identify a chord** — click frets on the board. The chord name and alternate names appear on the right. Click a fret again to deselect it; click the nut symbol (○/✕) to toggle a string open or muted.
2. **Browse the chord library** — pick a root note and quality from the Chord Library panel. The fretboard loads the default voicing. Click another voicing in the gallery below to switch.
3. **Explore a scale** — choose a root and scale type in the Key Selector panel. Scale tones light up on the board, and diatonic chord suggestions appear below.
4. **Change tuning** — use the Tuning panel to switch to an alternate tuning. All voicings and identifications update automatically.
5. **Use a capo** — increment the capo with the +/− controls. Frets behind the capo are dimmed. Chord library selections will automatically find a playable voicing above the capo.
6. **Clear** — resets the fretboard and capo back to default.

## Technologies

| Library | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 18 | UI rendering and state management |
| [Vite](https://vitejs.dev) | 6 | Dev server and production bundler |
| [Tonal](https://github.com/tonaljs/tonal) | 6 | Music theory — chord detection (`Chord.detect`), scale/key lookups, note math |
| [@tombatossals/chords-db](https://github.com/tombatossals/chords-db) | 0.5.1 | Guitar chord voicing database (positions, fingerings) |
| Web Audio API | — | Real-time audio synthesis for the strum feature (no external dependency) |

CSS is written in plain CSS Modules — no CSS framework.
