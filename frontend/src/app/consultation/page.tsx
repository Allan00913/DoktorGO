'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ConsultationPage() {
  const [status, setStatus] = useState<'idle' | 'searching' | 'connected' | 'ended'>('idle');
  const [doctor, setDoctor] = useState<{ name: string; specialty: string } | null>(null);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'searching') {
      const timer = setTimeout(() => {
        setDoctor({ name: 'Dr. Maria Reyes', specialty: 'General Medicine' });
        setStatus('connected');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const startConsultation = () => {
    setStatus('searching');
    setMessages([{
      from: 'system',
      text: 'Finding an available doctor...'
    }]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { from: 'you', text: newMessage }]);
    setNewMessage('');
  };

  const endConsultation = () => {
    setStatus('ended');
  };

  const renderContent = () => {
    if (status === 'idle') {
      return (
        <div className="start-screen">
          <div className="icon">🎥</div>
          <h2>Start Instant Consultation</h2>
          <p>Connect with a licensed doctor in minutes. Get diagnosed, receive prescriptions, and medical advice — all via video call.</p>
          
          <div className="requirements">
            <h3>What you'll need:</h3>
            <ul>
              <li>📷 Working camera</li>
              <li>🎤 Working microphone</li>
              <li>💾 Stable internet connection</li>
            </ul>
          </div>
          
          <button onClick={startConsultation} className="start-btn">
            Start Video Consultation
          </button>
          
          <p className="note">Average wait time: 3-5 minutes</p>
        </div>
      );
    }

    if (status === 'searching') {
      return (
        <div className="searching-screen">
          <div className="loader"></div>
          <h2>Finding a Doctor</h2>
          <p>We&apos;re connecting you with an available licensed doctor...</p>
          
          <div className="tips">
            <h3>While you wait:</h3>
            <ul>
              <li>Prepare your symptoms list</li>
              <li>Have your medical history ready</li>
              <li>Find a well-lit area</li>
            </ul>
          </div>
        </div>
      );
    }

    if (status === 'connected') {
      return (
        <div className="call-screen">
          <div className="video-area">
            <div className="remote-video" ref={remoteVideoRef}>
              <div className="doctor-placeholder">
                <span className="avatar">{doctor?.name[0]}</span>
                <span className="name">{doctor?.name}</span>
                <span className="specialty">{doctor?.specialty}</span>
              </div>
            </div>
            <div className="local-video" ref={localVideoRef}></div>
          </div>

          <div className="call-info">
            <div className="status-indicator">
              <span className="dot"></span>
              In Call
            </div>
            <span className="duration">00:03:42</span>
          </div>

          <div className="call-controls">
            <button className="control-btn mute">🎤</button>
            <button className="control-btn camera">📷</button>
            <button className="control-btn end" onClick={endConsultation}>End Call</button>
          </div>

          <div className="chat-area">
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      );
    }

    if (status === 'ended') {
      return (
        <div className="ended-screen">
          <div className="icon">✓</div>
          <h2>Consultation Ended</h2>
          <p>Thank you for using DoktorGO. Your prescription (if any) will be sent to your registered email and available in the prescriptions section.</p>
          
          <div className="summary">
            <h3>Consultation Summary</h3>
            <p>Doctor: {doctor?.name}</p>
            <p>Duration: 3 minutes 42 seconds</p>
            <p>Status: Completed</p>
          </div>
          
          <div className="actions">
            <Link href="/prescriptions" className="btn-primary">
              View Prescription
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      );
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
        </div>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #1a1a1a;
        }

        .navbar {
          background: transparent;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
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

        .main-content {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5rem 1.5rem;
        }

        .start-screen, .searching-screen, .ended-screen {
          background: #262626;
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          max-width: 500px;
          width: 100%;
          color: white;
        }

        .icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .start-screen h2, .searching-screen h2, .ended-screen h2 {
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }

        .start-screen p, .searching-screen p, .ended-screen p {
          color: #a1a1a1;
          margin-bottom: 2rem;
        }

        .requirements {
          background: #323232;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: left;
          margin-bottom: 2rem;
        }

        .requirements h3, .tips h3 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }

        .requirements ul, .tips ul {
          list-style: none;
        }

        .requirements li, .tips li {
          color: #a1a1a1;
          margin-bottom: 0.5rem;
        }

        .start-btn {
          width: 100%;
          padding: 1rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
        }

        .note {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 1rem;
        }

        .loader {
          width: 60px;
          height: 60px;
          border: 4px solid #323232;
          border-top-color: #00aacc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .tips {
          background: #323232;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: left;
        }

        .call-screen {
          width: 100%;
          max-width: 1200px;
        }

        .video-area {
          position: relative;
          aspect-ratio: 16/9;
          background: #262626;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .remote-video {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a1a, #262626);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .doctor-placeholder {
          text-align: center;
          color: white;
        }

        .avatar {
          display: block;
          width: 100px;
          height: 100px;
          background: #00aacc;
          border-radius: 50%;
          font-size: 2.5rem;
          line-height: 100px;
          margin: 0 auto 1rem;
        }

        .name {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .specialty {
          color: #a1a1a1;
        }

        .local-video {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          width: 200px;
          height: 150px;
          background: #323232;
          border-radius: 12px;
        }

        .call-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          margin-bottom: 1rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .duration {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .call-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .control-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          background: #323232;
          color: white;
        }

        .control-btn.end {
          background: #ef4444;
        }

        .chat-area {
          background: #262626;
          border-radius: 12px;
          padding: 1rem;
        }

        .chat-messages {
          height: 150px;
          overflow-y: auto;
          margin-bottom: 1rem;
        }

        .message {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .message.system {
          background: #323232;
          color: #a1a1a1;
          text-align: center;
          font-size: 0.875rem;
        }

        .message.you {
          background: #00aacc;
          color: white;
          margin-left: auto;
          max-width: 70%;
        }

        .chat-input {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          background: #323232;
          color: white;
        }

        .chat-input button {
          padding: 0.75rem 1.5rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        .summary {
          background: #323232;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: left;
          margin-bottom: 2rem;
        }

        .summary h3 {
          margin-bottom: 0.75rem;
        }

        .summary p {
          margin-bottom: 0.5rem;
        }

        .actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 0.875rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
        }

        .btn-primary {
          background: #00aacc;
          color: white;
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
}