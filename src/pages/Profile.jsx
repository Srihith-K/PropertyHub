import { useEffect, useState } from 'react';
import { UserRound, Mail, Phone, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import WorkspaceLayout from './WorkspaceLayout';
import api from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}'); }
    catch { return {}; }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/auth/me');
      const current = response.data.user || user;
      setUser(current);
      sessionStorage.setItem('user', JSON.stringify(current));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to refresh profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const initials = (user.name || 'PH').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <WorkspaceLayout title="Profile">
      <section className="profile-page">
        <header className="profile-heading">
          <div><span className="maintenance-eyebrow">ACCOUNT</span><h1>My Profile</h1><p>View your PropertyHub account information.</p></div>
          <button className="maintenance-refresh" onClick={loadProfile} disabled={loading}><RefreshCw size={16}/> Refresh</button>
        </header>
        {error && <div className="maintenance-message error-message"><AlertCircle size={17}/>{error}</div>}
        <article className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-main"><h2>{user.name || 'PropertyHub User'}</h2><span className={`profile-role ${user.role === 'owner' ? 'owner' : ''}`}>{user.role === 'owner' ? 'Property Owner' : 'Tenant'}</span></div>
          {loading && <span className="profile-loading">Refreshing…</span>}
          <div className="profile-details">
            <div><Mail size={19}/><span><small>Email address</small><strong>{user.email || 'Not available'}</strong></span></div>
            <div><Phone size={19}/><span><small>Phone number</small><strong>{user.phone || 'Not provided'}</strong></span></div>
            <div><ShieldCheck size={19}/><span><small>Account role</small><strong>{user.role || 'Not available'}</strong></span></div>
            <div><UserRound size={19}/><span><small>Account ID</small><strong>{user.id || user._id || 'Not available'}</strong></span></div>
          </div>
          <p className="profile-note">Your account details are displayed from your authenticated PropertyHub profile.</p>
        </article>
      </section>
    </WorkspaceLayout>
  );
}
