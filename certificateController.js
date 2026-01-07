const Certificate = require('../models/Certificate');
const xlsx = require('xlsx');

exports.uploadCertificates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an Excel file' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return res.status(400).json({ error: 'The excel file is empty' });
    }

    // Validate headers
    const requiredHeaders = ['certificateId', 'studentName', 'internshipDomain', 'startDate', 'endDate'];
    const firstRow = data[0];
    const hasAllHeaders = requiredHeaders.every(header => header in firstRow);

    if (!hasAllHeaders) {
      return res.status(400).json({ 
        error: `Invalid file format. Ensure headers are: ${requiredHeaders.join(', ')}` 
      });
    }

    // Use bulkWrite for efficiency and to handle duplicates
    const operations = data.map(cert => ({
      updateOne: {
        filter: { certificateId: cert.certificateId },
        update: { $set: cert },
        upsert: true
      }
    }));

    await Certificate.bulkWrite(operations);

    res.status(201).json({ 
      message: 'Certificates processed successfully', 
      count: data.length 
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Error processing Excel file' });
  }
};

exports.getCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.id });
    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found. Please check the ID.' });
    }
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Server error tracking certificate' });
  }
};

exports.getAllCertificates = async (req, res) => {
    try {
        const certs = await Certificate.find().sort({ issuedAt: -1 }).limit(100);
        res.json(certs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteCertificate = async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
