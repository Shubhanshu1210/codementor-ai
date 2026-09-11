function LoadingState({ message = 'Loading your recent reviews...' }: { message?: string }) {
  return (
    <div className="surface rounded-xl p-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300" aria-hidden="true" />
        {message}
      </div>
      <span className="sr-only">{message}</span>
    </div>
  );
}

export default LoadingState;
