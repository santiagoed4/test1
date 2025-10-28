# La Montañita

La Montañita is a minimal interactive podcast experience where the story pauses for reflection check-ins. Listeners answer text or multiple-choice prompts to continue and immediately see community insights stored on their device.

## Features

- 🎧 HTML5 audio player that pauses automatically at JSON-configured checkpoints.
- ✍️ Reflection modal requiring a text or multiple-choice response before playback resumes.
- 📊 Local aggregation for responses, including bar charts for choices and word highlights for text.
- 💾 Offline-friendly persistence using `localStorage`.
- 📱 Responsive Tailwind CSS styling with an earthy palette inspired by mountain mornings.

## Getting Started

### Full Vite workflow

1. **Install dependencies**

   ```bash
   npm install
   ```

   > If the npm registry is unavailable in your environment, install the listed dependencies manually before continuing.

2. **Run the dev server**

   ```bash
   npm run dev
   ```

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Preview the production build**

   ```bash
   npm run preview
   ```

The project is Vite-based, so it can be deployed to static hosts like Netlify or Vercel by serving the generated `dist/` folder.

### Running Tests

1. Install dependencies (only required once or when `package.json` changes):

   ```bash
   npm install
   ```

2. Run the headless Vitest suite:

   ```bash
   npm test
   ```

3. For interactive development, re-run the suite on file changes:

   ```bash
   npm run test:watch
   ```

**Output**

- Modal gating logic
- Results aggregation
- Component rendering (headless via jsdom)

---

### ⚠️ Current Failure: “vitest not found”

This simply means dependencies haven’t been installed yet.

```bash
# Quick fix
npm install
```

Or in CI:

```yaml
- name: Install dependencies
  run: npm ci
- name: Run tests
  run: npm test
```

With dependencies installed, `npm test` runs Vitest in jsdom mode headlessly so contributors can validate checkpoint gating before merging.

### Zero-install preview (no npm access required)

If you cannot reach the npm registry, open the standalone build that uses CDN-hosted React bundles instead of local tooling (an internet connection is required to fetch those bundles):

1. Launch a tiny static server from the `standalone/` directory (any server works—Python is shown below):

   ```bash
   cd standalone
   python3 -m http.server 8000
   ```

2. Visit [http://localhost:8000](http://localhost:8000) in your browser and open `index.html`.

The standalone flavor shares the same episode logic, enforces checkpoints, and persists answers to `localStorage`. When you regain npm access you can return to the full Vite workflow for development builds.

## Configuration

Episodes and checkpoints are defined in [`src/data/episodes.json`](src/data/episodes.json). Each checkpoint supports `text` or `choice` prompts and the player will pause automatically when the configured timestamp (in milliseconds) is reached.

```json
{
  "episodes": [
    {
      "id": "ep1",
      "title": "The Moment It Changed",
      "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "checkpoints": [
        {
          "id": "cp1",
          "timeMs": 90000,
          "type": "text",
          "prompt": "One word: what do you protect most when life turns uncertain?"
        },
        {
          "id": "cp2",
          "timeMs": 300000,
          "type": "choice",
          "prompt": "Choose your anchor",
          "options": ["Peace", "Time", "Freedom", "Love"]
        }
      ]
    }
  ]
}
```

To add new episodes or checkpoints, append to this JSON file. The UI automatically adapts to the new content.

## Extending the MVP

- Swap the storage helpers in [`src/storage.js`](src/storage.js) for Firebase or Supabase clients to sync answers across listeners.
- Introduce listener identifiers (cookies or UUIDs) to link reflections into a single journey.
- Surface more analytics by rendering multiple `ResultsPanel` instances or a dedicated insights page.

## Deployment

1. Run `npm run build`.
2. Upload the generated `dist/` directory to Netlify, Vercel, or any static host.
3. Configure a custom domain and HTTPS if desired.

Enjoy exploring the ridge with La Montañita 🌄
