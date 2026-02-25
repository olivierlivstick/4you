import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Démonstration', exact: true },
  { to: '/about', label: 'Qui sommes nous' },
  { to: '/tech', label: 'Techniquement' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: '#0F0C29' }}>
      {/* Gradient accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: 'linear-gradient(90deg, #6C3AED 0%, #A855F7 45%, #F472B6 75%, #EC4899 100%)' }}
      />
      <div className="w-full px-8 h-14 flex items-center justify-between">
        {/* Text wordmark — logo SVG is featured large in the hero */}
        <NavLink to="/" className="no-underline flex items-center gap-0.5 select-none">
          <span
            className="font-black text-2xl leading-none"
            style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #F472B6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
          >
            4
          </span>
          <span
            className="font-light text-2xl leading-none tracking-tight"
            style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            you
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {NAV.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className="px-4 py-2 rounded-full text-sm transition-all no-underline"
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(108,58,237,0.55), rgba(244,114,182,0.35))',
                      color: 'rgba(255,255,255,0.95)',
                      fontWeight: 600,
                      border: '1px solid rgba(168,85,247,0.35)',
                    }
                  : {
                      color: 'rgba(255,255,255,0.45)',
                      fontWeight: 400,
                      border: '1px solid transparent',
                    }
              }
              onMouseEnter={(e) => { if (!e.currentTarget.dataset.active) e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              onMouseLeave={(e) => { if (!e.currentTarget.dataset.active) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              {label}
            </NavLink>
          ))}

          {/* Separator */}
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Back office link */}
          <NavLink
            to="/backoffice"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all no-underline"
            style={({ isActive }) =>
              isActive
                ? { background: 'linear-gradient(135deg, rgba(108,58,237,0.55), rgba(244,114,182,0.35))', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(168,85,247,0.35)', fontWeight: 600 }
                : { color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 400 }
            }
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
