import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = (isActive) =>
    `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? 'bg-primary-600 text-white shadow-sm'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-primary-600 text-white shadow-xl shadow-slate-200/20">
        <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-600 font-bold shadow-sm">MG</div>
            <div>
              <p className="text-base font-semibold">MiGanaderÍa</p>
              <p className="text-xs text-slate-200">Gestión de ganadería</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-wrap items-center gap-2 justify-center">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-100 hover:bg-slate-500/20 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/censo"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-100 hover:bg-slate-500/20 hover:text-white'
                }`
              }
            >
              Censo
            </NavLink>
          </nav>

          <div className="hidden items-center gap-3 lg:flex lg:justify-end">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.fullName}</p>
              <p className="text-xs text-slate-200">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-2 text-white shadow-sm lg:hidden"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/20 bg-primary-600 px-4 py-4 lg:hidden">
            <div className="space-y-3">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-100 hover:bg-slate-500/20 hover:text-white'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/censo"
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-100 hover:bg-slate-500/20 hover:text-white'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                Censo
              </NavLink>
            </div>
            <div className="mt-4 rounded-3xl border border-white/20 bg-white/10 p-4 text-sm text-slate-100">
              <p className="font-semibold text-white">{user?.fullName}</p>
              <p className="mt-1 text-xs text-slate-200">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-slate-100 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
