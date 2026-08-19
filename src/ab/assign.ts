import type { Variant } from './types';

const BUCKETS = 10_000;

/** FNV-1a, 32-bit. Small, stable, and good enough for bucketing. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // hash * 16777619, kept inside 32 bits
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Deterministically pick a variant for `seed`, respecting relative weights.
 *
 * Weights do not need to sum to 100 — they are normalised against their total,
 * so the backend is free to send any scale.
 *
 * Same seed always yields the same variant, which is what makes assignment
 * sticky across reloads without writing anything to storage.
 */
export function pickVariant(variants: Variant[], seed: string): Variant | null {
  const usable = variants.filter((variant) => variant.weight > 0);
  if (usable.length === 0) return null;

  const total = usable.reduce((sum, variant) => sum + variant.weight, 0);
  const bucket = hashString(seed) % BUCKETS;

  let cumulative = 0;
  for (const variant of usable) {
    cumulative += (variant.weight / total) * BUCKETS;
    if (bucket < cumulative) return variant;
  }

  // Only reachable through floating point drift on the final boundary.
  return usable[usable.length - 1];
}
