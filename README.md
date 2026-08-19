# ab_testing_poc

Frontend-only A/B testing proof of concept — Vite + React + TypeScript, no runtime dependencies
beyond React itself.

```bash
npm install
npm run dev
```

## What it demonstrates

Two experiments, two variants each, served from a mocked `GET /experiment/:experiment_name`:

| endpoint | variants (weight) | difference |
| --- | --- | --- |
| `/experiment/checkout_button` | `control` (50), `treatment` (50) | blue vs green "Complete purchase" |
| `/experiment/signup_banner` | `control` (70), `variant_b` (30) | blue "Sign up" vs orange pill "Get started free" |

A dev-only panel switches each experiment on/off and forces a specific variant. Both persist
across reloads.

## Response contract

```json
{
  "key": "checkout_button",
  "variants": [
    { "key": "control",   "weight": 50 },
    { "key": "treatment", "weight": 50 }
  ]
}
```

Weights are relative — they do not have to sum to 100.

## Copying this into a real app

`src/ab/` is self-contained; copy the directory as a unit.

1. Wrap the app in `<ExperimentProvider>`.
2. Replace the body of `fetchExperiment` in `src/ab/mockApi.ts` with the real `fetch` call (it is
   already there, commented out) and delete the `EXPERIMENTS` fixture. Nothing else in `src/ab/`
   knows the data was mocked.
3. Point `getUserId` in `src/ab/storage.ts` at your real user or anonymous analytics id.
4. Read variants at the call site:

```tsx
const experiment = useExperiment('checkout_button');
const isTreatment = experiment.status === 'ready' && experiment.variant === 'treatment';
```

5. Drop `src/components/DevPanel.tsx` and the demo `enabled` / `forced` overrides if you don't
   want in-app toggles, or keep them behind the `import.meta.env.DEV` guard used in `App.tsx`.

## How assignment works

`pickVariant(variants, seed)` in `src/ab/assign.ts` hashes `${userId}:${experimentKey}` (FNV-1a)
into 10,000 buckets and walks the cumulative weight distribution. That makes assignment:

- **sticky** — same user, same variant on every reload, with nothing written to storage,
- **independent** — being in `treatment` for one experiment says nothing about the other,
- **testable** — a pure function, no randomness to mock.

If the experiment service is slow, down, or the experiment is switched off, `useExperiment`
reports `loading` / `error` / `disabled` and the call site renders its normal UI. An experiment
service must never be able to break the page.
