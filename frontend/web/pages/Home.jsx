import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWidget/ChatWindow';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-wrapper">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>SAVORIA</div>
            <div className="nav-links">
              <span onClick={() => scrollToSection('experience')}>Experiences</span>
              <span onClick={() => scrollToSection('heritage')}>Heritage</span>
              <span className="btn-nav" onClick={() => alert('Reservation system coming soon!')}>Reserve</span>
            </div>
          </nav>

          <div className="hero-text">
            <h1 className="hero-title animate-up">A Legacy of <br /> <span className="text-gradient">Hospitality</span></h1>
            <p className="hero-subtitle animate-up-delay">Where timeless tradition meets modern culinary intelligence.</p>
            <div className="hero-btns animate-up-delay-2">
              <button className="btn btn-primary" onClick={() => scrollToSection('experience')}>Reserve a Suite</button>
              <button className="btn glass ml-20" onClick={() => navigate('/menu')}>Explore Menu</button>
            </div>
          </div>
        </div>
      </section>

      <section id="heritage" className="heritage-section container">
        <div className="heritage-grid">
          <div className="heritage-text">
            <h5 className="sub-heading">Since 1924</h5>
            <h2 className="section-title">A Legacy of Taste</h2>
            <p>For over a century, Savoria has been the heartbeat of Mumbai's fine dining. Inspired by the grandeur of the Taj, we bring you an experience that transcends time.</p>
            <p>Our AI Sommelier, the spirit of our digital age, ensures every palate is matched with the perfect vintage.</p>
          </div>
          <div className="heritage-image glass">
            <img src="/luxury-bg.png" alt="Savoria Interior" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      <section id="experience" className="experience-section container">
        <h2 className="section-title text-center">Dining Experiences</h2>
        <div className="features">
          <div className="premium-card glass">
            <div className="card-label">Curated</div>
            <h3 className="accent-text">The Grand Hall</h3>
            <p>Majestic dining under royal chandeliers, perfect for grand celebrations.</p>
          </div>
          <div className="premium-card glass">
            <div className="card-label">Intimate</div>
            <h3 className="accent-text">Moonlight Terrace</h3>
            <p>Open-air sophistication with a view of the Mumbai skyline.</p>
          </div>
          <div className="premium-card glass">
            <div className="card-label">Exclusive</div>
            <h3 className="accent-text">The Private Vault</h3>
            <p>Whiskey and jazz in a secluded setting for the true connoisseur.</p>
          </div>
        </div>
      </section>

      <footer className="footer container">
        <div className="footer-content">
          <div className="logo footer-logo">SAVORIA</div>
          <div className="footer-links">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>Privacy</span>
          </div>
          <p>© 2026 Savoria Hospitality Group. Inspired by Taj.</p>
        </div>
      </footer>

      <ChatWindow />

      <style dangerouslySetInnerHTML={{
        __html: `
        .home-wrapper { min-height: 100vh; background: #F9F7F2; }
        .hero-section {
          height: 100vh;
          background: url('/luxury-bg.png') no-repeat center center;
          background-size: cover;
          position: relative;
          display: flex;
          align-items: center;
        }
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%);
          pointer-events: all; /* Important for button clicks if overlap exists */
          z-index: 5;
        }
        .hero-content { position: relative; z-index: 20; width: 100%; display: flex; flex-direction: column; }
        .navbar {
          position: fixed; top: 0; left: 0; width: 100%;
          padding: 30px 80px;
          display: flex; justify-content: space-between; align-items: center;
          z-index: 1000; transition: all 0.5s ease;
        }
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 15px 80px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }
        .logo {
          font-family: 'Playfair Display', serif; font-size: 2rem; letter-spacing: 0.5em;
          color: var(--white); cursor: pointer; transition: 0.5s;
        }
        .navbar.scrolled .logo { color: var(--primary); }
        .nav-links span {
          margin-left: 50px; font-size: 0.8rem; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer; color: rgba(255,255,255,0.8);
          transition: 0.3s;
        }
        .navbar.scrolled .nav-links span { color: var(--text-main); }
        .nav-links span:hover { color: var(--primary) !important; }
        .hero-text { max-width: 800px; padding: 0 80px; }
        .hero-title { font-size: 5.5rem; line-height: 1.1; color: white; margin-bottom: 25px; }
        .hero-subtitle { font-size: 1.4rem; color: #EAEAEA; margin-bottom: 45px; max-width: 550px; }
        .text-gradient {
            background: linear-gradient(to right, #C5A059, #F9F7F2);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .btn-nav { border: 1px solid var(--primary); padding: 8px 20px !important; }
        .animate-up { animation: fadeInUp 1s ease forwards; }
        .animate-up-delay { animation: fadeInUp 1s ease 0.3s forwards; opacity: 0; }
        .animate-up-delay-2 { animation: fadeInUp 1s ease 0.6s forwards; opacity: 0; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .heritage-section { padding: 150px 80px; }
        .heritage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
        .heritage-image { border: 15px solid white; box-shadow: var(--shadow-lg); transition: 1s; }
        .heritage-image:hover { transform: scale(1.02); }
        .experience-section { padding: 0 80px 150px; }
        .footer { padding: 80px 0; border-top: 1px solid #EAEAEA; text-align: center; }
        .footer-logo { color: var(--primary); margin-bottom: 30px; font-size: 1.5rem; }
        .footer-links { margin-bottom: 30px; }
        .footer-links span { margin: 0 20px; font-size: 0.8rem; color: var(--text-dim); cursor: pointer; }
        @media (max-width: 1024px) {
            .navbar { padding: 20px 40px; }
            .hero-text { padding: 0 40px; }
            .hero-title { font-size: 3.5rem; }
        }
      `}} />
    </div>
  );
};

export default Home;
