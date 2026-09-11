import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/85 px-5 py-4 backdrop-blur sm:px-8">
        <nav className="page-frame">
          <div className="flex items-center justify-between gap-4">
            <Link className="focus-ring flex items-center gap-3" onClick={closeMenu} to="/dashboard">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300 font-bold text-slate-950 shadow-lg shadow-cyan-950/30">C</span>
              <span className="font-semibold tracking-tight text-white">CodeMentor AI</span>
            </Link>

            <button className="focus-ring rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 sm:hidden" aria-expanded={menuOpen} aria-controls="dashboard-navigation-mobile" onClick={() => setMenuOpen(!menuOpen)} type="button">{menuOpen ? 'Close' : 'Menu'}</button>

            <div className="hidden items-center gap-6 sm:flex" id="dashboard-navigation-desktop">
              <NavigationLinks onNavigate={closeMenu} />
              <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
                <span className="max-w-40 truncate text-sm text-slate-400" title={user?.email}>{user?.email}</span>
                <button className="focus-ring text-sm font-medium text-slate-300 transition hover:text-white" onClick={handleLogout} type="button">Logout</button>
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="mt-4 space-y-4 border-t border-slate-800 pt-4 sm:hidden" id="dashboard-navigation-mobile">
              <NavigationLinks onNavigate={closeMenu} />
              <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-4">
                <span className="truncate text-sm text-slate-400">{user?.email}</span>
                <button className="focus-ring text-sm font-medium text-slate-300" onClick={handleLogout} type="button">Logout</button>
              </div>
            </div>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

function NavigationLinks({ onNavigate }: { onNavigate: () => void }) {
  const linkClass = ({ isActive }: { isActive: boolean }) => `focus-ring relative text-sm font-medium transition ${isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-white'}`;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <NavLink className={linkClass} onClick={onNavigate} to="/dashboard">Dashboard</NavLink>
      <NavLink className={linkClass} onClick={onNavigate} to="/review/new">New Review</NavLink>
    </div>
  );
}

export default AppShell;
