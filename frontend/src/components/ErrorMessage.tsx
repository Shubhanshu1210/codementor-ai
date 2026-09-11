interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  title?: string;
}

function ErrorMessage({ message, onRetry, title = 'Unable to load review history' }: ErrorMessageProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between" role="alert">
      <div>
        <h2 className="font-semibold text-rose-200">{title}</h2>
        <p className="mt-1 text-sm text-rose-200/75">{message}</p>
      </div>
      <button className="focus-ring rounded-lg border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/10" onClick={onRetry} type="button">Retry</button>
    </div>
  );
}

export default ErrorMessage;
