import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <div className="container nav-content">
          <Link href="/" className="logo">
            DoktorGO
          </Link>
          <div className="nav-links">
            <Link href="/doctors">Find Doctors</Link>
            <Link href="/login">Login</Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h1>The Grab of Healthcare</h1>
          <p>Virtual consultations with licensed doctors in the Philippines</p>
          <div className="hero-actions">
            <Link href="/register" className="btn-primary">
              Book Consultation
            </Link>
            <Link href="/doctors" className="btn-secondary">
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 DoktorGO. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .navbar {
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .hero {
          padding: 4rem 0;
          text-align: center;
        }
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .hero p {
          font-size: 1.25rem;
          color: var(--muted);
          margin-bottom: 2rem;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
        }
        .btn-secondary {
          background: transparent;
          color: var(--primary);
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--primary);
          border-radius: 8px;
          font-weight: 500;
        }
        .footer {
          padding: 2rem 0;
          text-align: center;
          border-top: 1px solid var(--border);
          margin-top: 4rem;
        }
      `}</style>
    </main>
  );
}