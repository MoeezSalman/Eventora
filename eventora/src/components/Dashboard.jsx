import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #030509; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; color: #fff; }
  a { text-decoration: none; }

  .dashboard-shell {
    min-height: 100vh;
    background: #030509;
    color: #f4f6ff;
  }

  .dashboard-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 14px 32px;
    border-bottom: 1px solid rgba(123, 116, 221, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(8px);
    background: rgba(3,5,9,0.9);
  }

  .logo {
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 800;
    font-size: 1.1rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    font-size: 1rem;
  }

  .nav-center {
    display: flex;
    gap: 28px;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .nav-center button {
    background: transparent;
    border: none;
    color: #c7cced;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .nav-center button:hover {
    color: #fff;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav-search {
    width: 280px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 9px 14px;
    background: rgba(30, 35, 70, 0.6);
    color: #9db2d7;
    font-size: 0.9rem;
    outline: none;
  }

  .nav-search::placeholder {
    color: #6b7c9f;
  }

  .nav-profile {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    display: grid;
    place-items: center;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
  }

  .dashboard-main {
    max-width: 1380px;
    margin: 0 auto;
    padding: 32px 32px 48px;
    display: grid;
    gap: 32px;
  }

  .hero-card {
    background: linear-gradient(135deg, #1a1840 0%, #2d1f60 45%, #3d2670 100%);
    border: 1px solid rgba(147, 127, 255, 0.25);
    border-radius: 24px;
    padding: 48px 44px;
    overflow: hidden;
    position: relative;
    min-height: 240px;
  }

  .hero-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 15% 35%, rgba(139, 92, 246, 0.25), transparent 45%),
                radial-gradient(circle at 85% 20%, rgba(236, 72, 153, 0.18), transparent 40%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 700px;
  }

  .hero-badge {
    display: inline-block;
    background: rgba(147, 127, 255, 0.2);
    border: 1px solid rgba(147, 127, 255, 0.4);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 0.85rem;
    color: #d4e0ff;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .hero-title { 
    font-size: 3.4rem; 
    font-weight: 800; 
    line-height: 1.1; 
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }

  .hero-sub { 
    color: #b8c4dd; 
    font-size: 1rem; 
    line-height: 1.65; 
    max-width: 65ch;
    margin-bottom: 28px;
  }

  .hero-actions { 
    display: flex; 
    align-items: center; 
    gap: 14px;
  }

  .btn-primary, .btn-secondary {
    border-radius: 10px;
    padding: 12px 22px;
    font-weight: 700;
    font-size: 0.95rem;
    border: 1px solid rgba(255,255,255,0.15);
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .btn-primary {
    background: linear-gradient(90deg, #7c3aed, #ec4899);
    color: #fff;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: rgba(255,255,255,0.08);
    color: #d4e0ff;
  }

  .events-section {
    display: grid;
    gap: 20px;
  }

  .events-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .events-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .events-title {
    font-size: 1.65rem;
    font-weight: 800;
  }

  .events-meta {
    color: #8a95ba;
    font-size: 0.9rem;
  }

  .sort-dropdown {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    color: #c7cced;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .category-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .pill {
    border: 1px solid rgba(147, 127, 255, 0.3);
    border-radius: 999px;
    padding: 9px 15px;
    font-size: 0.9rem;
    color: #d2d8f6;
    background: transparent;
    cursor: pointer;
    transition: all 0.25s ease;
    font-weight: 600;
  }

  .pill.active {
    border-color: transparent;
    background: linear-gradient(90deg, #6c5ce7, #e91e63);
    color: #fff;
  }

  .pill:hover {
    border-color: rgba(147, 127, 255, 0.5);
  }

  .events-grid { 
    display: grid; 
    grid-template-columns: repeat(3, minmax(0,1fr)); 
    gap: 18px; 
  }

  .event-card {
    background: linear-gradient(145deg, rgba(20, 25, 60, 0.9), rgba(30, 35, 75, 0.95));
    border: 1px solid rgba(117, 98, 226, 0.18);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 310px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .event-card:hover {
    transform: translateY(-6px);
    border-color: rgba(117, 98, 226, 0.35);
    box-shadow: 0 16px 32px rgba(52, 38, 172, 0.22);
  }

  .event-banner {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
    position: relative;
    overflow: hidden;
  }

  .event-banner.music {
    background: linear-gradient(135deg, #5d3a8a 0%, #8b3a8a 40%, #8b5ce6 100%);
  }

  .event-banner.sports {
    background: linear-gradient(135deg, #1a5f5a 0%, #2a7f7a 40%, #3a9f9a 100%);
  }

  .event-banner.conferences {
    background: linear-gradient(135deg, #4a3a7a 0%, #6a5a8a 40%, #8a7aaa 100%);
  }

  .event-banner.cultural {
    background: linear-gradient(135deg, #6a3a4a 0%, #8a5a6a 40%, #aa7a8a 100%);
  }

  .event-banner.workshops {
    background: linear-gradient(135deg, #3a5a6a 0%, #5a7a8a 40%, #7a9aaa 100%);
  }

  .event-category {
    position: absolute;
    top: 12px;
    left: 14px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .event-date {
    position: absolute;
    top: 12px;
    right: 14px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #fff;
  }

  .event-details { 
    padding: 18px; 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    gap: 10px;
  }

  .event-title { 
    font-size: 1.08rem; 
    font-weight: 800;
    line-height: 1.25;
    color: #fff;
  }

  .event-meta { 
    color: #9ca8c9; 
    font-size: 0.88rem;
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .event-footer { 
    margin-top: auto; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .event-price { 
    font-weight: 700; 
    color: #fff;
    font-size: 0.95rem;
  }

  @media (max-width: 1200px) { 
    .events-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  }

  @media (max-width: 768px) { 
    .events-grid { grid-template-columns: 1fr; }
  }
`;

const events = [
  { id: 1, type: "Music", emoji: "🎵", name: "Nescafé Basement Live — Season Finale", location: "Alhamra Arts Council", date: "Mar 22", price: "From Rs. 2,500", banner: "music" },
  { id: 2, type: "Sports", emoji: "⚽", name: "PSL 10 — Lahore Qalandars vs Karachi Kings", location: "Gaddafi Stadium", date: "Mar 28", price: "Rs. 1,200", banner: "sports" },
  { id: 3, type: "Conferences", emoji: "🗂️", name: "TechSummit 2026: AI in Live Events", location: "Expo Center", date: "Apr 10", price: "Rs. 4,100", banner: "conferences" },
  { id: 4, type: "Cultural", emoji: "🎭", name: "Classical Night: Sufi Rhythm", location: "Alhamra Hall", date: "Apr 5", price: "Rs. 1,750", banner: "cultural" },
  { id: 5, type: "Workshops", emoji: "🛠", name: "Photography Masterclass", location: "Art Hub", date: "Apr 13", price: "Rs. 2,300", banner: "workshops" },
  { id: 6, type: "Music", emoji: "🎵", name: "Neon Pop Bash", location: "Rafay Concert Arena", date: "Apr 23", price: "Rs. 3,500", banner: "music" }
];

const categories = ["All", "Music", "Sports", "Conferences", "Workshops", "Cultural", "Date", "Price", "Location"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-shell">
        <header className="dashboard-nav">
          <div className="logo">
            <div className="logo-icon">🟪</div>
            Eventora
          </div>
          <div className="nav-center">
            <button>Browse</button>
            <button>My Tickets</button>
            <button>History</button>
          </div>
          <div className="nav-right">
            <input className="nav-search" placeholder="Search events, artists, venues..." />
            <div className="nav-profile">M</div>
          </div>
        </header>

        <main className="dashboard-main">
          <section className="hero-card">
            <div className="hero-content">
              <span className="hero-badge">📍 47 events this weekend</span>
              <h1 className="hero-title">Discover Amazing Events</h1>
              <p className="hero-sub">From sold-out concerts to intimate workshops — find the experience that moves you. Book your seat before it's gone.</p>
              <div className="hero-actions">
                <button className="btn-primary">🔥 Trending Now</button>
                <button className="btn-secondary">View All Events</button>
              </div>
            </div>
          </section>

          <section className="events-section">
            <div className="events-header">
              <div className="events-info">
                <h2 className="events-title">All Events</h2>
                <p className="events-meta">Showing 120 events near Lahore</p>
              </div>
              <select className="sort-dropdown">
                <option>Sort: Upcoming ↓</option>
                <option>Sort: Popular</option>
                <option>Sort: Lowest Price</option>
              </select>
            </div>

            <div className="category-pills">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`pill ${cat === activeCategory ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === "All" && "⚡"} {cat}
                </button>
              ))}
            </div>

            <div className="events-grid">
              {events.map(event => (
                <article key={event.id} className="event-card" onClick={() => navigate('/event')}>
                  <div className={`event-banner ${event.banner}`}>
                    {event.emoji}
                    <span className="event-category">{event.emoji} {event.type}</span>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <div className="event-details">
                    <h3 className="event-title">{event.name}</h3>
                    <p className="event-meta">📍 {event.location}</p>
                    <div className="event-footer">
                      <span className="event-price">{event.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}

