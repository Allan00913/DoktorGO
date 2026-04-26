'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) setPrescriptionNumber(id);
  }, [searchParams]);

  const handleVerify = async () => {
    if (!prescriptionNumber) {
      setError('Enter prescription number');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/prescriptions/verify/${prescriptionNumber}`);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Prescription not found');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'dispensed': return 'blue';
      case 'expired': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h1>💊 Verify Prescription</h1>
        <p className="subtitle">Enter prescription number to verify</p>

        <div className="input-group">
          <input
            type="text"
            value={prescriptionNumber}
            onChange={(e) => setPrescriptionNumber(e.target.value.toUpperCase())}
            placeholder="e.g., RX-2026-001234"
          />
          <button onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <div className="status-badge" style={{ background: getStatusColor(result.status) }}>
              {result.status?.toUpperCase()}
            </div>

            <div className="rx-details">
              <div className="rx-item">
                <label>Prescription #</label>
                <span>{result.prescriptionNumber}</span>
              </div>

              <div className="rx-item">
                <label>Patient</label>
                <span>{result.patient?.user?.firstName} {result.patient?.user?.lastName}</span>
              </div>

              <div className="rx-item">
                <label>Doctor</label>
                <span>Dr. {result.doctor?.user?.firstName} {result.doctor?.user?.lastName}</span>
              </div>

              <div className="rx-item">
                <label>Date Issued</label>
                <span>{new Date(result.createdAt).toLocaleDateString('en-PH')}</span>
              </div>

              <div className="rx-item">
                <label>Valid Until</label>
                <span>{new Date(result.validUntil).toLocaleDateString('en-PH')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .verify-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: #f8fafc;
        }
        .verify-card {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          background: white;
        }
        h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .subtitle {
          text-align: center;
          color: var(--muted);
          margin-bottom: 1.5rem;
        }
        .input-group {
          display: flex;
          gap: 0.5rem;
        }
        .input-group input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid var(--border);
          border-radius: 8px;
          font-size: 1rem;
        }
        .input-group button {
          padding: 0.75rem 1.5rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }
        .input-group button:disabled {
          opacity: 0.6;
        }
        .error {
          background: #fee;
          color: #c00;
          padding: 0.75rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.875rem;
        }
        .result {
          margin-top: 1.5rem;
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
        }
        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .rx-details {
          display: grid;
          gap: 0.75rem;
        }
        .rx-item {
          display: flex;
          justify-content: space-between;
        }
        .rx-item label {
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}