'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Prescription {
  id: string;
  prescriptionNumber: string;
  doctorName: string;
  prescriptionDate: string;
  validUntil: string;
  status: string;
  items: { name: string; dosage: string; frequency: string }[];
}

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data);
      }
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <Link href="/" onClick={() => localStorage.removeItem('token')}>
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <h1>My Prescriptions</h1>
          <p className="subtitle">View and download your e-prescriptions</p>

          {loading ? (
            <div className="loading">Loading prescriptions...</div>
          ) : prescriptions.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">💊</div>
              <h3>No prescriptions yet</h3>
              <p>Your prescriptions from consultations will appear here</p>
            </div>
          ) : (
            <div className="prescriptions-list">
              {prescriptions.map((rx) => (
                <div 
                  key={rx.id} 
                  className="prescription-card"
                  onClick={() => setSelectedRx(rx)}
                >
                  <div className="rx-icon">📋</div>
                  <div className="rx-info">
                    <h3>Rx #{rx.prescriptionNumber}</h3>
                    <p className="doctor">Dr. {rx.doctorName}</p>
                    <p className="date">{formatDate(rx.prescriptionDate)}</p>
                  </div>
                  <span className={`status ${rx.status}`}>
                    {rx.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedRx && (
          <div className="modal" onClick={() => setSelectedRx(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedRx(null)}>×</button>
              
              <div className="rx-header">
                <h2>Electronic Prescription</h2>
                <p className="rx-number">Rx #{selectedRx.prescriptionNumber}</p>
              </div>

              <div className="rx-details">
                <div className="detail-row">
                  <span>Date Issued</span>
                  <span>{formatDate(selectedRx.prescriptionDate)}</span>
                </div>
                <div className="detail-row">
                  <span>Valid Until</span>
                  <span>{formatDate(selectedRx.validUntil)}</span>
                </div>
                <div className="detail-row">
                  <span>Prescribing Doctor</span>
                  <span>Dr. {selectedRx.doctorName}</span>
                </div>
              </div>

              <div className="medications">
                <h3>Medications</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedRx.items || []).map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.dosage}</td>
                        <td>{item.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pharmacy-info">
                <h3>Partner Pharmacies</h3>
                <p>Present this code at any Mercury Drug or Watsons to fill your prescription.</p>
                <div className="qr-placeholder">
                  [QR Code: {selectedRx.prescriptionNumber}]
                </div>
              </div>

              <button className="download-btn">
                Download PDF
              </button>
            </div>
          </div>
        )}

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
          
          h1 { margin-bottom: 0.5rem; }
          .subtitle { color: #6b7280; margin-bottom: 2rem; }
          
          .loading, .empty {
            text-align: center;
            padding: 4rem;
            background: white;
            border-radius: 12px;
          }
          
          .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
          .empty h3 { margin-bottom: 0.5rem; }
          .empty p { color: #6b7280; }
          
          .prescriptions-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .prescription-card {
            background: white;
            border-radius: 12px;
            padding: 1.25rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            border: 1px solid #e5e7eb;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .prescription-card:hover {
            border-color: #00aacc;
          }
          
          .rx-icon {
            font-size: 1.5rem;
          }
          
          .rx-info {
            flex: 1;
          }
          
          .rx-info h3 {
            font-size: 1rem;
            margin-bottom: 0.25rem;
          }
          
          .rx-info .doctor {
            color: #4a5568;
            font-size: 0.875rem;
          }
          
          .rx-info .date {
            color: #6b7280;
            font-size: 0.75rem;
          }
          
          .status {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
          }
          
          .status.active {
            background: #d1fae5;
            color: #065f46;
          }
          
          .status.expired {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .modal {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            padding: 1rem;
          }
          
          .modal-content {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
          }
          
          .rx-header {
            text-align: center;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 1.5rem;
          }
          
          .rx-number {
            color: #00aacc;
            font-weight: 600;
          }
          
          .rx-details {
            margin-bottom: 1.5rem;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .detail-row span:first-child {
            color: #6b7280;
          }
          
          .medications {
            margin-bottom: 1.5rem;
          }
          
          .medications h3 {
            font-size: 1rem;
            margin-bottom: 0.75rem;
          }
          
          .medications table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .medications th, .medications td {
            text-align: left;
            padding: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .pharmacy-info {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
          }
          
          .pharmacy-info h3 {
            font-size: 1rem;
            margin-bottom: 0.5rem;
          }
          
          .pharmacy-info p {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 0.75rem;
          }
          
          .qr-placeholder {
            background: white;
            padding: 1rem;
            text-align: center;
            border: 1px dashed #d1d5db;
            border-radius: 8px;
            font-family: monospace;
          }
          
          .download-btn {
            width: 100%;
            padding: 0.875rem;
            background: #00aacc;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </main>
    </div>
  );
}