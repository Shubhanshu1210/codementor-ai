import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage } from '../api/client';
import { getReviewHistory } from '../api/reviewApi';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingState from '../components/LoadingState';
import ScoreBadge from '../components/ScoreBadge';
import { useAuth } from '../auth/AuthContext';
import type { ReviewResponse } from '../types/review';

function DashboardPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    setError('');
    try {
      setReviews(await getReviewHistory());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'We could not load your review history.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const totalReviews = reviews.length;
  const averageScore = totalReviews > 0
    ? reviews.reduce((total, review) => total + review.overallScore, 0) / totalReviews
    : 0;
  const highestScore = totalReviews > 0
    ? Math.max(...reviews.map((review) => review.overallScore))
    : 0;

  return (
    <main className="page-frame py-8 sm:py-10">
      <section className="flex flex-col gap-6 border-b border-slate-800 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Developer workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome back{user?.email ? `, ${user.email}` : ''}.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Turn code submissions into focused, actionable engineering feedback.</p>
        </div>
        <Link className="primary-button focus-ring w-fit px-4 py-3 text-sm" to="/review/new">+ New Code Review</Link>
      </section>

      <section className="grid gap-4 py-8 sm:grid-cols-3" aria-label="Review statistics">
        <StatCard label="Total reviews" value={totalReviews.toString()} />
        <StatCard label="Average score" value={totalReviews > 0 ? `${averageScore.toFixed(1)}/10` : '--'} />
        <StatCard label="Highest score" value={totalReviews > 0 ? `${highestScore.toFixed(1)}/10` : '--'} />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-300">Review history</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">Recent reviews</h2>
          </div>
          {totalReviews > 0 && <span className="text-sm text-slate-500">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</span>}
        </div>

        {isLoading && <LoadingState />}
        {!isLoading && error && <ErrorMessage message={error} onRetry={() => void loadReviews()} />}
        {!isLoading && !error && reviews.length === 0 && <EmptyState />}
        {!isLoading && !error && reviews.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="hidden grid-cols-[minmax(0,1fr)_120px_150px_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:grid">
              <span>File</span><span>Language</span><span>Score</span><span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-slate-800">
              {reviews.map((review) => (
                <article className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_120px_150px_120px] sm:items-center" key={review.reviewId}>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white" title={review.fileName}>{review.fileName}</p>
                    <p className="mt-1 text-xs text-slate-500">Review #{review.reviewId}</p>
                  </div>
                  <span className="text-sm capitalize text-slate-400">{review.language}</span>
                  <ScoreBadge score={review.overallScore} />
                  <Link className="w-fit rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:justify-self-end" to={`/review/${review.reviewId}`}>View Review</Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface rounded-xl px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

export default DashboardPage;
