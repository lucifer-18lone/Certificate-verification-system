import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import { Award, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl text-gray-900">CertVerify</span>
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">Verify</Link>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">Admin Portal</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <ShieldCheck className="h-5 w-5" />
              <p className="font-medium">Official Internship Verification Portal</p>
            </div>
            <p>&copy; {new Date().getFullYear()} CertVerify System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
