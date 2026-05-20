# Martin Portfolio

Interactive portfolio for Martin Alvarez Martinez, focused on data engineering, analytics automation, applied AI and business intelligence.

## Stack

- Next.js 15 with App Router
- React and TypeScript
- Custom CSS with dark/light mode
- Groq + LLaMA 3 for contextual chat
- Static demo data served from `public/data`

## Demos

- `Iris Classifier`: educational ML interpretability demo with sliders and probability-style outputs.
- `ABC Analysis`: inventory prioritization module with Pareto classes, recommendations and demand sensitivity.
- `Sales Commission Pipeline`: web demo for a PySpark + Delta Lake pipeline using precomputed JSON outputs, Great Expectations context and Trino validation artifacts.

The heavy data processing for the pipeline runs outside Vercel. The portfolio only consumes exported JSON files in the browser.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` from `.env.local.example` and add:

```bash
GROQ_API_KEY=your_key_here
```

Without this key, the UI still loads and the chat endpoint returns a clear configuration error.

## Build

```bash
npm run build
```

If the local Next.js cache becomes corrupted on Windows:

```bash
npm run clean
npm run build
```
