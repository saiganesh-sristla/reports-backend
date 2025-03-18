// controllers/reportController.js
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');

// @desc    Upload report
// @route   POST /api/upload
// @access  Private
exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Get file details
    const file = req.file;
    const fileSize = file.size;
    const fileType = path.extname(file.originalname).substring(1);

    // Create report in database
    const report = await Report.create({
      title: req.body.title,
      description: req.body.description,
      fileName: file.filename,
      fileType: fileType,
      filePath: file.path,
      fileSize: fileSize,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: report
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to access this report' });
    }

    // Send file
    res.sendFile(path.resolve(report.filePath));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this report' });
    }

    // Delete file from filesystem
    fs.unlink(report.filePath, async (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }

      // Delete report from database
      await report.deleteOne();

      res.json({ message: 'Report removed' });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};