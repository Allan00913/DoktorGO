'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  consultationFee: number;
  rating: number;
  totalConsultations: number;
  isAvailable: boolean;
  languages: string[];
  hospitalAffiliation: string;
  biography: string;
  yearsExperience: number;
}

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchDoctor();
  }, [params.id]);

  const fetchDoctor = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDoctor(data);
      }
    } catch (err) {
      console.error('Failed to fetch doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctor?.id,
          appointmentDate: `${selectedDate}T${selectedTime}:00`,
          type: 'scheduled',
        }),
      });
      
      if (res.ok) {
        alert('Appointment booked successfully!');
        router.push('/appointments');
      }
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
  ];

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="loading-page">
        <p>Loading doctor details...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="error-page">
        <p>Doctor not found</p>
        <Link href="/doctors">Back to Doctors</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/doctors" className="logo">
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
        <div className="container">
          <Link href="/doctors" className="back-link">← Back to Doctors</Link>
          
          <div className="doctor-profile">
            <div className="profile-header">
              <div className="avatar">
                {doctor.firstName[0]}{doctor.lastName[0]}
              </div>
              <div className="header-info">
                <h1>Dr. {doctor.firstName} {doctor.lastName}</h1>
                <p className="specialty">{doctor.specialty}</p>
                <div className="stats">
                  <span className="rating">★ {doctor.rating?.toFixed(1) || '4.8'}</span>
                  <span className="consultations">{doctor.totalConsultations || 0} consultations</span>
                  <span className="experience">{doctor.yearsExperience || 5}+ years exp.</span>
                </div>
              </div>
            </div>

            <div className="profile-body">
              <div className="main-column">
                <section className="section">
                  <h2>About</h2>
                  <p>{doctor.biography || 'Board-certified physician with extensive experience in treating patients. Committed to providing quality healthcare through telemedicine.'}</p>
                </section>

                <section className="section">
                  <h2>Languages</h2>
                  <div className="tags">
                    {(doctor.languages || ['English', 'Tagalog']).map(lang => (
                      <span key={lang} className="tag">{lang}</span>
                    ))}
                  </div>
                </section>

                <section className="section">
                  <h2>Hospital Affiliation</h2>
                  <p>{doctor.hospitalAffiliation || 'Telehealth Practice'}</p>
                </section>
              </div>

              <div className="sidebar">
                <div className="booking-card">
                  <div className="fee">
                    <span className="label">Consultation Fee</span>
                    <span className="amount">₱{doctor.consultationFee || 500}</span>
                  </div>

                  {doctor.isAvailable && (
                    <>
                      <div className="form-group">
                        <label>Select Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={getTomorrow()}
                        />
                      </div>

                      <div className="form-group">
                        <label>Select Time</label>
                        <div className="time-slots">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              className={selectedTime === time ? 'selected' : ''}
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        className="book-btn"
                        onClick={handleBooking}
                        disabled={!selectedDate || !selectedTime}
                      >
                        Book Appointment
                      </button>
                    </>
                  )}

                  {!doctor.isAvailable && (
                    <p className="unavailable-msg">Doctor is not available for booking</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .page, .loading-page, .error-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .loading-page, .error-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
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
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .back-link {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        
        .doctor-profile {
          background: white;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .profile-header {
          background: linear-gradient(135deg, #00aacc, #008ba8);
          padding: 2rem;
          color: white;
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        
        .avatar {
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: #00aacc;
        }
        
        .header-info h1 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        
        .specialty {
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }
        
        .stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
        }
        
        .rating {
          font-weight: 600;
        }
        
        .profile-body {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          padding: 2rem;
        }
        
        .section {
          margin-bottom: 2rem;
        }
        
        .section h2 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .section p {
          color: #4a5568;
          line-height: 1.6;
        }
        
        .tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .tag {
          background: #f3f4f6;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        
        .booking-card {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 12px;
          position: sticky;
          top: 2rem;
        }
        
        .fee {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .fee .label {
          color: #6b7280;
        }
        
        .fee .amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00aacc;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .time-slots {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        
        .time-slots button {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .time-slots button:hover {
          border-color: #00aacc;
        }
        
        .time-slots button.selected {
          background: #00aacc;
          color: white;
          border-color: #00aacc;
        }
        
        .book-btn {
          width: 100%;
          padding: 0.875rem;
          background: #00aacc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          cursor: pointer;
        }
        
        .book-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .unavailable-msg {
          text-align: center;
          color: #ef4444;
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .profile-body {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}