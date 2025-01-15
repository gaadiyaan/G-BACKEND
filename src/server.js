const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Most permissive CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: '*',
    credentials: true
}));

// Additional CORS headers for absolute certainty
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
const vehicleRoutes = require('./routes/vehicle.routes');
app.use('/api/vehicles', vehicleRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Gaadiyaan API',
    env: process.env.NODE_ENV,
    database: process.env.DB_HOST ? 'configured' : 'not configured'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express app
module.exports = app;