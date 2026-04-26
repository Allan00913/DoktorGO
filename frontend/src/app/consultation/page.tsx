'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ConsultationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appointmentId, setAppointmentId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const aptId = searchParams.get('appointmentId');
    const rId = searchParams.get('roomId');
    
    if (aptId) setAppointmentId(aptId);
    if (rId) {
      setRoomId(rId);
      setInCall(true);
    }

    const role = localStorage.getItem('userRole');
    setIsDoctor(role === 'doctor');
  }, [searchParams, router]);

  useEffect(() => {
    if (inCall) {
      const interval = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [inCall]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!appointmentId) {
      alert('No appointment selected');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/consultations/video/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          doctorId: 'current-doctor-id',
          patientId: 'current-patient-id',
        }),
      });

      const data = await res.json();
      
      if (data.roomId) {
        setRoomId(data.roomId);
        setToken(data.token);
        setInCall(true);
      } else {
        alert('Failed to start call');
      }
    } catch (err) {
      console.error(err);
      alert('Error starting call');
    } finally {
      setLoading(false);
    }
  };

  const endCall = async () => {
    if (roomId) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/consultations/video/room/${roomId}/end`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error(err);
      }
    }
    setInCall(false);
    setRoomId('');
    setToken('');
    setCallDuration(0);
    router.push('/appointments');
  };

  if (inCall) {
    return (
      <div className="call-page">
        <div className="video-area">
          <div className="remote-video">
            <div className="avatar">
              {isDoctor ? '👨‍⚕️' : '👤'}
            </div>
            <p>{isDoctor ? 'Patient' : 'Dr. Smith'}</p>
          </div>
          <div className="local-video">
            <div className="avatar small">
              {isDoctor ? '👨‍⚕️' : '👤'}
            </div>
          </div>
        </div>

        <div className="call-controls">
          <div className="timer">{formatDuration(callDuration)}</div>
          <div className="buttons">
            <button className="mute-btn">🎤</button>
            <button className="video-btn">📷</button>
            <button className="end-btn" onClick={endCall}>📞</button>
          </div>
        </div>

        <style jsx>{`
          .call-page {
            min-height: 100vh;
            background: #1a1a1a;
            display: flex;
            flex-direction: column;
          }
          .video-area {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .remote-video {
            width: 80%;
            height: 60%;
            background: #2a2a2a;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .avatar {
            font-size: 5rem;
          }
          .avatar.small {
            font-size: 2rem;
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: #333;
            border-radius: 50%;
            padding: 10px;
          }
          .local-video {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 120px;
            height: 90px;
            background: #333;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .call-controls {
            background: #222;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .timer {
            color: white;
            font-size: 1.25rem;
            font-weight: 600;
          }
          .buttons {
            display: flex;
            gap: 1rem;
          }
          .mute-btn, .video-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #333;
            font-size: 1.25rem;
            cursor: pointer;
          }
          .end-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            background: #e74c3c;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

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
          <div className="consultation-card">
            <div className="icon">📹</div>
            <h1>Video Consultation</h1>
            <p>Connect with your doctor via secure video call</p>

            <div className="info-box">
              <h3>Before joining:</h3>
              <ul>
                <li>✅ Ensure stable internet connection</li>
                <li>✅ Allow camera & microphone access</li>
                <li>✅ Find a quiet, well-lit place</li>
                <li>✅ Have your symptoms ready to discuss</li>
              </ul>
            </div>

            <input
              type="text"
              placeholder="Enter appointment ID (or leave empty to create new)"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            />

            <button 
              className="join-btn"
              onClick={startCall}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Join Consultation'}
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .consultation-card {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          background: white;
          text-align: center;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .consultation-card p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        .info-box {
          background: #f0f9ff;
          border-radius: 8px;
          padding: 1rem;
          text-align: left;
          margin-bottom: 1.5rem;
        }
        .info-box h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .info-box ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        .info-box li {
          color: #374151;
          margin-bottom: 0.25rem;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .join-btn {
          width: 100%;
          padding: 1rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
        }
        .join-btn:disabled {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConsultationContent />
    </Suspense>
  );
}