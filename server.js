const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const certificateController = require('./controllers/certificateController');
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/auth');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Public Routes
app.get('/api/certificates/:id', certificateController.getCertificate);
app.post('/api/auth/login', authController.login);

// Protected Admin Routes
app.post('/api/certificates/upload', authMiddleware, upload.single('file'), certificateController.uploadCertificates);
app.get('/api/certificates', authMiddleware, certificateController.getAllCertificates);
app.delete('/api/certificates/:id', authMiddleware, certificateController.deleteCertificate);

// Serve Static Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    authController.seedAdmin(); // Ensure admin exists
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
