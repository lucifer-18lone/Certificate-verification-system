import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Trash2, FileSpreadsheet, Plus, LogOut, Loader2, Info } from 'lucide-react';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/certificates', {
        headers: { 'x-auth-token': token }
      });
      setCertificates(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchCertificates();
    }
  }, [token, navigate, fetchCertificates]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setUploadStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/certificates/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token 
        }
      });
      setUploadStatus({ type: 'success', message: res.data.message });
      setFile(null);
      fetchCertificates();
    } catch (err) {
      setUploadStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Failed to upload certificates' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/certificates/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchCertificates();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage and upload internship certificates</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bulk Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Bulk Upload</span>
            </h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-start space-x-2">
              <Info className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold mb-1">Required Excel Headers:</p>
                <code className="bg-white px-1 rounded">certificateId</code>, 
                <code className="bg-white px-1 rounded ml-1">studentName</code>, 
                <code className="bg-white px-1 rounded ml-1">internshipDomain</code>, 
                <code className="bg-white px-1 rounded ml-1">startDate</code>, 
                <code className="bg-white px-1 rounded ml-1">endDate</code>
              </div>
            </div>

            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileSpreadsheet className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{file ? file.name : "Select Excel File"}</p>
                  </div>
                  <input type="file" className="hidden" accept=".xlsx, .xls" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>

              {uploadStatus.message && (
                <div className={`mb-4 p-3 rounded text-sm ${
                  uploadStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {uploadStatus.message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={!file || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Process Excel</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Certificates List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Recent Certificates</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Domain</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">
                        No certificates uploaded yet.
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert) => (
                      <tr key={cert._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-mono text-sm">{cert.certificateId}</td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{cert.studentName}</td>
                        <td className="px-6 py-4 text-blue-600 font-medium">{cert.internshipDomain}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(cert._id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
