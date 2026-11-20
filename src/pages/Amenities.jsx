import WorkspaceLayout from './WorkspaceLayout';

import { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  CalendarDays,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function Amenities() {
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isOwner = currentUser.role === 'owner';
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    name: '',
    propertyId: '',
    description: ''
  });

  const [bookingForm, setBookingForm] = useState({
    amenityId: '',
    propertyId: '',
    bookingDate: '',
    checkInTime: '',
    checkOutTime: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amenitySearch, setAmenitySearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const [amenityResponse, bookingResponse] =
        await Promise.all([
          api.get('/amenities'),
          api.get('/bookings')
        ]);

      setAmenities(amenityResponse.data.amenities || []);
      setBookings(bookingResponse.data.bookings || []);

      setError('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load amenity information.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => loadData(true), 5000);
    return () => clearInterval(timer);
  }, []);

  const createAmenity = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/amenities', form);

      setForm({
        name: '',
        propertyId: '',
        description: ''
      });

      setSuccess('Amenity created successfully!');
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to create amenity.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/bookings', bookingForm);

      setBookingForm({
        amenityId: '',
        propertyId: '',
        bookingDate: '',
        checkInTime: '',
        checkOutTime: ''
      });

      setSuccess('Amenity booked successfully!');
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to create booking.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateBooking = async (id, status) => {
    setError('');
    setSuccess('');

    try {
      await api.patch(`/bookings/${id}/status`, { status });

      setSuccess('Booking status updated successfully!');
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update booking.'
      );
    }
  };

  const updateAvailability = async (id, availabilityStatus) => {
    try {
      await api.patch(`/amenities/${id}/availability`, {
        availabilityStatus
      });

      setSuccess('Amenity availability updated!');
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update availability.'
      );
    }
  };

  const filteredAmenities = amenities.filter(item =>
    `${item.name} ${item.propertyId} ${item.description}`.toLowerCase().includes(amenitySearch.toLowerCase())
  );
  const filteredBookings = bookings.filter(item =>
    bookingStatusFilter === 'All' || item.status === bookingStatusFilter
  );

  const selectedAmenity = amenities.find(
    item => item._id === bookingForm.amenityId
  );

  const formatDate = date =>
    date
      ? new Date(date).toLocaleDateString('en-IN')
      : '—';

  return (
    <WorkspaceLayout title="Amenities">
    <main className="amenities-page">

      <header className="amenities-header">
        <div>
          <span className="amenities-eyebrow">
            PROPERTY OPERATIONS
          </span>
          <h1>Amenity Management</h1>
          <p>
            Manage shared amenities, availability and bookings.
          </p>
        </div>

        <button
          className="amenity-refresh"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="amenity-alert amenity-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="amenity-alert amenity-success">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Amenity overview */}

      <section className="amenity-grid">

        <div className="amenity-stat">
          <Building2 size={23} />
          <div>
            <span>Total Amenities</span>
            <h2>{amenities.length}</h2>
          </div>
        </div>

        <div className="amenity-stat available-stat">
          <CheckCircle2 size={23} />
          <div>
            <span>Available</span>
            <h2>
              {amenities.filter(
                a => a.availabilityStatus === 'Available'
              ).length}
            </h2>
          </div>
        </div>

        <div className="amenity-stat">
          <CalendarDays size={23} />
          <div>
            <span>Total Bookings</span>
            <h2>{bookings.length}</h2>
          </div>
        </div>

      </section>

      {/* Owners manage the amenity catalogue */}

      {isOwner && <section className="amenity-panel">
        <div className="amenity-panel-title">
          <div>
            <h2>Add Amenity</h2>
            <p>Add shared facilities for a property.</p>
          </div>
          <Plus size={22} />
        </div>

        <form onSubmit={createAmenity} className="amenity-form">

          <div>
            <label>Amenity Name</label>
            <input
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="e.g. Swimming Pool"
              required
            />
          </div>

          <div>
            <label>Property ID</label>
            <input
              value={form.propertyId}
              onChange={e =>
                setForm({ ...form, propertyId: e.target.value })
              }
              placeholder="Enter property ID"
              required
            />
          </div>

          <div>
            <label>Description</label>
            <input
              value={form.description}
              onChange={e =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
              placeholder="Enter description"
            />
          </div>

          <button disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Amenity'}
          </button>

        </form>
      </section>}

      {/* Amenity availability */}

      <section className="amenity-panel">
        <div className="amenity-panel-title">
          <div>
            <h2>Amenity Availability</h2>
            <p>View facilities and their current availability.</p>
          </div>
        </div>
        <div className="maintenance-filters">
          <input aria-label="Search amenities" value={amenitySearch} onChange={e => setAmenitySearch(e.target.value)} placeholder="Search amenities or property..." />
        </div>

        {loading ? (
          <p>Loading amenities...</p>
        ) : amenities.length === 0 ? (
          <div className="amenity-empty">
            <Building2 size={35} />
            <h3>No amenities available</h3>
            <p>Add your first amenity above.</p>
          </div>
        ) : (
          <div className="amenity-cards">
            {filteredAmenities.map(item => (
              <article className="amenity-card" key={item._id}>
                <div className="amenity-card-icon">
                  <Building2 size={24} />
                </div>

                <h3>{item.name}</h3>
                <p>{item.description || 'Shared property facility'}</p>

                <span className={
                  item.availabilityStatus === 'Available'
                    ? 'amenity-available'
                    : 'amenity-unavailable'
                }>
                  {item.availabilityStatus}
                </span>

                <p className="amenity-property">
                  Property: {item.propertyId}
                </p>

                {isOwner && <button
                  type="button"
                  className="amenity-toggle"
                  onClick={() => updateAvailability(
                    item._id,
                    item.availabilityStatus === 'Available'
                      ? 'Unavailable'
                      : 'Available'
                  )}
                >
                  {item.availabilityStatus === 'Available'
                    ? 'Mark Unavailable'
                    : 'Mark Available'}
                </button>}
              </article>
            ))}
            {filteredAmenities.length === 0 && <p className="amenity-empty">No amenities match your search.</p>}
          </div>
        )}
      </section>

      {/* Booking form */}

      <section className="amenity-panel">
        <div className="amenity-panel-title">
          <div>
            <h2>Book an Amenity</h2>
            <p>Select a facility, date and time slot.</p>
          </div>
          <CalendarDays size={23} />
        </div>

        <form onSubmit={createBooking} className="amenity-form">

          <div>
            <label>Select Amenity</label>
            <select
              value={bookingForm.amenityId}
              onChange={e => {
                const amenity = amenities.find(
                  a => a._id === e.target.value
                );

                setBookingForm({
                  ...bookingForm,
                  amenityId: e.target.value,
                  propertyId: amenity?.propertyId || ''
                });
              }}
              required
            >
              <option value="">Choose amenity</option>
              {amenities
                .filter(a => a.availabilityStatus === 'Available')
                .map(a => (
                  <option key={a._id} value={a._id}>
                    {a.name} - {a.propertyId}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Booking Date</label>
            <input
              type="date"
              min={new Date().toLocaleDateString('en-CA')}
              value={bookingForm.bookingDate}
              onChange={e =>
                setBookingForm({
                  ...bookingForm,
                  bookingDate: e.target.value
                })
              }
              required
            />
          </div>

          <div>
            <label>Check-in Time</label>
            <input
              type="time"
              value={bookingForm.checkInTime}
              onChange={e =>
                setBookingForm({
                  ...bookingForm,
                  checkInTime: e.target.value
                })
              }
              required
            />
          </div>

          <div>
            <label>Check-out Time</label>
            <input
              type="time"
              value={bookingForm.checkOutTime}
              onChange={e =>
                setBookingForm({
                  ...bookingForm,
                  checkOutTime: e.target.value
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedAmenity}
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>

        </form>
      </section>

      {/* Booking overview */}

      <section className="amenity-panel">
        <div className="amenity-panel-title">
          <div>
            <h2>Amenity Bookings</h2>
            <p>Monitor booking and check-in/check-out status.</p>
          </div>
          <Clock size={22} />
        </div>
        <div className="maintenance-filters">
          <select aria-label="Filter bookings by status" value={bookingStatusFilter} onChange={e => setBookingStatusFilter(e.target.value)}>
            <option value="All">All booking statuses</option><option value="Booked">Booked</option><option value="Checked In">Checked In</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {bookings.length === 0 ? (
          <div className="amenity-empty">
            <CalendarDays size={34} />
            <h3>No bookings yet</h3>
            <p>Your bookings will appear here.</p>
          </div>
        ) : (
          <div className="amenity-table-wrap">
            <table className="amenity-table">
              <thead>
                <tr>
                  <th>Amenity</th>
                  <th>Property ID</th>
                  <th>Date</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.amenityId?.name || 'Amenity'}</td>
                    <td>{booking.propertyId}</td>
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td>{booking.checkInTime}</td>
                    <td>{booking.checkOutTime}</td>
                    <td>{booking.status}</td>
                    <td>
                      {isOwner ? (
                        <select
                          value={booking.status}
                          onChange={e => updateBooking(booking._id, e.target.value)}
                        >
                          <option value="Booked">Booked</option>
                          <option value="Checked In">Checked In</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : <span className="maintenance-readonly">Owner manages status</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && <p className="amenity-empty">No bookings match this status.</p>}
          </div>
        )}
      </section>

    </main>
    </WorkspaceLayout>
  );
}
