'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Chat {
  id: string;
  doctorName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export default function ChatPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{ from: string; text: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setMessages([
        { from: 'them', text: 'Hello! How can I help you today?', time: '10:30 AM' },
        { from: 'me', text: 'Hi Doctor, I have a question about my prescription.', time: '10:31 AM' },
        { from: 'them', text: 'Of course! What would you like to know?', time: '10:32 AM' },
      ]);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    setChats([
      { id: '1', doctorName: 'Dr. Maria Reyes', lastMessage: 'Of course! What would you like to know?', timestamp: '10:32 AM', unread: 0 },
      { id: '2', doctorName: 'Dr. Pedro Santos', lastMessage: 'Take the medication thrice daily.', timestamp: 'Yesterday', unread: 1 },
      { id: '3', doctorName: 'Dr. Ana Garcia', lastMessage: 'Your results look good!', timestamp: '2 days ago', unread: 0 },
    ]);
    setLoading(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { from: 'me', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
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
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="chat-container">
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h2>Messages</h2>
            </div>
            
            {loading ? (
              <div className="loading">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="empty">
                <p>No conversations yet</p>
                <Link href="/doctors" className="start-chat">
                  Start a Chat
                </Link>
              </div>
            ) : (
              <div className="chat-list">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="chat-avatar">
                      {chat.doctorName.split(' ').map(n => n[0]).join('')[1]}
                    </div>
                    <div className="chat-info">
                      <div className="chat-header">
                        <h3>{chat.doctorName}</h3>
                        <span className="time">{chat.timestamp}</span>
                      </div>
                      <p className="last-message">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="unread-badge">{chat.unread}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chat-main">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <button className="back-btn" onClick={() => setSelectedChat(null)}>←</button>
                  <div className="chat-avatar small">
                    {selectedChat.doctorName.split(' ').map(n => n[0]).join('')[1]}
                  </div>
                  <div>
                    <h3>{selectedChat.doctorName}</h3>
                    <span className="status">Online</span>
                  </div>
                  <Link href={`/doctors/${selectedChat.id}`} className="video-btn">
                    🎥
                  </Link>
                </div>

                <div className="messages">
                  {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.from}`}>
                      <div className="message-content">{msg.text}</div>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </div>

                <form onSubmit={handleSend} className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit">Send</button>
                </form>
              </>
            ) : (
              <div className="no-chat">
                <div className="icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a chat from the list to start messaging</p>
              </div>
            )}
          </div>
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
          padding-top: 4rem;
          height: 100vh;
        }

        .chat-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          height: calc(100vh - 4rem);
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border: 1px solid #e5e7eb;
        }

        .chat-sidebar {
          border-right: 1px solid #e5e7eb;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
        }

        .loading, .empty {
          padding: 2rem;
          text-align: center;
          color: #6b7280;
        }

        .start-chat {
          display: inline-block;
          margin-top: 1rem;
          color: #00aacc;
        }

        .chat-list {
          padding: 0.5rem;
        }

        .chat-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-item:hover, .chat-item.active {
          background: #f3f4f6;
        }

        .chat-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #00aacc, #008ba8);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          flex-shrink: 0;
        }

        .chat-avatar.small {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          font-size: 0.875rem;
        }

        .chat-info {
          flex: 1;
          min-width: 0;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .chat-header h3 {
          font-size: 0.9375rem;
        }

        .time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .last-message {
          color: #6b7280;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread-badge {
          background: #00aacc;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
          height: fit-content;
        }

        .chat-main {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-main .chat-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          display: none;
        }

        .chat-main .chat-header h3 {
          font-size: 1rem;
          flex: 1;
        }

        .status {
          color: #10b981;
          font-size: 0.75rem;
        }

        .video-btn {
          font-size: 1.25rem;
          text-decoration: none;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          max-width: 70%;
        }

        .message.them {
          align-self: flex-start;
        }

        .message.me {
          align-self: flex-end;
        }

        .message-content {
          padding: 0.75rem 1rem;
          border-radius: 12px;
        }

        .message.them .message-content {
          background: #f3f4f6;
        }

        .message.me .message-content {
          background: #00aacc;
          color: white;
        }

        .message-time {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 0.25rem;
          display: block;
        }

        .message.me .message-time {
          text-align: right;
        }

        .message-input {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 0.75rem;
        }

        .message-input input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .message-input button {
          padding: 0.75rem 1.5rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        .no-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .no-chat .icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .chat-container {
            grid-template-columns: 1fr;
          }

          .chat-sidebar {
            display: block;
          }

          .chat-main {
            display: none;
          }

          .chat-main.active {
            display: flex;
          }

          .back-btn {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}