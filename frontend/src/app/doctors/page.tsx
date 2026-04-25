'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  consultationFee: number;
  rating: number;
  totalConsultations: number;
  isAvailable: boolean;
  languages: string[];
  hospitalAffiliation: string;
  biography: string;
}

const specialties = [
  'All Specialties',
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'OB-GYN',
  'Internal Medicine',
  'ENT',
  'Ophthalmology',
];

const languages = ['English', 'Tagalog', 'Cebuano', 'Ilonggo', 'Kapampangan'];

export default function DoctorsPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [language, setLanguage] = useState('All');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, search, specialty, language]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];
    
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(d => 
        d.firstName.toLowerCase().includes(s) ||
        d.lastName.toLowerCase().includes(s) ||
        d.specialty.toLowerCase().includes(s)
      );
    }
    
    if (specialty !== 'All Specialties') {
      filtered = filtered.filter(d => d.specialty === specialty);
    }
    
    if (language !== 'All') {
      filtered = filtered.filter(d => d.languages?.includes(language));
    }
    
    setFilteredDoctors(filtered);
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/dashboard" className="logo">
            <span className="logo-icon">+</span>
            DoktorGO
          </Link>
          <div className="nav-links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/appointments">Appointments</Link>
            <Link href="/prescriptions">Prescriptions</Link>
            <Link href="/" onClick={() => localStorage.removeItem('token')}>
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <h1>Find a Doctor</h1>
          <p className="subtitle">Search from our network of verified specialists</p>

          <div className="filters">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="All">All Languages</option>
              {languages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading doctors...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="no-results">
              <p>No doctors found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => (
                <Link href={`/doctors/${doctor.id}`} key={doctor.id} className="doctor-card">
                  <div className="doctor-avatar">
                    {doctor.firstName[0]}{doctor.lastName[0]}
                  </div>
                  <div className="doctor-info">
                    <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <p className="specialty">{doctor.specialty}</p>
                    <div className="doctor-meta">
                      <span className="rating">★ {doctor.rating?.toFixed(1) || '4.8'}</span>
                      <span className="fee">₱{doctor.consultationFee}</span>
                    </div>
                    <div className="availability">
                      {doctor.isAvailable ? (
                        <span className="available">Available</span>
                      ) : (
                        <span className="unavailable">Not Available</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
        }
        
        .navbar {
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #00aacc;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .logo-icon {
          background: #00aacc;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .nav-links a {
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
        }
        
        .main-content {
          padding: 2rem 1.5rem;
          padding-top: 6rem;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
        }
        
        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        
        .search-box {
          flex: 1;
          min-width: 250px;
          position: relative;
        }
        
        .search-box svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }
        
        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .filters select {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          min-width: 150px;
        }
        
        .loading, .no-results {
          text-align: center;
          padding: 4rem;
          color: #6b7280;
        }
        
        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .doctor-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          display: flex;
          gap: 1rem;
        }
        
        .doctor-card:hover {
          border-color: #00aacc;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .doctor-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #00aacc, #008ba8);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        
        .doctor-info {
          flex: 1;
        }
        
        .doctor-info h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        
        .specialty {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .doctor-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
        }
        
        .rating {
          color: #f59e0b;
          font-weight: 600;
        }
        
        .fee {
          color: #10b981;
          font-weight: 600;
        }
        
        .availability {
          margin-top: 0.5rem;
        }
        
        .available {
          color: #10b981;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .unavailable {
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}