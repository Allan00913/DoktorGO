'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'gcash', name: 'GCash', icon: '💚' },
  { id: 'maya', name: 'Maya', icon: '💙' },
  { id: 'grabpay', name: 'GrabPay', icon: '💚' },
];

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const amt = searchParams.get('amount');
    const aptId = searchParams.get('appointmentId');
    const doc = searchParams.get('doctor');

    if (amt) setAmount(amt);
    if (aptId) setAppointmentId(aptId);
    if (doc) setDoctorName(doc || 'Doctor');
  }, [searchParams, router]);

  const handlePay = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/payments/gcash/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: `Consultation with Dr. ${doctorName}`,
          metadata: { appointmentId, doctorName },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.qrCode) {
        setQrCode(data.qrCode);
      } else if (data.error) {
        alert('GCash not configured yet. In production, this would redirect to GCash app.\n\nAmount: ₱' + amount);
        router.push('/appointments');
      } else {
        alert('Payment initialized! Amount: ₱' + amount);
        router.push('/appointments');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            <Link href="/appointments">Appointments</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <div className="payment-card">
            <h1>Complete Payment</h1>
            
            {doctorName && (
              <p className="recipient">
                Consultation with Dr. {doctorName}
              </p>
            )}

            <div className="amount-display">
              <label>Amount</label>
              <div className="amount-input">
                <span className="currency">₱</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled
                />
              </div>
            </div>

            <div className="methods">
              <label>Select Payment Method</label>
              <div className="method-grid">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`method-btn ${selectedMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <span>{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <button 
              className="pay-btn"
              onClick={handlePay}
              disabled={loading || !amount}
            >
              {loading ? 'Processing...' : `Pay ₱${amount || 0}`}
            </button>

            <p className="secure">
              🔒 Secured by GCash. Your payment is safe.
            </p>
          </div>

          {qrCode && (
            <div className="qr-modal">
              <div className="qr-content">
                <h2>Scan to Pay</h2>
                <img src={qrCode} alt="Payment QR Code" />
                <p>Open GCash app and scan this QR</p>
                <button onClick={() => setQrCode('')}>Close</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .payment-card {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          background: white;
        }
        .payment-card h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .recipient {
          color: var(--muted);
          margin-bottom: 1.5rem;
        }
        .amount-display {
          margin-bottom: 1.5rem;
        }
        .amount-display label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .amount-input {
          display: flex;
          align-items: center;
          border: 2px solid var(--border);
          border-radius: 8px;
          padding: 0 1rem;
        }
        .amount-input .currency {
          font-size: 1.5rem;
          color: var(--muted);
        }
        .amount-input input {
          border: none;
          font-size: 2rem;
          font-weight: 700;
          width: 100%;
          padding: 0.5rem;
        }
        .methods label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .method-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .method-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border: 2px solid var(--border);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .method-btn.selected {
          border-color: #00aacc;
          background: rgba(0, 170, 204, 0.1);
        }
        .method-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        .error {
          background: #fee;
          color: #c00;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        .pay-btn {
          width: 100%;
          padding: 1rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        .pay-btn:disabled {
          opacity: 0.6;
        }
        .secure {
          text-align: center;
          color: var(--muted);
          font-size: 0.875rem;
        }
        .qr-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }
        .qr-content img {
          width: 200px;
          height: 200px;
          margin: 1rem 0;
        }
        .qr-content button {
          padding: 0.75rem 2rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}