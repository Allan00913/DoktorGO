'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">DoktorGO</h1>
          <div className="user-menu">
            <span>{user?.firstName} {user?.lastName}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="welcome">
          <h2>Welcome, {user?.firstName}!</h2>
          <p>How can we help you today?</p>
        </section>

        <div className="actions-grid">
          <a href="/doctors" className="action-card">
            <h3>Find Doctors</h3>
            <p>Search for doctors by specialty</p>
          </a>
          <a href="/appointments" className="action-card">
            <h3>My Appointments</h3>
            <p>View your scheduled appointments</p>
          </a>
          <a href="/prescriptions" className="action-card">
            <h3>Prescriptions</h3>
            <p>View your prescriptions</p>
          </a>
          <a href="/consultation" className="action-card">
            <h3>Start Consultation</h3>
            <p>Instant consultation with a doctor</p>
          </a>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #f8f9fa;
        }
        .navbar {
          background: white;
          padding: 1rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .navbar .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          color: var(--primary);
        }
        .user-menu {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .user-menu button {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          cursor: pointer;
        }
        .container {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .welcome {
          margin-bottom: 2rem;
        }
        .welcome h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .welcome p {
          color: var(--muted);
        }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
          display: block;
          color: inherit;
        }
        .action-card:hover {
          transform: translateY(-4px);
        }
        .action-card h3 {
          margin-bottom: 0.5rem;
        }
        .action-card p {
          color: var(--muted);
          font-size: 0.875rem;
        }
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}