import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return <div className="flex min-h-[calc(100vh-73px)] items-center justify-center text-sm text-slate-400">Loading workspace...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = (): LoginErrors => {
    const nextErrors: LoginErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      nextErrors.password = 'Password is required.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setApiError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      const state = location.state as { from?: { pathname: string; search?: string; hash?: string } } | null;
      const destination = state?.from
        ? `${state.from.pathname}${state.from.search ?? ''}${state.from.hash ?? ''}`
        : '/dashboard';
      navigate(destination, { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Unable to sign in. Check your credentials and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-frame flex min-h-[calc(100vh-73px)] items-center py-8 sm:py-12">
      <div className="surface grid w-full overflow-hidden rounded-2xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-between border-r border-slate-800 bg-cyan-400/[0.04] p-10 md:flex lg:p-14">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">CodeMentor AI</p>
            <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">Sharper code starts with a second pair of eyes.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">Review your code with focused feedback on bugs, security, performance, and maintainability.</p>
          </div>
          <p className="text-sm text-slate-500">Your private developer workspace.</p>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8">
            <p className="text-sm font-medium text-cyan-300 md:hidden">CodeMentor AI</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to continue to your workspace.</p>
          </div>

          {apiError && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200" role="alert">{apiError}</div>}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="login-email">Email address</label>
              <input
                className="field-control px-4 py-3 placeholder:text-slate-600"
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
              {errors.email && <p className="mt-2 text-sm text-rose-300" id="login-email-error">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="login-password">Password</label>
              <input
                className="field-control px-4 py-3 placeholder:text-slate-600"
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
              />
              {errors.password && <p className="mt-2 text-sm text-rose-300" id="login-password-error">{errors.password}</p>}
            </div>

            <button className="primary-button focus-ring w-full px-4 py-3" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            New to CodeMentor AI? <Link className="focus-ring rounded text-cyan-300 hover:text-cyan-200" to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
