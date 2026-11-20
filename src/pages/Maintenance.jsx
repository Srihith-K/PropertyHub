import WorkspaceLayout from './WorkspaceLayout';

import { useEffect, useState } from 'react';
import {
  Wrench,
  Plus,
  RefreshCw,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays
} from 'lucide-react';

import api from '../services/api';

export default function Maintenance() {
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isOwner = currentUser.role === 'owner';
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    propertyId: '',
    issueDescription: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get('/maintenance');
      setRequests(response.data.requests || response.data.data?.requests || []);
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load maintenance requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const timer = setInterval(() => fetchRequests(true), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/maintenance', form);

      setForm({
        propertyId: '',
        issueDescription: ''
      });

      setSuccess('Maintenance request created successfully!');
      await fetchRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to create maintenance request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    setError('');
    setSuccess('');

    try {
      await api.patch(
        `/maintenance/${id}/status`,
        { status }
      );

      setSuccess('Maintenance status updated successfully!');
      await fetchRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update maintenance status.'
      );
    }
  };

  const pendingCount = requests.filter(
    (r) => r.status === 'Pending'
  ).length;

  const progressCount = requests.filter(
    (r) => r.status === 'In Progress'
  ).length;

  const completedCount = requests.filter(
    (r) => r.status === 'Completed'
  ).length;

  const filteredRequests = requests.filter((request) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || [
      request.requestId, request.propertyId, request.issueDescription
    ].some(value => String(value || '').toLowerCase().includes(term));
    return matchesSearch && (statusFilter === 'All' || request.status === statusFilter);
  });

  const getStatusClass = (status) => {
    if (status === 'Completed') return 'status-completed';
    if (status === 'In Progress') return 'status-progress';
    return 'status-pending';
  };

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <WorkspaceLayout title="Maintenance">
    <div className="maintenance-page">

      <div className="maintenance-heading">
        <div>
          <span className="maintenance-eyebrow">
            PROPERTY OPERATIONS
          </span>
          <h1>Maintenance Management</h1>
          <p>
            Create, track and manage property maintenance requests.
          </p>
        </div>

        <button
          className="maintenance-refresh"
          onClick={fetchRequests}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Overview */}

      <div className="maintenance-stats">

        <div className="maintenance-stat">
          <div className="stat-icon stat-blue">
            <ClipboardList size={22} />
          </div>
          <div>
            <span>Total Requests</span>
            <h2>{requests.length}</h2>
          </div>
        </div>

        <div className="maintenance-stat">
          <div className="stat-icon stat-orange">
            <Clock size={22} />
          </div>
          <div>
            <span>Pending</span>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="maintenance-stat">
          <div className="stat-icon stat-purple">
            <Wrench size={22} />
          </div>
          <div>
            <span>In Progress</span>
            <h2>{progressCount}</h2>
          </div>
        </div>

        <div className="maintenance-stat">
          <div className="stat-icon stat-green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span>Completed</span>
            <h2>{completedCount}</h2>
          </div>
        </div>

      </div>

      {/* Create Request */}

      <section className="maintenance-card">

        <div className="maintenance-card-heading">
          <div>
            <h2>Create Maintenance Request</h2>
            <p>Submit a new issue for a property.</p>
          </div>

          <div className="maintenance-heading-icon">
            <Plus size={21} />
          </div>
        </div>

        <form
          className="maintenance-form"
          onSubmit={handleSubmit}
        >

          <div className="maintenance-field">
            <label htmlFor="propertyId">Property ID</label>
            <input
              id="propertyId"
              name="propertyId"
              type="text"
              placeholder="Enter property ID"
              value={form.propertyId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="maintenance-field">
            <label htmlFor="issueDescription">
              Issue Description
            </label>

            <textarea
              id="issueDescription"
              name="issueDescription"
              placeholder="Describe the maintenance issue..."
              value={form.issueDescription}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
              required
            />
          </div>

          {error && (
            <div className="maintenance-message error-message">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          {success && (
            <div className="maintenance-message success-message">
              <CheckCircle2 size={17} />
              {success}
            </div>
          )}

          <button
            type="submit"
            className="maintenance-submit"
            disabled={submitting}
          >
            <Plus size={18} />
            {submitting ? 'Creating...' : 'Create Request'}
          </button>

        </form>
      </section>

      {/* Request List */}

      <section className="maintenance-card request-list-card">

        <div className="maintenance-card-heading">
          <div>
            <h2>Maintenance Requests</h2>
            <p>View and update maintenance request statuses.</p>
          </div>
          <span className="request-count">{filteredRequests.length} of {requests.length} Requests</span>
        </div>
        <div className="maintenance-filters">
          <input aria-label="Search maintenance requests" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search request ID, property or issue..." />
          <select aria-label="Filter maintenance by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All statuses</option><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="maintenance-empty">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="maintenance-empty">
            <ClipboardList size={35} />
            <h3>No maintenance requests yet</h3>
            <p>Create your first maintenance request above.</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="maintenance-empty"><ClipboardList size={30}/><h3>No matching requests</h3><p>Try another search term or status filter.</p></div>
        ) : (
          <div className="maintenance-table-wrapper">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Property ID</th>
                  <th>Issue Description</th>
                  <th>Created Date</th>
                  <th>Resolution Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="request-id">
                      {request.requestId}
                    </td>

                    <td>{request.propertyId}</td>

                    <td className="request-description">
                      {request.issueDescription}
                    </td>

                    <td>
                      <span className="date-cell">
                        <CalendarDays size={14} />
                        {formatDate(request.createdAt)}
                      </span>
                    </td>

                    <td>
                      {formatDate(request.resolutionDate)}
                    </td>

                    <td>
                      <span className={`maintenance-status ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>

                    <td>
                      {isOwner ? (
                        <select
                          className="status-select"
                          value={request.status}
                          onChange={(e) => updateStatus(request._id, e.target.value)}
                          aria-label={`Update status for ${request.requestId}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : <span className="maintenance-readonly">Owner updates status</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>

    </div>
    </WorkspaceLayout>
  );
}
