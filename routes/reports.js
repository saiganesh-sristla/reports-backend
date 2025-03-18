// routes/reports.js
const express = require('express');
const router = express.Router();
const { 
  uploadReport, 
  getReports, 
  getReport, 
  deleteReport 
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST route for uploading reports - map to /api/upload
router.post('/', protect, authorize('admin'), upload.single('file'), uploadReport);

// Routes for managing reports - map to /api/reports
router.get('/', protect, authorize('admin'), getReports);
router.get('/:id', protect, authorize('admin'), getReport);
router.delete('/:id', protect, authorize('admin'), deleteReport);

module.exports = router;