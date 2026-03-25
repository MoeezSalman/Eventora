import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #080810;
    --surface: #0e0e1c;
    --surface2: #13132a;
    --border: rgba(255,255,255,0.07);
    --border-hi: rgba(168,85,247,0.35);
    --purple: #8b5cf6;
    --pink: #ec4899;
    --cyan: #06b6d4;
    --gold: #f59e0b;
    --green: #10b981;
    --red: #ef4444;
    --text: #f0eeff;
    --muted: #6b7398;
    --dim: #383860;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Instrument Sans', sans-serif; }

  .shell {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 10% 0%, rgba(139,92,246,0.08) 0%, transparent 45%),
      radial-gradient(ellipse at 90% 100%, rgba(236,72,153,0.05) 0%, transparent 40%);
  }

  /* ─── NAV ─── */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 58px;
    border-bottom: 1px solid var(--border);
    background: rgba(8,8,16,0.92);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 200;
  }
  .nav-logo { display: flex; align-items: center; gap: 9px; font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; }
  .nav-logo-icon { width: 30px; height: 30px; background: linear-gradient(135deg,#8b5cf6,#ec4899); border-radius: 8px; display:flex; align-items:center; justify-content:center; font-size:14px; }
  .nav-badge { display: inline-flex; align-items:center; gap:6px; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); border-radius:20px; padding:4px 12px; font-size:12px; color:#c4b5fd; font-weight:600; }
  .nav-dot { width:6px;height:6px;background:#a855f7;border-radius:50%; animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .nav-right { display:flex; align-items:center; gap:14px; }
  .nav-notif { position:relative; width:36px;height:36px; background:var(--surface2); border:1px solid var(--border); border-radius:9px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:15px; }
  .nav-notif::after { content:'3'; position:absolute; top:-4px;right:-4px; width:16px;height:16px; background:var(--pink); border-radius:50%; font-size:9px; font-weight:700; display:flex; align-items:center; justify-content:center; color:#fff; }
  .nav-avatar { width:34px;height:34px; background:linear-gradient(135deg,#8b5cf6,#6366f1); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; cursor:pointer; }

  /* ─── PAGE LAYOUT ─── */
  .page { max-width: 1360px; margin: 0 auto; padding: 28px 32px 60px; }

  /* ─── HEADER ─── */
  .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; gap:16px; flex-wrap:wrap; }
  .page-title { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; line-height:1.15; }
  .page-sub { font-size:14px; color:var(--muted); margin-top:5px; }

  .btn { display:inline-flex; align-items:center; gap:8px; padding:11px 20px; border-radius:10px; font-family:'Instrument Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; border:none; transition: all 0.2s; }
  .btn-primary { background:linear-gradient(135deg,#8b5cf6,#ec4899); color:#fff; }
  .btn-primary:hover { opacity:0.9; transform:translateY(-1px); }
  .btn-ghost { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .btn-ghost:hover { border-color:var(--border-hi); background:rgba(139,92,246,0.08); }

  /* ─── STAT CARDS ─── */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
  .stat-card {
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:14px;
    padding:18px 20px;
    position:relative; overflow:hidden;
    transition: border-color 0.2s, transform 0.2s;
    cursor:default;
  }
  .stat-card:hover { border-color:rgba(139,92,246,0.25); transform:translateY(-2px); }
  .stat-card::before {
    content:''; position:absolute; top:-30px; right:-30px;
    width:80px; height:80px; border-radius:50%;
    background: var(--accent-glow);
    filter:blur(28px); opacity:0.25; pointer-events:none;
  }
  .stat-icon { font-size:20px; margin-bottom:12px; }
  .stat-value { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; line-height:1; margin-bottom:4px; }
  .stat-label { font-size:12px; color:var(--muted); font-weight:500; }
  .stat-delta { display:inline-flex; align-items:center; gap:3px; font-size:11px; font-weight:600; margin-top:8px; padding:2px 7px; border-radius:20px; }
  .delta-up { background:rgba(16,185,129,0.15); color:#10b981; }
  .delta-dn { background:rgba(239,68,68,0.15); color:#ef4444; }

  /* ─── TOOLBAR ─── */
  .toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
  .toolbar-left { display:flex; gap:8px; flex-wrap:wrap; }
  .filter-pill {
    padding:7px 14px; border-radius:999px; font-size:13px; font-weight:600;
    border:1px solid var(--border); background:transparent; color:var(--muted);
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
  }
  .filter-pill.active { background:linear-gradient(90deg,#7c3aed,#a855f7); border-color:transparent; color:#fff; }
  .filter-pill:hover:not(.active) { border-color:rgba(139,92,246,0.4); color:var(--text); }
  .search-box {
    display:flex; align-items:center; gap:8px;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:10px; padding:9px 14px;
  }
  .search-box input { background:none; border:none; outline:none; color:var(--text); font-size:13px; font-family:inherit; width:200px; }
  .search-box input::placeholder { color:var(--muted); }

  /* ─── EVENT TABLE / CARDS ─── */
  .events-list { display:flex; flex-direction:column; gap:14px; }

  .event-row {
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:16px;
    overflow:hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .event-row:hover { border-color:rgba(139,92,246,0.3); box-shadow:0 8px 32px rgba(139,92,246,0.08); }

  .event-row-main {
    display:grid;
    grid-template-columns: 52px 1fr auto auto auto auto;
    align-items:center;
    gap:16px;
    padding:18px 22px;
    cursor:pointer;
  }

  .event-emoji-box {
    width:52px; height:52px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:24px; flex-shrink:0;
  }

  .event-info { min-width:0; }
  .event-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:5px; }
  .event-meta-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .event-meta-item { font-size:12px; color:var(--muted); display:flex; align-items:center; gap:4px; white-space:nowrap; }

  .status-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700;
    white-space:nowrap; flex-shrink:0;
  }
  .status-dot { width:5px;height:5px;border-radius:50; flex-shrink:0; }

  .tickets-stat { text-align:center; flex-shrink:0; }
  .tickets-stat-val { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; line-height:1; }
  .tickets-stat-lbl { font-size:10px; color:var(--muted); font-weight:600; letter-spacing:0.06em; text-transform:uppercase; margin-top:3px; }

  .revenue-stat { text-align:right; flex-shrink:0; }
  .revenue-val { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:#a78bfa; }
  .revenue-lbl { font-size:10px; color:var(--muted); font-weight:600; letter-spacing:0.06em; text-transform:uppercase; margin-top:3px; }

  .row-actions { display:flex; gap:8px; flex-shrink:0; }
  .icon-btn { width:32px;height:32px; border-radius:8px; border:1px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; transition:all 0.2s; }
  .icon-btn:hover { border-color:var(--border-hi); color:#fff; }

  /* Expand panel */
  .expand-panel {
    border-top:1px solid var(--border);
    padding:0 22px;
    max-height:0; overflow:hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
  }
  .expand-panel.open { max-height:500px; padding:20px 22px; }

  .expand-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }

  .mini-stat {
    background:var(--surface2); border:1px solid var(--border);
    border-radius:12px; padding:14px 16px;
  }
  .mini-stat-label { font-size:10px; color:var(--muted); font-weight:600; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:6px; }
  .mini-stat-val { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; }

  /* Progress bar */
  .progress-bar { height:6px; background:rgba(255,255,255,0.07); border-radius:999px; overflow:hidden; margin-top:10px; }
  .progress-fill { height:100%; border-radius:999px; transition: width 0.6s ease; }

  /* Bookings table */
  .bookings-table { width:100%; border-collapse:collapse; font-size:13px; }
  .bookings-table th { color:var(--muted); font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; padding:0 0 10px; text-align:left; }
  .bookings-table td { padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.04); color:var(--text); vertical-align:middle; }
  .bookings-table tr:last-child td { border-bottom:none; }
  .booking-avatar { width:26px;height:26px; border-radius:50%; background:linear-gradient(135deg,#8b5cf6,#a855f7); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0; }

  /* ─── MODAL ─── */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.7);
    backdrop-filter:blur(6px); z-index:500;
    display:flex; align-items:center; justify-content:center;
    padding:20px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .modal {
    background: var(--surface);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius:20px;
    width:100%; max-width:640px;
    max-height:90vh; overflow-y:auto;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .modal-header {
    display:flex; justify-content:space-between; align-items:center;
    padding:22px 26px 18px;
    border-bottom:1px solid var(--border);
    position:sticky; top:0; background:var(--surface); z-index:1; border-radius:20px 20px 0 0;
  }
  .modal-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; }
  .modal-close { width:32px;height:32px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); color:var(--muted); cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .modal-close:hover { color:#fff; border-color:var(--border-hi); }

  .modal-body { padding:24px 26px; display:flex; flex-direction:column; gap:18px; }

  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .form-group { display:flex; flex-direction:column; gap:7px; }
  .form-group label { font-size:12px; font-weight:600; color:#c4b5fd; letter-spacing:0.04em; }
  .form-input, .form-select, .form-textarea {
    background:var(--surface2); border:1px solid var(--border);
    border-radius:10px; padding:11px 14px;
    color:var(--text); font-family:'Instrument Sans',sans-serif; font-size:14px;
    outline:none; transition:border-color 0.2s, box-shadow 0.2s; width:100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color:rgba(139,92,246,0.5);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
  }
  .form-input::placeholder, .form-textarea::placeholder { color:var(--dim); }
  .form-select option { background:var(--surface2); }
  .form-textarea { resize:vertical; min-height:90px; }

  .upload-zone {
    border:2px dashed rgba(139,92,246,0.3); border-radius:12px;
    padding:24px; text-align:center; cursor:pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .upload-zone:hover { border-color:rgba(139,92,246,0.6); background:rgba(139,92,246,0.05); }
  .upload-icon { font-size:28px; margin-bottom:8px; }
  .upload-label { font-size:13px; color:var(--muted); }
  .upload-hint { font-size:11px; color:var(--dim); margin-top:4px; }

  .ticket-tiers { display:flex; flex-direction:column; gap:10px; }
  .tier-row {
    display:grid; grid-template-columns:1fr 120px 100px 36px;
    gap:10px; align-items:center;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:10px; padding:10px 14px;
  }
  .tier-name { font-size:13px; font-weight:600; }
  .tier-price-input { background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:7px; padding:6px 10px; color:var(--text); font-size:13px; width:100%; outline:none; font-family:inherit; }
  .add-tier-btn { display:flex; align-items:center; gap:6px; font-size:13px; color:#a78bfa; background:none; border:none; cursor:pointer; font-family:inherit; font-weight:600; padding:0; }

  .modal-footer { padding:18px 26px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; }

  /* ─── RESPONSIVE ─── */
  @media (max-width:1100px) {
    .stats-row { grid-template-columns:repeat(2,1fr); }
    .expand-grid { grid-template-columns:1fr 1fr; }
  }
  @media (max-width:800px) {
    .page { padding:20px 16px 48px; }
    .nav { padding:0 16px; }
    .event-row-main { grid-template-columns:40px 1fr auto; gap:12px; }
    .tickets-stat, .revenue-stat, .row-actions { display:none; }
    .row-actions { display:none; }
    .expand-grid { grid-template-columns:1fr; }
    .form-row { grid-template-columns:1fr; }
    .stats-row { grid-template-columns:repeat(2,1fr); gap:10px; }
  }
  @media (max-width:500px) {
    .stats-row { grid-template-columns:1fr 1fr; }
    .page-title { font-size:22px; }
    .search-box input { width:140px; }
    .tier-row { grid-template-columns:1fr 100px 36px; }
  }
`;

const EVENTS_DATA = [
  {
    id: 1,
    emoji: "🎵",
    emojiColor: "linear-gradient(135deg,#5d3a8a,#8b5cf6)",
    name: "Nescafé Basement Live — Season Finale",
    category: "Music",
    venue: "Alhamra Arts Council, Lahore",
    date: "22 Mar 2026",
    time: "7:00 PM",
    status: "live",
    capacity: 2400,
    sold: 1870,
    revenue: 4675000,
    bookings: [
      { name: "Ahmed K.", seats: "A12, A13", type: "Premium", paid: "Rs. 9,450", time: "2h ago" },
      { name: "Sara M.", seats: "B4", type: "VIP", paid: "Rs. 8,500", time: "5h ago" },
      { name: "Usman T.", seats: "C7, C8, C9", type: "Standard", paid: "Rs. 7,500", time: "8h ago" },
      { name: "Hiba R.", seats: "A1", type: "VIP", paid: "Rs. 8,925", time: "12h ago" },
    ],
  },
  {
    id: 2,
    emoji: "⚽",
    emojiColor: "linear-gradient(135deg,#064e3b,#059669)",
    name: "PSL 10 — Lahore Qalandars vs Karachi Kings",
    category: "Sports",
    venue: "Gaddafi Stadium, Lahore",
    date: "28 Mar 2026",
    time: "7:30 PM",
    status: "upcoming",
    capacity: 27000,
    sold: 14350,
    revenue: 17220000,
    bookings: [
      { name: "Bilal A.", seats: "Row 12, Seat 22", type: "Standard", paid: "Rs. 1,200", time: "1h ago" },
      { name: "Fatima Z.", seats: "VIP Box 3", type: "VIP", paid: "Rs. 12,000", time: "3h ago" },
      { name: "Kamran S.", seats: "Row 5, Seats 8–10", type: "Premium", paid: "Rs. 7,500", time: "6h ago" },
    ],
  },
  {
    id: 3,
    emoji: "🗂️",
    emojiColor: "linear-gradient(135deg,#1e3a5f,#2563eb)",
    name: "TechSummit 2026: AI in Live Events",
    category: "Conferences",
    venue: "Expo Center, Lahore",
    date: "10 Apr 2026",
    time: "9:00 AM",
    status: "upcoming",
    capacity: 800,
    sold: 612,
    revenue: 2509200,
    bookings: [
      { name: "Zara N.", seats: "Hall A, Seat 14", type: "Standard", paid: "Rs. 4,100", time: "30m ago" },
      { name: "Ali H.", seats: "VIP Table 2", type: "VIP", paid: "Rs. 12,000", time: "4h ago" },
    ],
  },
  {
    id: 4,
    emoji: "🎭",
    emojiColor: "linear-gradient(135deg,#6a1a3a,#be185d)",
    name: "Classical Night: Sufi Rhythm",
    category: "Cultural",
    venue: "Alhamra Hall, Lahore",
    date: "5 Apr 2026",
    time: "8:00 PM",
    status: "upcoming",
    capacity: 600,
    sold: 201,
    revenue: 351750,
    bookings: [
      { name: "Noor B.", seats: "F3, F4", type: "Standard", paid: "Rs. 3,500", time: "2d ago" },
    ],
  },
  {
    id: 5,
    emoji: "📸",
    emojiColor: "linear-gradient(135deg,#1e3a4a,#0891b2)",
    name: "Photography Masterclass",
    category: "Workshops",
    venue: "Art Hub, Lahore",
    date: "13 Apr 2026",
    time: "11:00 AM",
    status: "draft",
    capacity: 60,
    sold: 0,
    revenue: 0,
    bookings: [],
  },
];

const STATUS_CONFIG = {
  live:     { label: "Live",     dot: "#10b981", bg: "rgba(16,185,129,0.12)",  color: "#10b981" },
  upcoming: { label: "Upcoming", dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" },
  draft:    { label: "Draft",    dot: "#6b7398", bg: "rgba(107,115,152,0.15)", color: "#6b7398" },
  ended:    { label: "Ended",    dot: "#4b5563", bg: "rgba(75,85,99,0.2)",     color: "#6b7280" },
};

const FILTERS = ["All", "Live", "Upcoming", "Draft", "Ended"];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className="status-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.dot}33` }}>
      <span className="status-dot" style={{ background: cfg.dot, borderRadius: "50%", width: 6, height: 6, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color || "linear-gradient(90deg,#8b5cf6,#ec4899)" }} />
    </div>
  );
}

function EventRow({ ev, onEdit }) {
  const [open, setOpen] = useState(false);
  const pct = ev.capacity ? Math.round((ev.sold / ev.capacity) * 100) : 0;
  const fillColor = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "linear-gradient(90deg,#8b5cf6,#ec4899)";

  return (
    <div className="event-row">
      <div className="event-row-main" onClick={() => setOpen(o => !o)}>
        {/* Emoji */}
        <div className="event-emoji-box" style={{ background: ev.emojiColor }}>
          {ev.emoji}
        </div>

        {/* Info */}
        <div className="event-info">
          <div className="event-name">{ev.name}</div>
          <div className="event-meta-row">
            <span className="event-meta-item">📅 {ev.date} · {ev.time}</span>
            <span className="event-meta-item">📍 {ev.venue}</span>
            <span className="event-meta-item" style={{ color: "#9ca3af" }}>{ev.category}</span>
          </div>
        </div>

        {/* Status */}
        <StatusBadge status={ev.status} />

        {/* Tickets sold */}
        <div className="tickets-stat">
          <div className="tickets-stat-val" style={{ color: pct > 85 ? "#ef4444" : "#a78bfa" }}>{ev.sold.toLocaleString()}</div>
          <div className="tickets-stat-lbl">/ {ev.capacity.toLocaleString()} sold</div>
          <div style={{ width: 90, marginTop: 5 }}>
            <ProgressBar pct={pct} color={fillColor} />
          </div>
        </div>

        {/* Revenue */}
        <div className="revenue-stat">
          <div className="revenue-val">Rs. {ev.revenue > 999999 ? (ev.revenue / 1000000).toFixed(1) + "M" : ev.revenue.toLocaleString()}</div>
          <div className="revenue-lbl">Revenue</div>
        </div>

        {/* Actions */}
        <div className="row-actions" onClick={e => e.stopPropagation()}>
          <button className="icon-btn" title="Edit" onClick={() => onEdit(ev)}>✏️</button>
          <button className="icon-btn" title="Analytics">📊</button>
          <button className="icon-btn" title="More">⋯</button>
          <button className="icon-btn" title={open ? "Collapse" : "Expand"} onClick={() => setOpen(o => !o)}
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
            ▾
          </button>
        </div>
      </div>

      {/* ── EXPAND PANEL ── */}
      <div className={`expand-panel ${open ? "open" : ""}`}>
        <div className="expand-grid" style={{ marginBottom: 18 }}>
          <div className="mini-stat">
            <div className="mini-stat-label">Tickets Sold</div>
            <div className="mini-stat-val" style={{ color: "#a78bfa" }}>{ev.sold.toLocaleString()}</div>
            <ProgressBar pct={pct} />
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{pct}% capacity filled</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-label">Total Revenue</div>
            <div className="mini-stat-val" style={{ color: "#10b981" }}>Rs. {ev.revenue.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>After 5% service fee</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-label">Remaining Seats</div>
            <div className="mini-stat-val" style={{ color: pct > 85 ? "#ef4444" : "#f4f6ff" }}>
              {(ev.capacity - ev.sold).toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>of {ev.capacity.toLocaleString()} total capacity</div>
          </div>
        </div>

        {ev.bookings.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Recent Bookings
            </div>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Attendee</th>
                  <th>Seats</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Booked</th>
                </tr>
              </thead>
              <tbody>
                {ev.bookings.map((b, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="booking-avatar">{b.name[0]}</div>
                        {b.name}
                      </div>
                    </td>
                    <td style={{ color: "var(--muted)" }}>{b.seats}</td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                        background: b.type === "VIP" ? "rgba(245,158,11,0.15)" : b.type === "Premium" ? "rgba(6,182,212,0.15)" : "rgba(139,92,246,0.15)",
                        color: b.type === "VIP" ? "#f59e0b" : b.type === "Premium" ? "#06b6d4" : "#a78bfa"
                      }}>{b.type}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{b.paid}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {ev.bookings.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "8px 0 4px" }}>No bookings yet — event is in draft.</p>
        )}
      </div>
    </div>
  );
}

const TICKET_TIERS_DEFAULT = [
  { name: "Standard", price: "", qty: "" },
  { name: "Premium", price: "", qty: "" },
  { name: "VIP", price: "", qty: "" },
];

function CreateEventModal({ onClose }) {
  const [tiers, setTiers] = useState(TICKET_TIERS_DEFAULT);
  const [form, setForm] = useState({ name: "", category: "", venue: "", date: "", time: "", description: "", capacity: "" });

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Create New Event</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>Fill in the details to publish your event</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Event Name */}
          <div className="form-group">
            <label>Event Name *</label>
            <input className="form-input" placeholder="e.g. Nescafé Basement Season Finale" value={form.name} onChange={e => updateForm("name", e.target.value)} />
          </div>

          {/* Category + Venue */}
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select className="form-select" value={form.category} onChange={e => updateForm("category", e.target.value)}>
                <option value="">Select category</option>
                <option>🎵 Music</option>
                <option>⚽ Sports</option>
                <option>🗂️ Conferences</option>
                <option>🎭 Cultural</option>
                <option>🛠 Workshops</option>
                <option>📸 Photography</option>
                <option>🎤 Comedy</option>
                <option>🍴 Food & Drink</option>
              </select>
            </div>
            <div className="form-group">
              <label>Venue *</label>
              <input className="form-input" placeholder="e.g. Alhamra Arts Council" value={form.venue} onChange={e => updateForm("venue", e.target.value)} />
            </div>
          </div>

          {/* Date + Time */}
          <div className="form-row">
            <div className="form-group">
              <label>Event Date *</label>
              <input className="form-input" type="date" value={form.date} onChange={e => updateForm("date", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Event Time *</label>
              <input className="form-input" type="time" value={form.time} onChange={e => updateForm("time", e.target.value)} />
            </div>
          </div>

          {/* Capacity + Gate Opens */}
          <div className="form-row">
            <div className="form-group">
              <label>Total Capacity *</label>
              <input className="form-input" type="number" placeholder="e.g. 2400" value={form.capacity} onChange={e => updateForm("capacity", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Gate Opens (Before)</label>
              <select className="form-select">
                <option>30 minutes before</option>
                <option>1 hour before</option>
                <option>2 hours before</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Event Description</label>
            <textarea className="form-textarea" placeholder="Tell attendees what to expect..." value={form.description} onChange={e => updateForm("description", e.target.value)} />
          </div>

          {/* Banner Upload */}
          <div className="form-group">
            <label>Event Banner</label>
            <div className="upload-zone">
              <div className="upload-icon">🖼️</div>
              <div className="upload-label">Drag & drop or click to upload</div>
              <div className="upload-hint">Recommended: 1200 × 630 px · JPG or PNG · Max 5MB</div>
            </div>
          </div>

          {/* Ticket Tiers */}
          <div className="form-group">
            <label>Ticket Tiers</label>
            <div className="ticket-tiers">
              {tiers.map((tier, i) => (
                <div key={i} className="tier-row">
                  <span className="tier-name">{tier.name}</span>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--muted)" }}>Rs.</span>
                    <input className="tier-price-input" style={{ paddingLeft: 30 }} placeholder="Price" value={tier.price}
                      onChange={e => setTiers(prev => prev.map((t, j) => j === i ? { ...t, price: e.target.value } : t))} />
                  </div>
                  <input className="tier-price-input" placeholder="Qty" value={tier.qty}
                    onChange={e => setTiers(prev => prev.map((t, j) => j === i ? { ...t, qty: e.target.value } : t))} />
                  <button onClick={() => setTiers(prev => prev.filter((_, j) => j !== i))}
                    style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#ef4444", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ×
                  </button>
                </div>
              ))}
              <button className="add-tier-btn" onClick={() => setTiers(prev => [...prev, { name: `Tier ${prev.length + 1}`, price: "", qty: "" }])}>
                + Add Tier
              </button>
            </div>
          </div>

          {/* Age Restriction + Visibility */}
          <div className="form-row">
            <div className="form-group">
              <label>Age Restriction</label>
              <select className="form-select">
                <option>All ages</option>
                <option>13+</option>
                <option>18+</option>
                <option>21+</option>
              </select>
            </div>
            <div className="form-group">
              <label>Visibility</label>
              <select className="form-select">
                <option>Public</option>
                <option>Unlisted (link only)</option>
                <option>Private (invite only)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Save Draft</button>
          <button className="btn btn-primary">Publish Event →</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ ev, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Edit Event</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{ev.name}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Event Date</label>
              <input className="form-input" type="date" defaultValue={ev.date} />
            </div>
            <div className="form-group">
              <label>Event Time</label>
              <input className="form-input" type="time" defaultValue={ev.time.replace(" ", "")} />
            </div>
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input className="form-input" defaultValue={ev.venue} />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input className="form-input" type="number" defaultValue={ev.capacity} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="form-select" defaultValue={ev.status}>
              <option value="draft">Draft</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-textarea" placeholder="Update description..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">Save Changes →</button>
        </div>
      </div>
    </div>
  );
}

export default function OrganizerDashboard() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const totalSold = EVENTS_DATA.reduce((s, e) => s + e.sold, 0);
  const totalRevenue = EVENTS_DATA.reduce((s, e) => s + e.revenue, 0);
  const totalEvents = EVENTS_DATA.length;
  const liveEvents = EVENTS_DATA.filter(e => e.status === "live").length;

  const filtered = EVENTS_DATA.filter(ev => {
    const matchFilter = filter === "All" || ev.status.toLowerCase() === filter.toLowerCase();
    const matchSearch = ev.name.toLowerCase().includes(search.toLowerCase()) || ev.venue.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="shell">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">⚡</div>
            Eventora
          </div>
          <div className="nav-badge">
            <span className="nav-dot" />
            Organizer Dashboard
          </div>
          <div className="nav-right">
            <div className="nav-notif">🔔</div>
            <div className="nav-avatar">M</div>
          </div>
        </nav>

        <div className="page">
          {/* HEADER */}
          <div className="page-header">
            <div>
              <div className="page-title">My Events</div>
              <div className="page-sub">Manage, track, and grow your events in one place.</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost">⬇ Export CSV</button>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                + Create Event
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            {[
              { icon: "🎟️", label: "Total Events", value: totalEvents, delta: "+2 this month", up: true, glow: "#8b5cf6" },
              { icon: "⚡", label: "Live Now",      value: liveEvents,   delta: "Currently active", up: true, glow: "#10b981" },
              { icon: "👥", label: "Tickets Sold",  value: totalSold.toLocaleString(), delta: "+430 this week", up: true, glow: "#06b6d4" },
              { icon: "💰", label: "Total Revenue", value: "Rs. " + (totalRevenue / 1000000).toFixed(1) + "M", delta: "+Rs. 450K", up: true, glow: "#ec4899" },
            ].map(s => (
              <div className="stat-card" key={s.label} style={{ "--accent-glow": s.glow }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-delta ${s.up ? "delta-up" : "delta-dn"}`}>{s.up ? "↑" : "↓"} {s.delta}</div>
              </div>
            ))}
          </div>

          {/* TOOLBAR */}
          <div className="toolbar">
            <div className="toolbar-left">
              {FILTERS.map(f => (
                <button key={f} className={`filter-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
            <div className="search-box">
              <span style={{ fontSize: 14, color: "var(--muted)" }}>🔍</span>
              <input placeholder="Search events or venues…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* EVENT LIST */}
          <div className="events-list">
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>No events found</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters or search query.</div>
              </div>
            )}
            {filtered.map(ev => (
              <EventRow key={ev.id} ev={ev} onEdit={setEditingEvent} />
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} />}
      {editingEvent && <EditModal ev={editingEvent} onClose={() => setEditingEvent(null)} />}
    </>
  );
}