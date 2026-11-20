
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
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
      const response = await api.post('/auth/register', form);

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
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
            Everything about
            <span> your property, organized.</span>
          </h1>

          <p>
            Connect tenants and property owners through
            transparent maintenance tracking and amenity
            management.
          </p>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="feature-icon">
                <Building2 size={21} />
              </div>
              <div>
                <strong>One central platform</strong>
                <span>Organize property-related information.</span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">
                <Lock size={21} />
              </div>
              <div>
                <strong>Simple account access</strong>
                <span>Access the platform using your account.</span>
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
        <div className="auth-form-container register-container">

          <div className="mobile-brand">
            <Building2 size={28} />
            <span>PropertyHub</span>
          </div>

          <div className="form-heading">
            <span className="form-eyebrow">GET STARTED</span>
            <h2>Create your account</h2>
            <p>
              Enter your details to join PropertyHub.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-field">
              <label htmlFor="register-name">Full name</label>
              <div className="input-wrapper">
                <User size={19} />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-email">Email address</label>
              <div className="input-wrapper">
                <Mail size={19} />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-phone">Phone number</label>
              <div className="input-wrapper">
                <Phone size={19} />
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-role">Account type</label>
              <div className="select-wrapper">
                <select
                  id="register-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select account type</option>
                  <option value="tenant">Tenant</option>
                  <option value="owner">Property Owner</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-password">Password</label>
              <div className="input-wrapper">
                <Lock size={19} />
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              <span className="field-hint">
                Password must contain at least 8 characters.
              </span>
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
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

          <p className="form-bottom-note">
            Welcome to PropertyHub.
          </p>

        </div>
      </section>

    </main>
  );
}
