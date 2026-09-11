import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewReviewPage from './pages/NewReviewPage';
import ReviewDetailsPage from './pages/ReviewDetailsPage';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {isAuthPage && <header className="border-b border-slate-800/80 bg-slate-950/80 px-5 py-4 backdrop-blur sm:px-8"><nav className="page-frame flex items-center justify-between"><Link className="focus-ring flex items-center gap-3 font-semibold tracking-tight text-white" to="/dashboard"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300 font-bold text-slate-950">C</span>CodeMentor AI</Link><span className="text-xs uppercase tracking-[0.16em] text-slate-500">Developer workspace</span></nav></header>}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/review/new" element={<NewReviewPage />} />
            <Route path="/review/:id" element={<ReviewDetailsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </main>
  );
}

export default App;
