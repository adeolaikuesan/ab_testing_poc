import { useExperiment } from '../ab/useExperiment';

/**
 * Reference call site: read the variant, branch on it, render.
 * Everything that is not an explicit variant renders the control UI.
 */
export function CheckoutButton() {
  const experiment = useExperiment('checkout_button');
  const isTreatment = experiment.status === 'ready' && experiment.variant === 'treatment';

  return (
    <div className="card">
      <h2>Experiment 1 — checkout_button</h2>
      <p className="muted">Same label, different colour. 50 / 50 split.</p>

      <button className={isTreatment ? 'btn btn-green' : 'btn btn-blue'}>
        Complete purchase
      </button>

      <StatusLine experiment={experiment} />
    </div>
  );
}

export function StatusLine({ experiment }: { experiment: ReturnType<typeof useExperiment> }) {
  const text =
    experiment.status === 'ready'
      ? `variant: ${experiment.variant}`
      : experiment.status === 'error'
        ? `error: ${experiment.error.message}`
        : experiment.status;

  return <p className="status">{text}</p>;
}
