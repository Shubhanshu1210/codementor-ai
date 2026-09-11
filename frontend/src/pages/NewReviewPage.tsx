import Editor from '@monaco-editor/react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/client';
import { submitReview } from '../api/reviewApi';

const languageOptions = [
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
] as const;

const starterCode: Record<string, string> = {
  java: `public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  typescript: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  python: `def greet(name: str) -> str:
    return f"Hello, {name}!"


print(greet("World"))`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main(void) {
    printf("Hello World\\n");
    return 0;
}`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}`,
  rust: `fn main() {
    println!("Hello World");
}`,
  sql: `SELECT id, name
FROM users
WHERE active = true
ORDER BY name;`,
};

interface FormErrors {
  fileName?: string;
  language?: string;
  code?: string;
}

function NewReviewPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(starterCode.java);
  const [hasEditedCode, setHasEditedCode] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    if (!hasEditedCode) {
      setCode(starterCode[nextLanguage]);
    }
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!fileName.trim()) {
      nextErrors.fileName = 'File name is required.';
    }
    if (!language) {
      nextErrors.language = 'Select a programming language.';
    }
    if (!code.trim()) {
      nextErrors.code = 'Add some code before submitting.';
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
      const review = await submitReview({
        fileName: fileName.trim(),
        language,
        code,
      });
      navigate(`/review/${review.reviewId}`);
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Unable to complete the review right now. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-frame py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link className="focus-ring rounded text-sm font-medium text-slate-400 transition hover:text-cyan-300" to="/dashboard">← Back to Dashboard</Link>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">AI code review</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">New Code Review</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Submit a source file and let CodeMentor AI surface bugs, risks, and opportunities to improve.</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="surface grid gap-5 rounded-xl p-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="review-file-name">File name</label>
            <input className="field-control px-4 py-3 placeholder:text-slate-600" id="review-file-name" placeholder="Example.java" value={fileName} onChange={(event) => setFileName(event.target.value)} aria-invalid={Boolean(errors.fileName)} aria-describedby={errors.fileName ? 'review-file-name-error' : undefined} />
            {errors.fileName && <p className="mt-2 text-sm text-rose-300" id="review-file-name-error">{errors.fileName}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="review-language">Language</label>
            <select className="field-control appearance-none px-4 py-3" id="review-language" value={language} onChange={(event) => handleLanguageChange(event.target.value)} aria-invalid={Boolean(errors.language)} aria-describedby={errors.language ? 'review-language-error' : undefined}>
              {languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {errors.language && <p className="mt-2 text-sm text-rose-300" id="review-language-error">{errors.language}</p>}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-700/80 bg-[#0b1120] shadow-2xl shadow-slate-950/30">
          <div className="flex items-center justify-between border-b border-slate-700/80 bg-slate-900/70 px-4 py-3 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Source code</h2>
              <p className="mt-1 text-xs text-slate-500">Edit the starter code or paste your own implementation.</p>
            </div>
            <span className="hidden rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-500 sm:inline">{language}</span>
          </div>
          <div className="h-[min(55vh,560px)] min-h-[320px] w-full">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => {
                setCode(value ?? '');
                setHasEditedCode(true);
              }}
              options={{
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: 'on',
                minimap: { enabled: false },
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>
          {errors.code && <p className="border-t border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300" id="review-code-error">{errors.code}</p>}
        </section>

        {apiError && <div className="rounded-lg border border-rose-400/30 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200" role="alert">{apiError}</div>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link className="focus-ring rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white" to="/dashboard">Cancel</Link>
          <button className="primary-button focus-ring px-5 py-3 text-sm" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Analyzing your code with Gemini...' : 'Review Code with AI'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewReviewPage;
