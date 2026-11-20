require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const amenityRoutes = require('./routes/amenityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors({
  origin(origin, callback) {
    // Allow local Vite development ports and the configured deployed client.
    const localOrigin = !origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    const configuredOrigin = process.env.CLIENT_URL && origin === process.env.CLIENT_URL;
    callback(null, localOrigin || configuredOrigin);
  },
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to PropertyHub API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, server: 'Running', database: 'Connected' });
});

app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/bookings', bookingRoutes);

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'YOUR_GENERATED_SECRET') {
      throw new Error('Configure a secure JWT_SECRET in .env');
    }
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`PropertyHub API running on port ${PORT}`));
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
