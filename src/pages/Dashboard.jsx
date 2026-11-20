
import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  Wrench,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  Menu,
  X,
  Activity,
  CalendarCheck,
  CircleDot,
  UserRound
} from 'lucide-react';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const initials = (currentUser.name || 'PropertyHub').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const handleLogout = () => { sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/login'); };
  const [maintenance, setMaintenance] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadDashboard = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);

    try {
      const [maintenanceRes, bookingsRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/bookings')
      ]);

      const maintenanceData = maintenanceRes.data;
      const bookingData = bookingsRes.data;

      setMaintenance(
        Array.isArray(maintenanceData)
          ? maintenanceData
          : maintenanceData?.requests || maintenanceData?.data?.requests || []
      );

      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : bookingData?.bookings || bookingData?.data?.bookings || []
      );

      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not load dashboard data. Please check your connection.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  const pending = maintenance.filter(
    item => item.status === 'Pending'
  ).length;

  const inProgress = maintenance.filter(
    item => item.status === 'In Progress'
  ).length;

  const completed = maintenance.filter(
    item => item.status === 'Completed'
  ).length;

  const activeBookings = bookings.filter(
    item => ['Booked', 'Checked In'].includes(item.status)
  ).length;

  const completionRate = maintenance.length
    ? Math.round((completed / maintenance.length) * 100)
    : 0;

  const formatDate = value => {
    if (!value) return 'Date unavailable';

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? 'Date unavailable'
      : date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
  };

  const statusClass = status =>
    (status || 'unknown').toLowerCase().replace(/\s+/g, '-');

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Amenities & Bookings', path: '/amenities', icon: CalendarDays },
    { label: 'My Profile', path: '/profile', icon: UserRound }
  ];

  return (
    <div className="ph-dashboard">
      <aside className={`ph-sidebar ${mobileMenuOpen ? 'ph-sidebar-open' : ''}`}>
        <div className="ph-brand">
          <div className="ph-brand-icon"><Building2 size={23} /></div>
          <span>Property<span>Hub</span></span>
          <button
            className="ph-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>
        </div>

        <div className="ph-nav-label">WORKSPACE</div>

        <nav className="ph-navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `ph-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === 'Maintenance' && pending > 0 && (
                <span className="ph-nav-count">{pending}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ph-sidebar-bottom">
          <div className="ph-sidebar-help-icon">
            <Activity size={19} />
          </div>
          <div>
            <strong>PropertyHub</strong>
            <p>Property management made simpler.</p>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="ph-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="ph-main">
        <header className="ph-topbar">
          <button
            className="ph-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="ph-breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>

          <div className="ph-topbar-right">
            <span className="ph-live-indicator">
              <span /> Live monitoring
            </span>
            <Link className="ph-user-button" to="/profile" title="View profile"><div className="ph-avatar">{initials}</div><span>{currentUser.name || "Profile"}</span></Link><button className="ph-signout" onClick={handleLogout}>Sign out</button>
          </div>
        </header>

        <div className="ph-content">
          <section className="ph-welcome">
            <div>
              <div className="ph-eyebrow">PROPERTY OVERVIEW</div>
              <h1>Dashboard</h1>
              <p>Monitor maintenance activity and amenity bookings in one place.</p>
            </div>

            <button
              className="ph-refresh-button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
                className={refreshing ? 'ph-spin' : ''}
              />
              {refreshing ? 'Refreshing...' : 'Refresh data'}
            </button>
          </section>

          {error && (
            <div className="ph-error">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={() => loadDashboard(true)}>Try again</button>
            </div>
          )}

          <section className="ph-stats-grid">
            <article className="ph-stat-card ph-stat-primary">
              <div className="ph-stat-top">
                <div className="ph-stat-icon"><Wrench size={21} /></div>
                <span className="ph-stat-caption">ALL REQUESTS</span>
              </div>
              <div className="ph-stat-value">
                {loading ? '—' : maintenance.length}
              </div>
              <div className="ph-stat-bottom">
                <span>Total maintenance requests</span>
                <Link to="/maintenance" aria-label="View maintenance">
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </article>

            <article className="ph-stat-card">
              <div className="ph-stat-top">
                <div className="ph-stat-icon amber"><Clock3 size={21} /></div>
                <span className="ph-stat-caption">NEEDS ATTENTION</span>
              </div>
              <div className="ph-stat-value">
                {loading ? '—' : pending}
              </div>
              <div className="ph-stat-bottom">
                <span>Pending requests</span>
                <span className="ph-stat-dot amber-dot" />
              </div>
            </article>

            <article className="ph-stat-card">
              <div className="ph-stat-top">
                <div className="ph-stat-icon blue"><Activity size={21} /></div>
                <span className="ph-stat-caption">ONGOING WORK</span>
              </div>
              <div className="ph-stat-value">
                {loading ? '—' : inProgress}
              </div>
              <div className="ph-stat-bottom">
                <span>In progress</span>
                <span className="ph-stat-dot blue-dot" />
              </div>
            </article>

            <article className="ph-stat-card">
              <div className="ph-stat-top">
                <div className="ph-stat-icon green"><CheckCircle2 size={21} /></div>
                <span className="ph-stat-caption">RESOLVED</span>
              </div>
              <div className="ph-stat-value">
                {loading ? '—' : completed}
              </div>
              <div className="ph-stat-bottom">
                <span>Completed requests</span>
                <span className="ph-stat-dot green-dot" />
              </div>
            </article>

            <article className="ph-stat-card">
              <div className="ph-stat-top">
                <div className="ph-stat-icon violet"><CalendarCheck size={21} /></div>
                <span className="ph-stat-caption">AMENITIES</span>
              </div>
              <div className="ph-stat-value">
                {loading ? '—' : activeBookings}
              </div>
              <div className="ph-stat-bottom">
                <span>Active bookings</span>
                <Link to="/amenities" aria-label="View amenity bookings">
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </article>
          </section>

          <section className="ph-overview-grid">
            <article className="ph-panel ph-progress-panel">
              <div className="ph-panel-heading">
                <div>
                  <span className="ph-panel-kicker">PERFORMANCE</span>
                  <h2>Maintenance overview</h2>
                  <p>Current request completion progress</p>
                </div>
                <div className="ph-panel-icon"><Activity size={20} /></div>
              </div>

              <div className="ph-completion">
                <div className="ph-completion-number">
                  <strong>{loading ? '—' : `${completionRate}%`}</strong>
                  <span>completion rate</span>
                </div>
                <div className="ph-progress-track">
                  <div
                    className="ph-progress-fill"
                    style={{ width: `${loading ? 0 : completionRate}%` }}
                  />
                </div>
              </div>

              <div className="ph-progress-legend">
                <span><i className="legend-pending" /> Pending <b>{pending}</b></span>
                <span><i className="legend-progress" /> In progress <b>{inProgress}</b></span>
                <span><i className="legend-completed" /> Completed <b>{completed}</b></span>
              </div>

              <Link to="/maintenance" className="ph-panel-action">
                Manage maintenance <ArrowRight size={16} />
              </Link>
            </article>

            <article className="ph-panel ph-quick-panel">
              <div className="ph-panel-heading">
                <div>
                  <span className="ph-panel-kicker">QUICK ACCESS</span>
                  <h2>Manage your property</h2>
                  <p>Go directly to a workspace</p>
                </div>
                <div className="ph-panel-icon"><Building2 size={20} /></div>
              </div>

              <Link to="/maintenance" className="ph-quick-link">
                <div className="ph-quick-icon maintenance-icon"><Wrench size={20} /></div>
                <div>
                  <strong>Maintenance requests</strong>
                  <span>Create and track service requests</span>
                </div>
                <ArrowUpRight size={18} />
              </Link>

              <Link to="/amenities" className="ph-quick-link">
                <div className="ph-quick-icon amenity-icon"><CalendarDays size={20} /></div>
                <div>
                  <strong>Amenity management</strong>
                  <span>Check availability and bookings</span>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            </article>
          </section>

          <section className="ph-activity-grid">
            <article className="ph-panel ph-activity-panel">
              <div className="ph-activity-heading">
                <div>
                  <h2>Recent maintenance</h2>
                  <p>Latest maintenance request activity</p>
                </div>
                <Link to="/maintenance">View all <ArrowRight size={15} /></Link>
              </div>

              {loading ? (
                <div className="ph-empty-state">Loading requests...</div>
              ) : maintenance.length === 0 ? (
                <div className="ph-empty-state">
                  <div className="ph-empty-icon"><Wrench size={23} /></div>
                  <strong>No maintenance requests yet</strong>
                  <p>New maintenance requests will appear here.</p>
                  <Link to="/maintenance">Open maintenance <ArrowRight size={15} /></Link>
                </div>
              ) : (
                <div className="ph-table-wrap">
                  <table className="ph-table">
                    <thead>
                      <tr>
                        <th>REQUEST</th>
                        <th>PROPERTY</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenance.slice(0, 5).map(item => (
                        <tr key={item._id}>
                          <td>
                            <strong>{item.requestId || 'Maintenance request'}</strong>
                            <span>{item.issueDescription}</span>
                          </td>
                          <td>{item.propertyId || '—'}</td>
                          <td>{formatDate(item.createdAt)}</td>
                          <td>
                            <span className={`ph-status ${statusClass(item.status)}`}>
                              <CircleDot size={12} /> {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            <article className="ph-panel ph-activity-panel">
              <div className="ph-activity-heading">
                <div>
                  <h2>Recent amenity bookings</h2>
                  <p>Latest shared amenity activity</p>
                </div>
                <Link to="/amenities">View all <ArrowRight size={15} /></Link>
              </div>

              {loading ? (
                <div className="ph-empty-state">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="ph-empty-state">
                  <div className="ph-empty-icon violet"><CalendarDays size={23} /></div>
                  <strong>No amenity bookings yet</strong>
                  <p>New amenity bookings will appear here.</p>
                  <Link to="/amenities">Manage amenities <ArrowRight size={15} /></Link>
                </div>
              ) : (
                <div className="ph-booking-list">
                  {bookings.slice(0, 5).map(item => (
                    <div className="ph-booking-row" key={item._id}>
                      <div className="ph-booking-icon"><CalendarDays size={19} /></div>
                      <div className="ph-booking-info">
                        <strong>{item.amenityId?.name || 'Amenity booking'}</strong>
                        <span>{formatDate(item.bookingDate)}</span>
                        <small>{item.checkInTime} – {item.checkOutTime}</small>
                      </div>
                      <span className={`ph-status ${statusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>

          <footer className="ph-footer">
            <span>© {new Date().getFullYear()} PropertyHub</span>
            <span><span className="ph-footer-dot" /> Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
