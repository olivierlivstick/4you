import { NavLink } from 'react-router-dom';
import Logo from '../ui/Logo';

const NAV = [
  { to: '/', label: 'Démonstration', exact: true },
  { to: '/about', label: 'Qui sommes nous' },
  { to: '/tech', label: 'Techniquement' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="no-underline transition-transform hover:scale-105 active:scale-95">
          <Logo />
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="w-px h-5 mx-2 bg-slate-200" />

          {/* Back office link */}
          <NavLink
            to="/backoffice"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                ? 'bg-secondary-50 text-secondary-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
