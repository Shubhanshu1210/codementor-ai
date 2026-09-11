import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/client';
import { getReviewById } from '../api/reviewApi';
import ErrorMessage from '../components/ErrorMessage';
import LoadingState from '../components/LoadingState';
import ScoreBadge from '../components/ScoreBadge';
import type { ReviewResponse } from '../types/review';

interface ReviewSection {
  title: string;
  description: string;
  content: string;
}

function ReviewDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReview = async () => {
    const reviewId = Number(id);
    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      setReview(null);
      setError('Review not found');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      setReview(await getReviewById(reviewId));
    } catch (requestError) {
      setReview(null);
      setError(getApiErrorMessage(requestError, 'Unable to load this review right now. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReview();
  }, [id]);

  if (isLoading) {
    return <main className="page-frame py-8 sm:py-10"><LoadingState message="Loading your AI code review..." /></main>;
  }

  if (error || !review) {
    return (
      <main className="page-frame py-8 sm:py-10">
        <div className="mb-8"><Link className="focus-ring rounded text-sm font-medium text-slate-400 transition hover:text-cyan-300" to="/dashboard">← Back to Dashboard</Link></div>
        <ErrorMessage message={error || 'Review not found'} onRetry={() => void loadReview()} title="Unable to load this review" />
      </main>
    );
  }

  const sections: ReviewSection[] = [
    { title: 'Bug Detection', description: 'Potential defects and correctness risks identified in the submission.', content: review.bugDetection },
    { title: 'Code Smells', description: 'Patterns that may make the code harder to maintain or extend.', content: review.codeSmells },
    { title: 'Performance', description: 'Efficiency considerations and opportunities for improvement.', content: review.performance },
    { title: 'Security', description: 'Security risks and defensive programming recommendations.', content: review.security },
    { title: 'Best Practices', description: 'Practical recommendations for clearer, more reliable code.', content: review.bestPractices },
  ];

  return (
    <main className="page-frame py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link className="focus-ring rounded text-sm font-medium text-slate-400 transition hover:text-cyan-300" to="/dashboard">← Back to Dashboard</Link>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">AI code review</p>
          <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl">{review.fileName}</h1>
          <p className="mt-3 text-sm text-slate-400"><span className="capitalize">{review.language}</span><span className="mx-2 text-slate-600">·</span>Review #{review.reviewId}</p>
        </div>
        <Link className="primary-button focus-ring w-fit px-4 py-3 text-sm" to="/review/new">+ New Review</Link>
      </div>

      <section className="mb-8 flex flex-col gap-5 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-6 shadow-xl shadow-cyan-950/10 sm:flex-row sm:items-center sm:justify-between sm:p-8" aria-labelledby="review-summary-title">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-cyan-300">Review summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-white" id="review-summary-title">Overall Score</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{review.message}</p>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <span className="text-4xl font-semibold tracking-tight text-white">{review.overallScore.toFixed(1)}<span className="text-lg text-slate-500"> / 10</span></span>
          <ScoreBadge score={review.overallScore} />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2" aria-label="AI analysis sections">
        {sections.map((section) => <AnalysisSection key={section.title} section={section} />)}
      </section>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <button className="focus-ring rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white" onClick={() => navigate('/dashboard')} type="button">Back to Dashboard</button>
        <Link className="primary-button focus-ring px-4 py-3 text-center text-sm" to="/review/new">Review Another File</Link>
      </div>
    </main>
  );
}

function AnalysisSection({ section }: { section: ReviewSection }) {
  return (
    <article className="surface rounded-xl p-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-semibold text-white">{section.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{section.description}</p>
      </div>
      <p className="whitespace-pre-wrap break-words pt-5 text-sm leading-7 text-slate-300">{section.content}</p>
    </article>
  );
}

export default ReviewDetailsPage;
