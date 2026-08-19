import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { fetchExperiment } from './mockApi';
import { getUserId, loadEnabled, loadForced, saveEnabled, saveForced } from './storage';
import type { ExperimentConfig } from './types';

type Entry =
  | { status: 'loading' }
  | { status: 'ready'; config: ExperimentConfig }
  | { status: 'error'; error: Error };

type ExperimentContextValue = {
  userId: string;
  entries: Record<string, Entry>;
  /** Fetches the config once per experiment name. Safe to call on every render. */
  ensureLoaded: (name: string) => void;

  // Demo controls
  enabled: Record<string, boolean>;
  forced: Record<string, string | null>;
  setEnabled: (name: string, value: boolean) => void;
  setForced: (name: string, variant: string | null) => void;
};

const ExperimentContext = createContext<ExperimentContextValue | null>(null);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [enabled, setEnabledState] = useState<Record<string, boolean>>(loadEnabled);
  const [forced, setForcedState] = useState<Record<string, string | null>>(loadForced);

  const userId = useMemo(getUserId, []);
  const requested = useRef(new Set<string>());

  const ensureLoaded = useCallback((name: string) => {
    if (requested.current.has(name)) return;
    requested.current.add(name);

    setEntries((current) => ({ ...current, [name]: { status: 'loading' } }));

    fetchExperiment(name).then(
      (config) => setEntries((current) => ({ ...current, [name]: { status: 'ready', config } })),
      (error: Error) => setEntries((current) => ({ ...current, [name]: { status: 'error', error } })),
    );
  }, []);

  const setEnabled = useCallback((name: string, value: boolean) => {
    setEnabledState((current) => ({ ...current, [name]: value }));
  }, []);

  const setForced = useCallback((name: string, variant: string | null) => {
    setForcedState((current) => ({ ...current, [name]: variant }));
  }, []);

  useEffect(() => saveEnabled(enabled), [enabled]);
  useEffect(() => saveForced(forced), [forced]);

  const value = useMemo<ExperimentContextValue>(
    () => ({ userId, entries, ensureLoaded, enabled, forced, setEnabled, setForced }),
    [userId, entries, ensureLoaded, enabled, forced, setEnabled, setForced],
  );

  return <ExperimentContext.Provider value={value}>{children}</ExperimentContext.Provider>;
}

export function useExperimentContext(): ExperimentContextValue {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used inside <ExperimentProvider>');
  }
  return context;
}
