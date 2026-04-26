'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  status: string;
  type: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        alert('Appointment cancelled');
        fetchAppointments();
      }
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PH', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'yellow';
      case 'completed': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
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
            <Link href="/doctors">Find Doctors</Link>
            <Link href="/" onClick={() => localStorage.removeItem('token')}>
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <div className="header">
            <h1>My Appointments</h1>
            <Link href="/doctors" className="new-btn">
              + New Appointment
            </Link>
          </div>

          <div className="tabs">
            <button 
              className={activeTab === 'upcoming' ? 'active' : ''}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={activeTab === 'past' ? 'active' : ''}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📅</div>
              <h3>No appointments yet</h3>
              <p>Book your first consultation with a doctor</p>
              <Link href="/doctors" className="book-btn">
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((apt) => (
                <div key={apt.id} className="appointment-card">
                  <div className="date-box">
                    <span className="month">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-PH', { month: 'short' })}
                    </span>
                    <span className="day">
                      {new Date(apt.appointmentDate).getDate()}
                    </span>
                  </div>
                  
                  <div className="apt-info">
                    <h3>{apt.doctorName || 'Doctor'}</h3>
                    <p className="specialty">{apt.specialty}</p>
                    <p className="datetime">{formatDate(apt.appointmentDate)}</p>
                    <span className={`status ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                  
                  <div className="apt-actions">
                    {apt.isPaid ? (
                      <>
                        <button className="join-btn">Join Consultation</button>
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancel(apt.id)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <Link 
                        href={`/payment?amount=${apt.consultationFee || 500}&appointmentId=${apt.id}&doctor=${apt.doctorName || ''}`}
                        className="pay-btn"
                      >
                        Pay Now
                      </Link>
                    )}
                  </div>
                </div>
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
          padding-top: 5rem;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .new-btn {
          background: #00aacc;
          color: white;
          padding: 0.625rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
        }
        
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .tabs button {
          background: none;
          border: none;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        
        .tabs button.active {
          color: #00aacc;
          border-bottom-color: #00aacc;
        }
        
        .loading {
          text-align: center;
          padding: 4rem;
          color: #6b7280;
        }
        
        .empty {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 12px;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .empty h3 {
          margin-bottom: 0.5rem;
        }
        
        .empty p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        
        .book-btn {
          display: inline-block;
          background: #00aacc;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
        }
        
        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .appointment-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          gap: 1.25rem;
          align-items: center;
          border: 1px solid #e5e7eb;
        }
        
        .date-box {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 0.75rem;
          text-align: center;
          min-width: 60px;
        }
        
        .month {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #6b7280;
        }
        
        .day {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .apt-info {
          flex: 1;
        }
        
        .apt-info h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        
        .specialty {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .datetime {
          color: #4a5568;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status.green {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status.yellow {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status.blue {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .status.red {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .apt-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .join-btn {
          background: #00aacc;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .cancel-btn {
          background: transparent;
          color: #ef4444;
          border: 1px solid #ef4444;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .view-btn {
          background: transparent;
          color: #4a5568;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .appointment-card {
            flex-direction: column;
            text-align: center;
          }
          
          .apt-actions {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}