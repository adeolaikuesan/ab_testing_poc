import { ExperimentProvider } from './ab/ExperimentProvider';
import { CheckoutButton } from './components/CheckoutButton';
import { DevPanel } from './components/DevPanel';
import { SignupBanner } from './components/SignupBanner';
import './App.css';

export default function App() {
  return (
    <ExperimentProvider>
      <main className="page">
        <header>
          <h1>A/B testing POC</h1>
          <p className="muted">
            Variants come from <code>GET /experiment/:experiment_name</code>, mocked in{' '}
            <code>src/ab/mockApi.ts</code>.
          </p>
        </header>

        <div className="grid">
          <CheckoutButton />
          <SignupBanner />
        </div>

        {/* Demo controls only — this guard keeps them out of production builds. */}
        {import.meta.env.DEV && <DevPanel />}
      </main>
    </ExperimentProvider>
  );
}
