'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Stats {
  appointments: number;
  prescriptions: number;
  consultations: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({ appointments: 0, prescriptions: 0, consultations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetchUser();
    fetchStats();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStats({
      appointments: 2,
      prescriptions: 5,
      consultations: 12
    });
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">+</span>
            DoktorGO
          </Link>
          <div className="nav-links">
            <Link href="/doctors">Find Doctors</Link>
            <Link href="/appointments">Appointments</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <section className="welcome">
            <div className="welcome-text">
              <h1>Welcome back, {user?.firstName || 'User'}!</h1>
              <p>How can we help you today?</p>
            </div>
            <Link href="/consultation" className="consultation-btn">
              <span className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </span>
              Start Instant Consultation
            </Link>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <span className="stat-number">{stats.appointments}</span>
                <span className="stat-label">Upcoming Appointments</span>
              </div>
              <Link href="/appointments" className="stat-link">View All →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <div className="stat-info">
                <span className="stat-number">{stats.prescriptions}</span>
                <span className="stat-label">Prescriptions</span>
              </div>
              <Link href="/prescriptions" className="stat-link">View All →</Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🩺</div>
              <div className="stat-info">
                <span className="stat-number">{stats.consultations}</span>
                <span className="stat-label">Total Consultations</span>
              </div>
            </div>
          </section>

          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link href="/doctors" className="action-card">
                <span className="action-icon">🔍</span>
                <h3>Find a Doctor</h3>
                <p>Search by specialty, name, or language</p>
              </Link>

              <Link href="/appointments" className="action-card">
                <span className="action-icon">📅</span>
                <h3>Book Appointment</h3>
                <p>Schedule a consultation</p>
              </Link>

              <Link href="/prescriptions" className="action-card">
                <span className="action-icon">📋</span>
                <h3>View Prescriptions</h3>
                <p>Access your medical records</p>
              </Link>

              <Link href="/chat" className="action-card">
                <span className="action-icon">💬</span>
                <h3>Chat with Doctor</h3>
                <p>Message your healthcare provider</p>
              </Link>
            </div>
          </section>

          <section className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">✓</div>
                <div className="activity-info">
                  <h4>Consultation Completed</h4>
                  <p>Dr. Maria Reyes - General Checkup</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">📋</div>
                <div className="activity-info">
                  <h4>Prescription Issued</h4>
                  <p>Amoxicillin 500mg - 3x daily</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">💳</div>
                <div className="activity-info">
                  <h4>Payment Successful</h4>
                  <p>₱500 - Consultation Fee</p>
                  <span className="activity-time">2 days ago</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
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
          align-items: center;
        }

        .nav-links a, .nav-links button {
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .main-content {
          padding: 2rem 1.5rem;
          padding-top: 5rem;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .welcome {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #00aacc, #008ba8);
          border-radius: 16px;
          padding: 2rem;
          color: white;
          margin-bottom: 2rem;
        }

        .welcome h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .welcome p {
          opacity: 0.9;
        }

        .consultation-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          color: #00aacc;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }

        .consultation-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .btn-icon {
          font-size: 1.25rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #e5e7eb;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-info {
          flex: 1;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .stat-link {
          color: #00aacc;
          text-decoration: none;
          font-size: 0.875rem;
        }

        .quick-actions {
          margin-bottom: 2rem;
        }

        .quick-actions h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .action-card:hover {
          border-color: #00aacc;
          transform: translateY(-2px);
        }

        .action-icon {
          display: block;
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .action-card h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .action-card p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .recent-activity h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .activity-list {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: #d1fae5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #065f46;
          font-weight: 700;
        }

        .activity-info h4 {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .activity-info p {
          color: #4a5568;
          font-size: 0.875rem;
        }

        .activity-time {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .welcome {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}