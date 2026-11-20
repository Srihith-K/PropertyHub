
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock3,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">

      <section className="auth-brand-panel">
        <div className="brand-logo">
          <div className="brand-icon">
            <Building2 size={27} />
          </div>
          <span>PropertyHub</span>
        </div>

        <div className="brand-content">
          <span className="brand-eyebrow">
            PROPERTY MANAGEMENT PLATFORM
          </span>

          <h1>
            Property management,
            <span> made simpler.</span>
          </h1>

          <p>
            Manage maintenance requests, track progress
            and organize shared amenities from one place.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="feature-icon">
                <Clock3 size={21} />
              </div>
              <div>
                <strong>Real-time tracking</strong>
                <span>Stay updated on maintenance requests.</span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">
                <ShieldCheck size={21} />
              </div>
              <div>
                <strong>Organized management</strong>
                <span>Keep property activities in one place.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          © 2026 PropertyHub. All rights reserved.
        </div>

        <div className="brand-decoration decoration-one" />
        <div className="brand-decoration decoration-two" />
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-container">

          <div className="mobile-brand">
            <Building2 size={28} />
            <span>PropertyHub</span>
          </div>

          <div className="form-heading">
            <span className="form-eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>
              Enter your details to access PropertyHub.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-field">
              <label htmlFor="login-email">Email address</label>

              <div className="input-wrapper">
                <Mail size={19} />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>

              <div className="input-wrapper">
                <Lock size={19} />
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="form-error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="auth-switch">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </div>

          <p className="form-bottom-note">
            Secure property management with PropertyHub.
          </p>

        </div>
      </section>

    </main>
  );
}
