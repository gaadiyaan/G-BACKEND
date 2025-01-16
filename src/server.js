const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'https://gaadiyaan.com',
        'http://gaadiyaan.com',
        'https://www.gaadiyaan.com',
        'http://www.gaadiyaan.com',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5506',
        'http://127.0.0.1:5506'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: true,
    exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Enable CORS for static files
const staticFileOptions = {
    setHeaders: (res, path, stat) => {
        res.set('Access-Control-Allow-Origin', 'https://gaadiyaan.com');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Allow-Credentials', 'true');
    }
};

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, '../../uploads');
console.log('Uploads directory path:', uploadsPath);
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath, staticFileOptions));

// Serve static assets
const assetsPath = path.join(__dirname, 'assets');
console.log('Assets directory path:', assetsPath);
if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
}
app.use('/assets', express.static(assetsPath, staticFileOptions));

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


