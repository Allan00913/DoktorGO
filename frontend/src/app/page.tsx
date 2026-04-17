'use client';

import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={inter.className}>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">+</span>
            DoktorGO
          </Link>
          <div className="nav-links">
            <Link href="/doctors">Find Doctors</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/login">Sign In</Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Trusted by 50,000+ Filipino patients
          </div>
          <h1>The Grab of Healthcare</h1>
          <p className="hero-subtitle">
            Instant virtual consultations with licensed Philippine doctors. 
            Get prescriptions, lab requests, and medical advice — all from your phone.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary btn-lg">
              Consult a Doctor Now
              <span className="btn-icon">→</span>
            </Link>
            <Link href="/doctors" className="btn-outline btn-lg">
              Browse Specialists
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Licensed Doctors</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Availability</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">10min</span>
              <span className="stat-label">Avg. Wait Time</span>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get healthcare in 3 simple steps</p>
          
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <h3>1. Describe Your Symptoms</h3>
              <p>Tell our AI or select what you&apos;re feeling. Get matched with the right specialist.</p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3>2. Video Consultation</h3>
              <p>Connect with a doctor via HD video call. Get examined and discuss your health concerns.</p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3>3. Get Your Prescription</h3>
              <p>Receive your e-prescription digitally. Available for pickup at Mercury, Watsons & more.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Verified Doctors</h3>
              <p>All doctors are PRC-licensed and verified. View their credentials and ratings.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>GCash Payment</h3>
              <p>Pay easily with GCash, Maya, or credit card. No cash needed.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Any Device</h3>
              <p>Works on any phone, tablet, or computer. Low-bandwidth mode available.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>HIPAA Compliant</h3>
              <p>Your medical data is encrypted and protected under Philippine privacy laws.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-container">
          <h2>Ready for Your Consultation?</h2>
          <p>Join thousands of Filipinos who trust DoktorGO for their healthcare needs.</p>
          <Link href="/register" className="btn-primary btn-lg">
            Start Now — It&apos;s Free
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="logo">
                <span className="logo-icon">+</span>
                DoktorGO
              </Link>
              <p>The Grab of Healthcare — Virtual clinic for Filipinos.</p>
            </div>
            
            <div className="footer-links">
              <h4>Services</h4>
              <Link href="/doctors">Find Doctors</Link>
              <Link href="/consultation">Instant Consult</Link>
              <Link href="/prescriptions">E-Prescriptions</Link>
            </div>
            
            <div className="footer-links">
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/careers">Careers</Link>
            </div>
            
            <div className="footer-links">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/consent">Patient Consent</Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 DoktorGO. All rights reserved.</p>
            <p>DOH Registered Telemedicine Provider</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :global(body) {
          margin: 0;
          padding: 0;
        }
        
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
          align-items: center;
          gap: 2rem;
        }
        
        .nav-links a:not(.btn-primary) {
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .nav-links a:not(.btn-primary):hover {
          color: #00aacc;
        }
        
        .btn-primary {
          background: #00aacc;
          color: white;
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .btn-primary:hover {
          background: #008ba8;
          transform: translateY(-1px);
        }
        
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 8rem 1.5rem 4rem;
          overflow: hidden;
        }
        
        .hero-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 170, 204, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255, 107, 53, 0.1), transparent);
        }
        
        .hero-content {
          max-width: 800px;
          text-align: center;
          position: relative;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.875rem;
          color: #4a5568;
          margin-bottom: 1.5rem;
        }
        
        .badge-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }
        
        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 1.5rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.7;
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        
        .btn-lg {
          padding: 0.875rem 1.75rem;
          font-size: 1rem;
        }
        
        .btn-icon {
          margin-left: 0.5rem;
          transition: transform 0.2s;
        }
        
        .btn-lg:hover .btn-icon {
          transform: translateX(4px);
        }
        
        .btn-outline {
          background: transparent;
          color: #00aacc;
          border: 2px solid #00aacc;
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .btn-outline:hover {
          background: rgba(0, 170, 204, 0.05);
        }
        
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: #00aacc;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .stat-divider {
          width: 1px;
          height: 40px;
          background: #e5e7eb;
        }
        
        .how-it-works, .features, .cta {
          padding: 5rem 1.5rem;
        }
        
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 3rem;
        }
        
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .step {
          text-align: center;
          padding: 2rem;
        }
        
        .step-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #00aacc, #008ba8);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        
        .step-icon svg {
          width: 32px;
          height: 32px;
          color: white;
        }
        
        .step h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }
        
        .step p {
          color: #6b7280;
          line-height: 1.6;
        }
        
        .features {
          background: #f8fafc;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        
        .feature-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .feature-card p {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }
        
        .cta {
          background: linear-gradient(135deg, #00aacc 0%, #008ba8 100%);
          color: white;
        }
        
        .cta-container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        
        .cta h2 {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        
        .cta p {
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }
        
        .cta .btn-primary {
          background: white;
          color: #00aacc;
        }
        
        .cta .btn-primary:hover {
          background: #f0fdf4;
        }
        
        .footer {
          background: #1a1a1a;
          color: white;
          padding: 4rem 1.5rem 2rem;
        }
        
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .footer-brand .logo {
          color: white;
          margin-bottom: 1rem;
        }
        
        .footer-brand p {
          color: #9ca3af;
          font-size: 0.875rem;
        }
        
        .footer-links h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }
        
        .footer-links a {
          display: block;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }
        
        .footer-links a:hover {
          color: white;
        }
        
        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }
          
          .stat-divider {
            width: 40px;
            height: 1px;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}