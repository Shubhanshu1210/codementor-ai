import { Link } from 'react-router-dom';

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 font-mono text-lg text-cyan-300">{'</>'}</div>
      <h2 className="mt-5 text-xl font-semibold text-white">No code reviews yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Submit your first code sample and get focused feedback on quality, security, and performance.</p>
      <Link className="primary-button focus-ring mt-6 px-4 py-2.5 text-sm" to="/review/new">Start your first review</Link>
    </div>
  );
}

export default EmptyState;
