import { useEffect } from 'react';
import { pickVariant } from './assign';
import { useExperimentContext } from './ExperimentProvider';
import type { ExperimentState } from './types';

/**
 * Resolve the active variant for one experiment.
 *
 * Precedence: disabled -> loading/error -> forced variant -> weighted assignment.
 *
 * Callers should render their existing UI for every status other than 'ready',
 * so a slow or broken experiment service can never break the page.
 */
export function useExperiment(name: string): ExperimentState {
  const { entries, ensureLoaded, enabled, forced, userId } = useExperimentContext();

  useEffect(() => {
    ensureLoaded(name);
  }, [ensureLoaded, name]);

  // Experiments are on unless the demo panel has switched them off.
  if (enabled[name] === false) return { status: 'disabled' };

  const entry = entries[name];
  if (!entry || entry.status === 'loading') return { status: 'loading' };
  if (entry.status === 'error') return { status: 'error', error: entry.error };

  const { variants } = entry.config;

  // A forced variant that no longer exists falls through to the real assignment.
  const override = forced[name];
  if (override && variants.some((variant) => variant.key === override)) {
    return { status: 'ready', variant: override };
  }

  // Seeding per experiment keeps assignments independent of each other.
  const assigned = pickVariant(variants, `${userId}:${name}`);
  if (!assigned) return { status: 'disabled' };

  return { status: 'ready', variant: assigned.key };
}
