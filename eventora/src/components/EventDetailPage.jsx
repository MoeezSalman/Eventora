import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0d0d14; font-family: 'DM Sans', sans-serif; color: #fff; }

  .page-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    align-items: start;
  }
  .highlights-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .hero-title { font-size: 28px; max-width: 55%; }
  .hero-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; font-size: 13px; color: #bbb; }
  .booking-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    padding: 22px;
    position: sticky;
    top: 68px;
  }

  @media (max-width: 768px) {
    .page-grid { grid-template-columns: 1fr; padding: 16px 12px; }
    .booking-card { position: static; order: -1; }
    .hero-title { font-size: 22px; max-width: 70%; }
    .highlights-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  }
  @media (max-width: 480px) {
    .hero-title { font-size: 20px; max-width: 100%; }
    .highlights-grid { grid-template-columns: 1fr; }
    .hero-meta { flex-direction: column; align-items: flex-start; gap: 6px; }
    .nav-back span { display: none; }
  }
  button { font-family: 'DM Sans', sans-serif; }
`;

function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

export default function EventDetailPage() {
    const navigate = useNavigate();
  const [tickets, setTickets] = useState(1);
  const [activeTab, setActiveTab] = useState("About");
  const price = 2500;
  const width = useBreakpoint();
  const isMobile = width <= 768;

  const highlights = [
    { icon: "📅", label: "DATE & TIME", value: "Sat, 22 March · 7 PM" },
    { icon: "📍", label: "VENUE", value: "Alhamra Arts Council" },
    { icon: "✏️", label: "TOTAL SEATS", value: "2,400 seats" },
    { icon: "⏱️", label: "DURATION", value: "~3 Hours" },
  ];

  return (
    <>
      <style>{styles}</style>

      <div style={{ minHeight: "100vh", background: "#0d0d14" }}>

        {/* ── Navbar ── */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "12px 16px" : "14px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#0d0d14", position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: isMobile ? 16 : 18 }}>
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#8b5cf6,#a855f7)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
              Eventora
            </div>
            <button className="nav-back" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#ccc", padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>
              ← <span>Back to Events</span>
            </button>
          </div>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#8b5cf6,#6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>M</div>
        </nav>

        {/* ── Page Grid ── */}
        <div className="page-grid">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Hero Banner */}
            <div style={{
              borderRadius: 14,
              background: "linear-gradient(135deg,#1a1040 0%,#2d1b6e 40%,#4c1d95 70%,#6d28d9 100%)",
              padding: isMobile ? "28px 20px 24px" : "40px 36px 32px",
              marginBottom: 20, position: "relative",
              minHeight: isMobile ? 180 : 220, overflow: "hidden"
            }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 80% 30%,rgba(168,85,247,0.3) 0%,transparent 60%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: isMobile ? 10 : 50, top: isMobile ? 10 : 16, fontSize: isMobile ? 60 : 80, transform: "rotate(-15deg)", filter: "drop-shadow(0 4px 20px rgba(239,68,68,0.5))", pointerEvents: "none" }}>🎸</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#ddd", marginBottom: 16 }}>
                  🎵 Music Concert
                </span>
                <h1 className="hero-title" style={{ fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.5px" }}>
                  Nescafé Basement Live — Season Finale
                </h1>
                <div className="hero-meta">
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>🕐 Saturday, 22 March 2025 · 7:00 PM</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>📍 Alhamra Arts Council, Lahore</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
              {["About", "Tickets", "Organizer"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: "none", border: "none",
                  color: activeTab === tab ? "#fff" : "#666",
                  fontSize: 14, fontWeight: 500, padding: "10px 16px", cursor: "pointer",
                  borderBottom: activeTab === tab ? "2px solid #a855f7" : "2px solid transparent",
                  marginBottom: -1, whiteSpace: "nowrap"
                }}>{tab}</button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "About" && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>ABOUT THIS EVENT</p>
                <p style={{ color: "#c0bdd8", fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>
                  Get ready for the most anticipated music event of the year — the Nescafé Basement Season Finale! After months of electrifying performances and jaw-dropping collaborations, the legendary show comes to a grand close live on stage at Alhamra Arts Council.
                </p>
                <p style={{ color: "#c0bdd8", fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
                  Experience your favorite underground artists perform their biggest hits, surprise guest appearances, and exclusive behind-the-scenes moments — all in one unforgettable night. This is a once-in-a-season experience you simply cannot miss.
                </p>

                <p style={{ fontSize: 11, fontWeight: 600, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>EVENT HIGHLIGHTS</p>
                <div className="highlights-grid">
                  {highlights.map(item => (
                    <div key={item.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, background: "rgba(168,85,247,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <p style={{ fontSize: 10, color: "#666", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>{item.label}</p>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "Tickets" && <p style={{ color: "#888", fontSize: 14 }}>Ticket tiers will appear here.</p>}
            {activeTab === "Organizer" && <p style={{ color: "#888", fontSize: 14 }}>Organizer info will appear here.</p>}
          </div>

          {/* ── RIGHT COLUMN — Booking Card ── */}
          <div className="booking-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#a855f7", fontWeight: 600 }}>📅 Sat, 22 March 2025</span>
              <span style={{ fontSize: 11, color: "#888", background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 6 }}>12 days left</span>
            </div>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Nescafé Basement — Finale</p>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>📍 Alhamra Arts Council, Lahore</p>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#888", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>STARTING FROM</p>
              <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>Rs. {price.toLocaleString()}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: "#ccc" }}>Tickets</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setTickets(t => Math.max(1, t - 1))} style={{ width: 30, height: 30, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ width: 24, textAlign: "center", fontWeight: 600 }}>{tickets}</span>
                <button onClick={() => setTickets(t => t + 1)} style={{ width: 30, height: 30, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontSize: 14, color: "#ccc" }}>Total Amount</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Rs. {(price * tickets).toLocaleString()}</span>
            </div>

            <button
  onClick={() => navigate("/seat-selection")}
  style={{
    width: "100%",
    padding: 13,
    background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 10
  }}
>
  Select Seats →
</button>
            <button style={{ width: "100%", padding: 11, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#ccc", fontSize: 14, cursor: "pointer", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              ♡ Save to Wishlist
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {["🔒 Secure & encrypted payment", "✉️ Instant confirmation via email", "📱 QR code pass on booking"].map(t => (
                <span key={t} style={{ fontSize: 12, color: "#666" }}>{t}</span>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
              <p style={{ fontSize: 11, color: "#666", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>SHARE EVENT</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button style={{ padding: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#ccc", fontSize: 13, cursor: "pointer" }}>↗ Share</button>
                <button style={{ padding: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#ccc", fontSize: 13, cursor: "pointer" }}>🔗 Copy Link</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}