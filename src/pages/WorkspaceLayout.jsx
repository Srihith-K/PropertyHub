import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Building2, LayoutDashboard, Wrench, CalendarDays, Menu, X, LogOut, UserRound } from 'lucide-react';
import './Dashboard.css';

export default function WorkspaceLayout({ children, title }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  let user = {};
  try { user = JSON.parse(sessionStorage.getItem('user') || '{}'); } catch { user = {}; }
  const initials = (user.name || 'PH').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const items = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Amenities & Bookings', path: '/amenities', icon: CalendarDays },
    { label: 'My Profile', path: '/profile', icon: UserRound }
  ];
  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="ph-dashboard">
      <aside className={`ph-sidebar ${menuOpen ? 'ph-sidebar-open' : ''}`}>
        <div className="ph-brand">
          <div className="ph-brand-icon"><Building2 size={23} /></div>
          <span>Property<span>Hub</span></span>
          <button className="ph-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={21} /></button>
        </div>
        <div className="ph-nav-label">WORKSPACE</div>
        <nav className="ph-navigation">
          {items.map(({label,path,icon:Icon}) => (
            <NavLink key={path} to={path} end={path === '/dashboard'} onClick={() => setMenuOpen(false)} className={({isActive}) => `ph-nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="ph-sidebar-bottom">
          <div className="ph-sidebar-help-icon"><Building2 size={19} /></div>
          <div><strong>PropertyHub</strong><p>Property operations workspace.</p></div>
        </div>
      </aside>
      {menuOpen && <button className="ph-sidebar-overlay" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
      <main className="ph-main">
        <header className="ph-topbar">
          <button className="ph-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={22} /></button>
          <div className="ph-breadcrumb">Workspace <span>/</span> <strong>{title}</strong></div>
          <div className="ph-topbar-right">
            <span className="ph-live-indicator"><span /> Live monitoring</span>
            <button className="ph-user-button" onClick={() => navigate('/profile')} title="View profile"><div className="ph-avatar">{initials}</div><span>{user.name || 'Profile'}</span></button>
            <button className="ph-signout" onClick={logout}><LogOut size={15}/> Sign out</button>
          </div>
        </header>
        <div className="ph-content ph-operations-content">{children}</div>
      </main>
    </div>
  );
}
