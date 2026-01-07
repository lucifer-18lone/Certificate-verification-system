import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Search, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Home = () => {
  const [certId, setCertId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!certId) return;
    
    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/certificates/${certId}`);
      setCertificate(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found. Please verify the ID.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Simple Certificate Design
    doc.rect(10, 10, 277, 190, 'S'); // Border
    
    doc.setFontSize(40);
    doc.setTextColor(30, 58, 138); // Blue 900
    doc.text("Certificate of Completion", 148.5, 50, { align: "center" });
    
    doc.setFontSize(20);
    doc.setTextColor(100);
    doc.text("This is to certify that", 148.5, 75, { align: "center" });
    
    doc.setFontSize(30);
    doc.setTextColor(0);
    doc.text(certificate.studentName, 148.5, 95, { align: "center" });
    
    doc.setFontSize(18);
    doc.setTextColor(100);
    doc.text(`has successfully completed an internship in the domain of`, 148.5, 115, { align: "center" });
    
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);
    doc.text(certificate.internshipDomain, 148.5, 130, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`From ${certificate.startDate} to ${certificate.endDate}`, 148.5, 150, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Certificate ID: ${certificate.certificateId}`, 148.5, 180, { align: "center" });
    doc.text(`Issued on: ${new Date(certificate.issuedAt).toLocaleDateString()}`, 148.5, 185, { align: "center" });

    doc.save(`Certificate_${certificate.certificateId}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Verify Your Internship
        </h1>
        <p className="text-lg text-gray-600">
          Enter your unique Certificate ID to verify authenticity and download your digital copy.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="e.g. CERT-2023-001" 
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Now'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {certificate && (
          <div className="mt-8 border-t pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Certificate Verified!</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Student Name</p>
                <p className="text-xl font-bold text-gray-800">{certificate.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Domain</p>
                <p className="text-xl font-bold text-blue-700">{certificate.internshipDomain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Duration</p>
                <p className="text-gray-800 font-medium">{certificate.startDate} to {certificate.endDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Certificate ID</p>
                <p className="text-gray-800 font-mono">{certificate.certificateId}</p>
              </div>
            </div>

            <button 
              onClick={downloadPDF} 
              className="w-full md:w-auto flex items-center justify-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              <Download className="h-5 w-5" />
              <span>Download Official PDF</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>Issues with verification? Contact support@yourcompany.com</p>
      </div>
    </div>
  );
};

export default Home;
