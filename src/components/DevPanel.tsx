import { useExperimentContext } from '../ab/ExperimentProvider';
import { MOCK_EXPERIMENT_NAMES } from '../ab/mockApi';

/**
 * Demo-only controls. Not part of the pattern you would ship — render it
 * behind an `import.meta.env.DEV` check (see App.tsx) or drop the file.
 */
export function DevPanel() {
  const { entries, enabled, forced, setEnabled, setForced } = useExperimentContext();

  return (
    <aside className="panel">
      <h2>Experiment controls</h2>

      {MOCK_EXPERIMENT_NAMES.map((name) => {
        const entry = entries[name];
        const variants = entry?.status === 'ready' ? entry.config.variants : [];
        const isEnabled = enabled[name] !== false;

        return (
          <div className="panel-row" key={name}>
            <label className="switch">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(event) => setEnabled(name, event.target.checked)}
              />
              <code>{name}</code>
            </label>

            <select
              value={forced[name] ?? ''}
              disabled={!isEnabled || variants.length === 0}
              onChange={(event) => setForced(name, event.target.value || null)}
            >
              <option value="">Auto (weighted)</option>
              {variants.map((variant) => (
                <option key={variant.key} value={variant.key}>
                  {variant.key} ({variant.weight})
                </option>
              ))}
            </select>
          </div>
        );
      })}

      <p className="muted small">
        Toggles and auto-assignment both persist across reloads.
      </p>
    </aside>
  );
}
