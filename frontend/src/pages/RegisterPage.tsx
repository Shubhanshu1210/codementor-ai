import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function RegisterPage() {
  const { isAuthenticated, loading, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return <div className="flex min-h-[calc(100vh-73px)] items-center justify-center text-sm text-slate-400">Loading workspace...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = (): RegisterErrors => {
    const nextErrors: RegisterErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    return nextErrors;
  };

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
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
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Unable to create your account. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-frame flex min-h-[calc(100vh-73px)] items-center py-8 sm:py-12">
      <div className="surface grid w-full overflow-hidden rounded-2xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden flex-col justify-between border-r border-slate-800 bg-cyan-400/[0.04] p-10 md:flex lg:p-14">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">Start reviewing</p>
            <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">Turn code uncertainty into clear next steps.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">Create your workspace and get focused, practical insight from CodeMentor AI.</p>
          </div>
          <p className="text-sm text-slate-500">Built for thoughtful engineering.</p>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8">
            <p className="text-sm font-medium text-cyan-300 md:hidden">CodeMentor AI</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Create your account</h2>
            <p className="mt-2 text-sm text-slate-400">Set up your private code review workspace.</p>
          </div>

          {apiError && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200" role="alert">{apiError}</div>}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <FormField id="register-name" label="Name" type="text" autoComplete="name" value={form.name} error={errors.name} onChange={(value) => updateField('name', value)} />
            <FormField id="register-email" label="Email address" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(value) => updateField('email', value)} />
            <FormField id="register-password" label="Password" type="password" autoComplete="new-password" value={form.password} error={errors.password} onChange={(value) => updateField('password', value)} />
            <FormField id="register-confirm-password" label="Confirm password" type="password" autoComplete="new-password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(value) => updateField('confirmPassword', value)} />

            <button className="primary-button focus-ring mt-2 w-full px-4 py-3" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account? <Link className="focus-ring rounded text-cyan-300 hover:text-cyan-200" to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function FormField({ id, label, type, autoComplete, value, error, onChange }: { id: string; label: string; type: string; autoComplete: string; value: string; error?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor={id}>{label}</label>
      <input
        className="field-control px-4 py-3 placeholder:text-slate-600"
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p className="mt-2 text-sm text-rose-300" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

export default RegisterPage;
