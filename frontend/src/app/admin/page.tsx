'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  time: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalPatients: 1247,
    totalDoctors: 56,
    totalAppointments: 892,
    totalRevenue: 456000
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setActivities([
      { id: '1', type: 'new_doctor', description: 'New doctor Dr. Luis Cruz verified', time: '2 min ago' },
      { id: '2', type: 'new_patient', description: 'New patient Juan dela Cruz registered', time: '15 min ago' },
      { id: '3', type: 'appointment', description: 'Appointment completed - Dr. Reyes', time: '1 hour ago' },
      { id: '4', type: 'payment', description: 'Payment received ₱500', time: '2 hours ago' },
    ]);
  }, []);

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">+</span>
            DoktorGO <span className="admin-badge">Admin</span>
          </Link>
          <div className="nav-links">
            <Link href="#">Overview</Link>
            <Link href="#">Doctors</Link>
            <Link href="#">Patients</Link>
            <Link href="#">Settings</Link>
            <Link href="/">Logout</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <h1>Dashboard</h1>
          <p className="subtitle">Platform overview and management</p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">{stats.totalPatients.toLocaleString()}</div>
              <div className="stat-change positive">+12% this month</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Doctors</div>
              <div className="stat-value">{stats.totalDoctors}</div>
              <div className="stat-change positive">+3 this month</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Appointments</div>
              <div className="stat-value">{stats.totalAppointments}</div>
              <div className="stat-change positive">+8% this month</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Revenue</div>
              <div className="stat-value">₱{stats.totalRevenue.toLocaleString()}</div>
              <div className="stat-change positive">+15% this month</div>
            </div>
          </div>

          <div className="sections-grid">
            <div className="section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'new_doctor' && '👨‍⚕️'}
                      {activity.type === 'new_patient' && '👤'}
                      {activity.type === 'appointment' && '📅'}
                      {activity.type === 'payment' && '💳'}
                    </div>
                    <div className="activity-info">
                      <p>{activity.description}</p>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Quick Actions</h2>
              <div className="actions-list">
                <button className="action-btn">
                  <span>👨‍⚕️</span>
                  Verify Doctor
                </button>
                <button className="action-btn">
                  <span>📊</span>
                  View Reports
                </button>
                <button className="action-btn">
                  <span>🔔</span>
                  Send Notification
                </button>
                <button className="action-btn">
                  <span>⚙️</span>
                  System Settings
                </button>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Doctor Verification Requests</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>License</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dr. Sofia Ong</td>
                  <td>Neurology</td>
                  <td>PRC-123456</td>
                  <td><span className="badge pending">Pending</span></td>
                  <td>
                    <button className="verify-btn">Verify</button>
                  </td>
                </tr>
                <tr>
                  <td>Dr. Mario Rivera</td>
                  <td>Cardiology</td>
                  <td>PRC-789012</td>
                  <td><span className="badge pending">Pending</span></td>
                  <td>
                    <button className="verify-btn">Verify</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .navbar {
          background: #1a1a1a;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
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

        .admin-badge {
          background: #ef4444;
          font-size: 0.625rem;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          margin-left: 0.5rem;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-links a {
          color: #9ca3af;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: white;
        }

        .main-content {
          padding: 2rem 1.5rem;
          padding-top: 5rem;
        }

        .container {
          max-width: 1400px;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .stat-change {
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .sections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .section h2 {
          font-size: 1.125rem;
          margin-bottom: 1rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .activity-icon {
          font-size: 1.5rem;
        }

        .activity-info p {
          font-size: 0.875rem;
          margin-bottom: 0.125rem;
        }

        .activity-info span {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .actions-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f3f4f6;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th, .data-table td {
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .data-table th {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
        }

        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .verify-btn {
          padding: 0.375rem 0.75rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sections-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}