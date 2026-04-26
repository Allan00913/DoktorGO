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
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

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
            <button className="mute-btn" title="Toggle Mute">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <button className="video-btn" title="Toggle Video">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </button>
            <button className="end-btn" onClick={endCall} title="End Call">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
              </svg>
            </button>
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
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          }
          .avatar {
            font-size: 8rem;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
          .avatar small {
            font-size: 2rem;
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            padding: 12px;
          }
          .local-video {
            position: absolute;
            bottom: 30px;
            right: 30px;
            width: 140px;
            height: 105px;
            background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .call-controls {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6));
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(20px);
          }
          .timer {
            color: white;
            font-size: 1.25rem;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 8px;
          }
          .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }
          .mute-btn, .video-btn {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: none;
            background: #3a3a3a;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }
          .mute-btn:hover, .video-btn:hover {
            background: #4a4a4a;
            transform: scale(1.05);
          }
          .mute-btn.active, .video-btn.active {
            background: #00aacc;
          }
          .end-btn {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: none;
            background: #e74c3c;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          .end-btn:hover {
            background: #c0392b;
            transform: scale(1.05);
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
            <div className="hero-banner">
              <div className="video-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00aacc" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="hero-text">
                <h2>Start Instant Consultation</h2>
                <p>Connect with a doctor in minutes</p>
              </div>
            </div>

            <div className="card-content">
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
              placeholder="Enter appointment ID (optional)"
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
        </div>
      </main>

      <style jsx>{`
        .consultation-card {
          max-width: 500px;
          margin: 0 auto;
          padding: 0;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
          background: white;
          overflow: hidden;
          text-align: center;
        }
        .hero-banner {
          background: linear-gradient(135deg, #00aacc 0%, #008ba8 100%);
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .video-icon {
          width: 56px;
          height: 56px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hero-text {
          text-align: left;
        }
        .hero-text h2 {
          color: white;
          font-size: 1.25rem;
          margin: 0 0 0.25rem;
          font-weight: 700;
        }
        .hero-text p {
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          font-size: 0.875rem;
        }
        .consultation-card h1 {
          display: none;
        }
        .consultation-card > p {
          display: none;
        }
        .consultation-card :global(.card-content) {
          padding: 2rem;
        }
          margin-bottom: 0.5rem;
        }
        .consultation-card p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        .info-box {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.25rem;
          text-align: left;
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
        }
        .info-box h3 {
          font-size: 1rem;
          margin: 0 0 0.75rem;
          color: #1f2937;
          font-weight: 600;
        }
        .info-box ul {
          margin: 0;
          padding-left: 0;
          list-style: none;
        }
        .info-box li {
          color: #374151;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: border-color 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #00aacc;
        }
        .join-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #00aacc 0%, #008ba8 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 170, 204, 0.3);
        }
        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 170, 204, 0.4);
        }
        .join-btn:disabled {
          opacity: 0.6;
          transform: none;
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