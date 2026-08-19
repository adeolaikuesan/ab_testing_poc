import { useExperiment } from '../ab/useExperiment';
import { StatusLine } from './CheckoutButton';

export function SignupBanner() {
  const experiment = useExperiment('signup_banner');
  const isVariantB = experiment.status === 'ready' && experiment.variant === 'variant_b';

  return (
    <div className="card">
      <h2>Experiment 2 — signup_banner</h2>
      <p className="muted">Different colour, shape and label. 70 / 30 split.</p>

      {isVariantB ? (
        <button className="btn btn-orange btn-pill">Get started free</button>
      ) : (
        <button className="btn btn-blue">Sign up</button>
      )}

      <StatusLine experiment={experiment} />
    </div>
  );
}
