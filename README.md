# Salience Field Physics Explorer

An interactive React/Vite dashboard for probing **salience-field patterns** in a
novelty–momentum phase space, and exploring analogies between those patterns and
physical phenomena. Built from real field data (`data.ts` / the bundled profile JSON).

## Features

- **Phase-space canvas** — plot and explore salience modes across novelty vs. momentum.
- **Instrument panel** — probe arbitrary points and pin modes for comparison.
- **Physics prediction** — `services/physicsService` maps probe parameters to predicted
  field behavior.
- **AI collaborator** — an optional assistant panel for interpreting patterns.

## Run locally

**Prerequisites:** Node.js

```bash
npm install
# the AI collaborator uses the Gemini API — set your own key:
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm run dev
```

The app runs without a key; only the AI-collaborator panel requires one. No key is
bundled in this repo.

## Status

An exploratory visualization tool for the broader salience research line — a way to
*see* and interrogate salience-field structure, not a validated physical model.
