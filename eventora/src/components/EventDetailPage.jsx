import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #05050f; font-family: 'DM Sans', sans-serif; color: #fff; }
  a { text-decoration: none; }

  .dashboard-shell {
    min-height: 100vh;
    background: linear-gradient(180deg, #0a0d21 0%, #06080f 25%, #04050c 100%);
    color: #f4f6ff;
  }

  .dashboard-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 15px 24px;
    border-bottom: 1px solid rgba(123, 116, 221, 0.16);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(8px);
    background: rgba(4,8,25,0.75);
  }

  .logo {
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 800;
    font-size: 1.15rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
  }

  .nav-links {
    display: flex;
    gap: 14px;
    font-weight: 600;
  }

  .nav-links button {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    color: #c7cced;
    padding: 8px 14px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .nav-links button.active {
    border-color: transparent;
    background: linear-gradient(90deg, rgba(119, 91, 236, 0.62), rgba(236, 73, 157, 0.83));
    color: #fff;
  }

  .dashboard-main {
    max-width: 1180px;
    margin: 0 auto;
    padding: 24px 20px 36px;
    display: grid;
    gap: 24px;
  }

  .hero-card {
    background: linear-gradient(135deg, #1d1f46, #201f45 55%, #1b1744);
    border: 1px solid rgba(96, 81, 229, 0.32);
    border-radius: 20px;
    padding: 34px 30px;
    overflow: hidden;
    position: relative;
  }

  .hero-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 12% 30%, rgba(107, 33, 168, 0.28), transparent 40%),
                radial-gradient(circle at 90% 25%, rgba(236, 72, 153, 0.22), transparent 38%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 680px;
  }

  .hero-title { font-size: clamp(2.4rem, 4vw, 3.6rem); font-weight: 900; line-height: 1.08; }
  .hero-sub { margin-top: 16px; color: #bfc7dd; font-size: 1rem; line-height: 1.6; max-width: 58ch; }

  .hero-actions { margin-top: 24px; display: flex; align-items: center; gap: 12px; }

  .btn-primary, .btn-secondary {
    border-radius: 12px;
    padding: 11px 20px;
    font-weight: 700;
    border: 1px solid rgba(255,255,255,0.18);
    cursor: pointer;
  }

  .btn-primary {
    background: linear-gradient(90deg, #5f3dc4, #ec4899);
    color: #fff;
  }

  .btn-secondary {
    background: rgba(255,255,255,0.08);
    color: #ced8ff;
  }

  .tag-bar {
    margin: 24px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .tag { border: 1px solid rgba(255,255,255,0.17); border-radius: 999px; padding: 7px 13px; font-size: 0.85rem; color: #d2d8f6; background: rgba(255,255,255,0.05); }

  .stats { display: flex; gap: 28px; margin-top: 14px; }
  .stat-card { text-align: center; }
  .stat-value { font-size: 2rem; font-weight: 800; line-height: 1; color: #f7faff; }
  .stat-label { font-size: 0.78rem; color: #9a9ec2; text-transform: uppercase; letter-spacing: 0.09em; margin-top: 4px; }

  .events-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; margin-top: 14px; }
  .event-card {
    background: linear-gradient(145deg, rgba(4,8,23,0.75), rgba(24,20,52,0.9));
    border: 1px solid rgba(117, 98, 226, 0.2);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 260px;
  }

  .event-banner {
    height: 110px;
    background: linear-gradient(135deg, #7c3aed, #673ab7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 46px;
  }

  .event-details { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .event-title { font-size: 1.06rem; font-weight: 800; }
  .event-meta { color: #a0a9cf; font-size: 0.88rem; }
  .event-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
  .price { font-weight: 700; color: #fff; }
  .event-button { border: none; background: linear-gradient(90deg,#8b5cf6,#d946ef); color: white; font-weight: 700; padding: 7px 9px; border-radius: 8px; cursor: pointer; }

  @media (max-width: 1100px) { .events-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }}
  @media (max-width: 760px) { .events-grid { grid-template-columns: 1fr; } .dashboard-main { padding: 20px 14px 28px; } }
`;

const events = [
  { id: 1, type: "Music", name: "Nescafé Basement Live — Season Finale", date: "Sat Mar 22", venue: "Alhamra Arts Council", price: "Rs. 2,500" },
  { id: 2, type: "Sports", name: "PSL 10 — Lahore Qalandars vs Karachi Kings", date: "Fri Mar 28", venue: "Gaddafi Stadium", price: "Rs. 1,200" },
  { id: 3, type: "Conferences", name: "TechSummit 2026: AI in Live Events", date: "Sun Apr 10", venue: "Expo Center", price: "Rs. 4,100" },
  { id: 4, type: "Cultural", name: "Classical Night: Sufi Rhythm", date: "Tue Apr 5", venue: "Alhamra Hall", price: "Rs. 1,750" },
  { id: 5, type: "Workshops", name: "Photography Masterclass", date: "Wed Apr 13", venue: "Art Hub", price: "Rs. 2,300" },
  { id: 6, type: "Music", name: "Neon Pop Bash", date: "Sat Apr 23", venue: "Rafay Concert Arena", price: "Rs. 3,500" }
];

export default function EventDetailPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Music", "Sports", "Conferences", "Cultural", "Workshops"];

  const filteredEvents = activeCategory === "All" ? events : events.filter(e => e.type === activeCategory);

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-shell">
        <header className="dashboard-nav">
          <div className="logo">
            <div className="logo-icon">E</div>
            Eventora
          </div>
          <div className="nav-links">
            <button className="active">Browse</button>
            <button>My Tickets</button>
            <button>History</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input style={{ width: 180, borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", padding: "8px 12px", background: "rgba(8, 12, 31, 0.8)", color: "#eee", outline: "none" }} placeholder="Search events, artists, venues..." />
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", display: "grid", placeItems: "center", fontWeight: 700 }}>M</div>
          </div>
        </header>

        <main className="dashboard-main">
          <section className="hero-card">
            <div className="hero-content">
              <h1 className="hero-title">Discover Amazing Events</h1>
              <p className="hero-sub">From sold-out concerts to intimate workshops — find the experience that moves you. Book your seat before it's gone.</p>
              <div className="hero-actions">
                <button className="btn-primary">🔥 Trending Now</button>
                <button className="btn-secondary">View All Events</button>
              </div>
              <div className="tag-bar">
                {categories.map(c => <span key={c} className="tag">{c}</span>)}
              </div>
              <div className="stats">
                <div className="stat-card"><div className="stat-value">500+</div><div className="stat-label">Monthly Events</div></div>
                <div className="stat-card"><div className="stat-value">120K</div><div className="stat-label">Active Users</div></div>
                <div className="stat-card"><div className="stat-value">98%</div><div className="stat-label">Satisfaction</div></div>
              </div>
            </div>
          </section>

          <section>
            <div className="tag-bar" style={{ marginTop: 0, marginBottom: 8 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, fontSize: 12, padding: '6px 12px', background: cat === activeCategory ? 'linear-gradient(90deg,#6c5ce7,#e91e63)' : 'rgba(255,255,255,0.04)', color: '#f0f3ff', cursor: 'pointer' }}>{cat}</button>
              ))}
            </div>

            <div className="events-grid">
              {filteredEvents.map(event => (
                <article key={event.id} className="event-card" onClick={() => navigate('/event')} style={{ cursor: 'pointer' }}>
                  <div className="event-banner">{event.type}</div>
                  <div className="event-details">
                    <h3 className="event-title">{event.name}</h3>
                    <p className="event-meta">{event.date} • {event.venue}</p>
                    <div className="event-footer">
                      <span className="price">{event.price}</span>
                      <button className="event-button">Book</button>
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