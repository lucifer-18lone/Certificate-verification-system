const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    index: true 
  },
  studentName: { 
    type: String, 
    required: true 
  },
  internshipDomain: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: String, 
    required: true 
  },
  endDate: { 
    type: String, 
    required: true 
  },
  issuedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
