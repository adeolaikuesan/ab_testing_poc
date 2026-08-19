/**
 * Shape returned by GET /experiment/:experiment_name
 *
 * {
 *   "key": "checkout_button",
 *   "variants": [
 *     { "key": "control",   "weight": 50 },
 *     { "key": "treatment", "weight": 50 }
 *   ]
 * }
 */
export type Variant = {
  key: string;
  weight: number;
};

export type ExperimentConfig = {
  key: string;
  variants: Variant[];
};

/**
 * Discriminated union so a caller cannot read `variant` before it resolves.
 * Render your baseline UI for every status except 'ready'.
 */
export type ExperimentState =
  | { status: 'loading' }
  | { status: 'disabled' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; variant: string };
