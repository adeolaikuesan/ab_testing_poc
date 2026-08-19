import type { ExperimentConfig } from './types';

/**
 * Mock of the experiment service.
 *
 * THIS IS THE ONLY FILE TO REPLACE when the real backend is live — swap the
 * body of `fetchExperiment` for the commented-out implementation below and
 * delete `EXPERIMENTS`. Nothing else in src/ab knows the data is faked.
 */

// Real implementation:
//
// export async function fetchExperiment(name: string): Promise<ExperimentConfig> {
//   const res = await fetch(`/experiment/${name}`);
//   if (!res.ok) throw new Error(`Experiment "${name}" not found (${res.status})`);
//   return (await res.json()) as ExperimentConfig;
// }

const LATENCY_MS = 250;

const EXPERIMENTS: Record<string, ExperimentConfig> = {
  checkout_button: {
    key: 'checkout_button',
    variants: [
      { key: 'control', weight: 50 },
      { key: 'treatment', weight: 50 },
    ],
  },
  signup_banner: {
    key: 'signup_banner',
    variants: [
      { key: 'control', weight: 70 },
      { key: 'variant_b', weight: 30 },
    ],
  },
};

/** Mocks GET /experiment/:experiment_name */
export function fetchExperiment(name: string): Promise<ExperimentConfig> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const config = EXPERIMENTS[name];
      if (!config) {
        reject(new Error(`Experiment "${name}" not found (404)`));
        return;
      }
      resolve(structuredClone(config));
    }, LATENCY_MS);
  });
}

/** Demo-only: lets the dev panel list experiments without hardcoding them twice. */
export const MOCK_EXPERIMENT_NAMES = Object.keys(EXPERIMENTS);
