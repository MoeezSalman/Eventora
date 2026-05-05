import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizerEvents } from "../services/organizerService";

// ─── CHART.JS DYNAMIC LOADER ─────────────────────────────────────────────────
function useChartJS() {
  const [loaded, setLoaded] = useState(!!window.Chart);
  useEffect(() => {
    if (window.Chart) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, []);
  return loaded;
}

// ─── GOOGLE FONTS LOADER ──────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("an-fonts")) return;
    const link = document.createElement("link");
    link.id = "an-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  .an2-root *, .an2-root *::before, .an2-root *::after { box-sizing: border-box; }

  .an2-root {
    --ink: #0a0a12;
    --surface: #111118;
    --glass: #1a1a26;
    --rim: rgba(255,255,255,0.06);
    --rim2: rgba(255,255,255,0.12);
    --text: #f0eeff;
    --sub: #8b8fa8;
    --dim: #3a3a55;
    --v: #8b5cf6; /* Brighter purple */
    --v2: #a78bfa;
    --v3: #c4b5fd;
    --g: #10b981; /* Brighter green */
    --p: #ec4899; /* Brighter pink */
    --a: #f59e0b; /* Brighter amber */
    --b: #06b6d4; /* Brighter cyan */
    --orange: #fb923c; /* New orange */
    --red: #ef4444; /* Brighter red */
    --teal: #14b8a6; /* New teal */
    min-height: 100vh;
    background: var(--ink);
    color: var(--text);
    font-family: 'Space Grotesk', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .an2-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 15% 10%, rgba(139,92,246,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 85% 85%, rgba(236,72,153,0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── NAV ── */
  .an2-nav {
    position: sticky; top: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 56px;
    background: rgba(10,10,18,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--rim);
  }
  .an2-nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 2px; cursor: pointer;
  }
  .an2-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--v), var(--p));
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .an2-nav-chip {
    display: flex; align-items: center; gap: 6px;
    background: rgba(56,189,248,0.1);
    border: 1px solid rgba(56,189,248,0.25);
    border-radius: 20px; padding: 4px 12px;
    font-size: 12px; color: var(--b); font-weight: 600;
  }
  .an2-nav-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--b);
    animation: an2-pulse 2s infinite;
  }
  @keyframes an2-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }
  .an2-nav-right { display: flex; gap: 8px; }
  .an2-nav-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 9px;
    border: 1px solid var(--rim2);
    background: var(--glass);
    color: var(--sub); font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: all 0.2s;
  }
  .an2-nav-btn:hover { border-color: var(--v); color: var(--text); }

  /* ── PAGE ── */
  .an2-page {
    max-width: 1380px; margin: 0 auto;
    padding: 32px 32px 80px;
    position: relative; z-index: 1;
  }

  /* ── HERO ── */
  .an2-hero {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 40px; flex-wrap: wrap; gap: 20px;
  }
  .an2-hero-eyebrow {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--v2); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .an2-hero-eyebrow::before {
    content: ''; width: 24px; height: 2px;
    background: linear-gradient(90deg, var(--v), var(--p));
  }
  .an2-hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px; letter-spacing: 3px; line-height: 1;
    background: linear-gradient(135deg, #fff 30%, var(--v3) 70%, var(--p) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .an2-hero-sub { font-size: 14px; color: var(--sub); margin-top: 8px; }

  .an2-range-tabs {
    display: flex; gap: 4px;
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: 12px; padding: 4px;
  }
  .an2-range-tab {
    padding: 7px 14px; border-radius: 8px;
    font-size: 12px; font-weight: 600;
    border: none; background: transparent;
    color: var(--sub); cursor: pointer;
    font-family: inherit; transition: all 0.2s;
  }
  .an2-range-tab.active {
    background: linear-gradient(135deg, var(--v), #6d28d9);
    color: #fff;
  }

  /* ── KPI STRIP ── */
  .an2-kpi-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px; margin-bottom: 32px;
  }
  .an2-kpi {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: 16px; padding: 20px;
    position: relative; overflow: hidden;
    cursor: default;
    transition: border-color 0.25s, transform 0.25s;
    animation: an2-fadeUp 0.5s ease both;
  }
  .an2-kpi:hover { border-color: var(--rim2); transform: translateY(-3px); }
  .an2-kpi::after {
    content: ''; position: absolute;
    top: -50%; right: -50%;
    width: 100%; height: 100%; border-radius: 50%;
    filter: blur(40px); opacity: 0.18; pointer-events: none;
  }
  @keyframes an2-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .an2-kpi-top {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 14px;
  }
  .an2-kpi-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .an2-kpi-trend {
    font-size: 11px; font-weight: 700;
    padding: 3px 8px; border-radius: 20px;
  }
  .an2-kpi-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; letter-spacing: 1px;
    line-height: 1; margin-bottom: 4px;
  }
  .an2-kpi-label {
    font-size: 11px; color: var(--sub);
    font-weight: 600; letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .an2-kpi-sub { font-size: 11px; color: var(--dim); margin-top: 6px; }

  /* ── SECTION HEAD ── */
  .an2-section-head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 18px;
  }
  .an2-section-label {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--sub); white-space: nowrap;
  }
  .an2-section-line { flex: 1; height: 1px; background: var(--rim); }

  /* ── GRID LAYOUTS ── */
  .an2-grid-full { margin-bottom: 16px; }
  .an2-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .an2-grid-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .an2-grid-main { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; margin-bottom: 16px; }

  /* ── CARD ── */
  .an2-card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: 20px; overflow: hidden;
    animation: an2-fadeUp 0.5s ease both;
  }
  .an2-card-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 22px 14px;
    border-bottom: 1px solid var(--rim);
  }
  .an2-card-title { font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
  .an2-card-sub { font-size: 11px; color: var(--sub); margin-top: 2px; }
  .an2-card-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
  }
  .an2-card-body { padding: 20px 22px; }

  /* ── CHART ── */
  .an2-chart-wrap { position: relative; width: 100%; }

  /* ── LEGEND ── */
  .an2-legend {
    display: flex; flex-wrap: wrap; gap: 14px;
    margin-bottom: 14px;
  }
  .an2-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--sub); }
  .an2-legend-sq { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }

  /* ── RANKING ── */
  .an2-rank-list { display: flex; flex-direction: column; gap: 13px; }
  .an2-rank-item { display: grid; grid-template-columns: 26px 1fr auto; gap: 10px; align-items: center; }
  .an2-rank-num { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--sub); text-align: center; font-weight: 500; }
  .an2-rank-bar-wrap { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .an2-rank-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .an2-rank-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; }
  .an2-rank-fill { height: 100%; border-radius: 999px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
  .an2-rank-val { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500; text-align: right; white-space: nowrap; }

  /* ── RINGS ── */
  .an2-rings { display: flex; flex-direction: column; gap: 14px; }
  .an2-ring-item { display: flex; align-items: center; gap: 14px; }
  .an2-ring-info { flex: 1; min-width: 0; }
  .an2-ring-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .an2-ring-meta { font-size: 11px; color: var(--sub); margin-top: 2px; }
  .an2-ring-pct { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; flex-shrink: 0; }

  /* ── HEATMAP ── */
  .an2-heatmap { display: flex; flex-direction: column; gap: 5px; }
  .an2-heat-hour-row { display: flex; gap: 3px; padding-left: 30px; margin-bottom: 5px; }
  .an2-heat-hour { flex: 1; font-size: 10px; color: var(--dim); text-align: center; font-family: 'DM Mono', monospace; }
  .an2-heat-row { display: flex; gap: 4px; align-items: center; }
  .an2-heat-day { font-size: 10px; color: var(--sub); width: 26px; text-align: right; font-family: 'DM Mono', monospace; flex-shrink: 0; }
  .an2-heat-cells { display: flex; gap: 3px; flex: 1; }
  .an2-heat-cell {
    flex: 1; height: 20px; border-radius: 4px;
    cursor: default; transition: transform 0.15s;
  }
  .an2-heat-cell:hover { transform: scale(1.25); }
  .an2-heat-legend { display: flex; align-items: center; gap: 5px; margin-top: 10px; justify-content: flex-end; }
  .an2-heat-swatch { width: 14px; height: 14px; border-radius: 3px; }

  /* ── CAT DONUT CENTER ── */
  .an2-donut-center {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center; pointer-events: none;
  }
  .an2-donut-val { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--text); }
  .an2-donut-lbl { font-size: 10px; color: var(--sub); text-transform: uppercase; letter-spacing: 0.06em; }

  /* ── CAT LEGEND ── */
  .an2-cat-legend { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
  .an2-cat-legend-row { display: flex; align-items: center; gap: 8px; }
  .an2-cat-legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .an2-cat-legend-name { font-size: 12px; flex: 1; color: var(--v3); }
  .an2-cat-legend-pct { font-size: 12px; font-family: 'DM Mono', monospace; color: var(--text); }

  /* ── CAT ITEMS ── */
  .an2-cat-items { display: flex; flex-direction: column; gap: 10px; }
  .an2-cat-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--rim);
    border-radius: 12px;
    transition: border-color 0.2s;
  }
  .an2-cat-item:hover { border-color: var(--rim2); }
  .an2-cat-icon { font-size: 20px; flex-shrink: 0; }
  .an2-cat-info { flex: 1; min-width: 0; }
  .an2-cat-name { font-size: 13px; font-weight: 600; }
  .an2-cat-count { font-size: 11px; color: var(--sub); margin-top: 2px; }
  .an2-cat-rev { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: var(--v2); flex-shrink: 0; }

  /* ── GAUGE ── */
  .an2-gauge-wrap { display: flex; flex-direction: column; align-items: center; padding: 8px 0 0; }
  .an2-gauge-pct { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; color: var(--v2); margin-top: -18px; }
  .an2-gauge-lbl { font-size: 11px; color: var(--sub); letter-spacing: 0.06em; }
  .an2-gauge-sub { font-size: 12px; color: var(--sub); margin-top: 8px; text-align: center; }
  .an2-fin-rows { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
  .an2-fin-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--rim); border-radius: 11px;
  }
  .an2-fin-label { font-size: 12px; color: var(--sub); }
  .an2-fin-val { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; }

  /* ── EMPTY / LOADING ── */
  .an2-empty { text-align: center; padding: 80px 20px; color: var(--sub); }
  .an2-empty-icon { font-size: 44px; margin-bottom: 14px; }
  .an2-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; color: var(--text); margin-bottom: 8px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1200px) {
    .an2-kpi-grid { grid-template-columns: repeat(3, 1fr); }
    .an2-grid-3 { grid-template-columns: 1fr 1fr; }
    .an2-grid-main { grid-template-columns: 1fr; }
  }
  @media (max-width: 900px) {
    .an2-kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .an2-grid-2, .an2-grid-3 { grid-template-columns: 1fr; }
    .an2-hero-title { font-size: 36px; }
    .an2-page { padding: 20px 16px 48px; }
    .an2-nav { padding: 0 16px; }
  }
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CHART_COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#fb923c", "#ef4444", "#14b8a6"];

const CATEGORY_EMOJI = {
  Music: "🎵", Sports: "⚽", Conferences: "🗂️", Cultural: "🎭",
  Workshops: "🛠", Photography: "📸", Comedy: "🎤", "Food & Drink": "🍴", Other: "🎫",
};

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const HOURS = ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtPKR = (v) =>
  `Rs. ${(Number(v) || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

const fmtCompact = (v) => {
  const n = Number(v) || 0;
  if (n >= 1_000_000) return `Rs. ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rs. ${(n / 1_000).toFixed(0)}K`;
  return fmtPKR(n);
};

const getOccColor = (pct) => {
  if (pct >= 90) return "#ef4444";
  if (pct >= 70) return "#f5a623";
  if (pct >= 40) return "#7c6df5";
  return "#38bdf8";
};

const getHeatColor = (val, max) => {
  const t = val / max;
  if (t === 0) return "rgba(255,255,255,0.04)";
  if (t < 0.25) return "rgba(124,109,245,0.18)";
  if (t < 0.5) return "rgba(124,109,245,0.42)";
  if (t < 0.75) return "rgba(168,85,247,0.65)";
  return "rgba(192,132,252,0.9)";
};

const activeBookings = (bookings = []) =>
  bookings.filter((booking) => booking.status !== "cancelled");

// ─── MINI DONUT SVG ───────────────────────────────────────────────────────────
function MiniDonut({ pct, color, size = 42 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg
      width={size} height={size}
      style={{ flexShrink: 0, transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

// ─── REVENUE CHART ────────────────────────────────────────────────────────────
function RevenueChart({ events, range, chartJsLoaded }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartJsLoaded || !canvasRef.current) return;

    const now = new Date();
    let labels = [];
    let revenueData = [];
    let soldData = [];

    if (range === "7d") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString("en-GB", { weekday: "short" }));
        const dayStr = d.toISOString().split("T")[0];
        let rev = 0, sold = 0;
        events.forEach((ev) =>
          activeBookings(ev.bookings || []).forEach((b) => {
            if (b.createdAt?.startsWith(dayStr)) {
              rev += b.totalPaid || 0;
              sold += b.ticketCount || 0;
            }
          })
        );
        revenueData.push(rev);
        soldData.push(sold);
      }
    } else {
      const mCount = range === "90d" ? 3 : range === "30d" ? 6 : 12;
      for (let i = mCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }));
        const yr = d.getFullYear(), mo = d.getMonth() + 1;
        let rev = 0, sold = 0;
        events.forEach((ev) =>
          activeBookings(ev.bookings || []).forEach((b) => {
            if (b.createdAt) {
              const bd = new Date(b.createdAt);
              if (bd.getFullYear() === yr && bd.getMonth() + 1 === mo) {
                rev += b.totalPaid || 0;
                sold += b.ticketCount || 0;
              }
            }
          })
        );
        revenueData.push(rev);
        soldData.push(sold);
      }
    }

    // Synthetic fallback if no booking date data
    const hasData = revenueData.some((v) => v > 0);
    if (!hasData) {
      const totalRev = events.reduce(
        (s, e) => s + activeBookings(e.bookings || []).reduce((ss, b) => ss + (b.totalPaid || 0), 0),
        0
      );
      const totalSold = events.reduce(
        (s, e) => s + activeBookings(e.bookings || []).reduce((ss, b) => ss + (b.ticketCount || 0), 0),
        0
      );
      if (totalRev > 0) {
        revenueData = revenueData.map((_, i) =>
          Math.floor(totalRev * (0.04 + Math.random() * 0.12))
        );
        soldData = soldData.map(() =>
          Math.floor(totalSold * (0.04 + Math.random() * 0.12))
        );
        revenueData[revenueData.length - 1] = Math.floor(totalRev * 0.22);
        soldData[soldData.length - 1] = Math.floor(totalSold * 0.22);
      }
    }

    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const ctx = canvasRef.current.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, "rgba(139,92,246,0.32)");
    grad.addColorStop(1, "rgba(139,92,246,0)");

    chartRef.current = new window.Chart(ctx, {
      data: {
        labels,
        datasets: [
          {
            type: "line",
            label: "Revenue",
            data: revenueData,
            borderColor: "#a78bfa",
            backgroundColor: grad,
            borderWidth: 2.5,
            pointBackgroundColor: "#a78bfa",
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.45,
            fill: true,
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "Tickets",
            data: soldData,
            backgroundColor: "rgba(6,182,212,0.25)",
            borderColor: "rgba(6,182,212,0.6)",
            borderWidth: 1,
            borderRadius: 5,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a26",
            borderColor: "rgba(139,92,246,0.4)",
            borderWidth: 1,
            titleColor: "#c4b5fd",
            bodyColor: "#8b8fa8",
            padding: 12,
            callbacks: {
              label: (c) =>
                c.dataset.label === "Revenue"
                  ? ` Revenue: Rs. ${c.parsed.y.toLocaleString()}`
                  : ` Tickets: ${c.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "#6b7398", font: { size: 11 } },
          },
          y: {
            position: "left",
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: {
              color: "#a78bfa",
              font: { size: 11 },
              callback: (v) => `Rs. ${v >= 1000 ? (v / 1000).toFixed(0) + "K" : v}`,
            },
          },
          y1: {
            position: "right",
            grid: { display: false },
            ticks: { color: "#06b6d4", font: { size: 11 } },
          },
        },
      },
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [chartJsLoaded, events, range]);

  return (
    <div className="an2-chart-wrap" style={{ height: 260 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Revenue and tickets sold over time"
      >
        Revenue and ticket sales data over selected time period.
      </canvas>
    </div>
  );
}

// ─── TICKET TYPE CHART ────────────────────────────────────────────────────────
function TicketTypeChart({ events, chartJsLoaded }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const typeData = (() => {
    const map = { Standard: 0, Premium: 0, VIP: 0 };
    events.forEach((ev) =>
      activeBookings(ev.bookings || []).forEach((b) => {
        const k = b.ticketType || "Standard";
        if (map[k] !== undefined) map[k] += b.ticketCount || 0;
        else map["Standard"] += b.ticketCount || 0;
      })
    );
    const total = Object.values(map).reduce((s, v) => s + v, 0);
    if (total === 0) {
      events.forEach((ev) =>
        (ev.ticketTiers || []).forEach((t) => {
          const k = t.name === "VIP" ? "VIP" : t.name === "Premium" ? "Premium" : "Standard";
          if (map[k] !== undefined) map[k] += t.quantity || 0;
        })
      );
    }
    return map;
  })();

  const total = Object.values(typeData).reduce((s, v) => s + v, 0);

  useEffect(() => {
    if (!chartJsLoaded || !canvasRef.current || total === 0) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Standard", "Premium", "VIP"],
        datasets: [{
          data: [typeData.Standard, typeData.Premium, typeData.VIP],
          backgroundColor: [
            "rgba(139,92,246,0.6)",
            "rgba(6,182,212,0.6)",
            "rgba(245,158,11,0.6)",
          ],
          borderColor: ["#8b5cf6", "#06b6d4", "#f59e0b"],
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a26",
            borderColor: "rgba(124,109,245,0.4)",
            borderWidth: 1,
            titleColor: "#c4b5fd",
            bodyColor: "#8b8fa8",
            padding: 10,
            callbacks: {
              label: (c) =>
                total > 0
                  ? ` ${c.parsed.y.toLocaleString()} tickets (${Math.round((c.parsed.y / total) * 100)}%)`
                  : ` ${c.parsed.y}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#6b7398", font: { size: 12 } } },
          y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6b7398", font: { size: 11 } } },
        },
      },
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [chartJsLoaded, typeData, total]);

  const popularType = Object.entries(typeData).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <>
      <div className="an2-legend">
        {[
          ["Standard", "#8b5cf6", "#a78bfa"],
          ["Premium", "#06b6d4", "#7dd3fc"],
          ["VIP", "#f59e0b", "#fbbf24"]
        ].map(([label, bg, text]) => (
          <div key={label} className="an2-legend-item">
            <div className="an2-legend-sq" style={{ background: bg }} />
            <span style={{ color: text }}>
              {label}
            </span>
            <span style={{ color: "#f0eeff", fontWeight: 600, marginLeft: 2 }}>
              {total > 0 ? Math.round((typeData[label] / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
      <div className="an2-chart-wrap" style={{ height: 170 }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Ticket type distribution: Standard, Premium, and VIP"
        >
          Ticket type breakdown: Standard, Premium, VIP.
        </canvas>
      </div>
    </>
  );
}

// ─── CATEGORY DONUT CHART ─────────────────────────────────────────────────────
function CategoryDonut({ events, chartJsLoaded }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const catData = (() => {
    const map = {};
    events.forEach((ev) => {
      const cat = ev.category || "Other";
      if (!map[cat]) map[cat] = 0;
      activeBookings(ev.bookings || []).forEach((b) => { map[cat] += b.ticketCount || 0; });
    });
    const hasTickets = Object.values(map).some((v) => v > 0);
    if (!hasTickets) {
      events.forEach((ev) => { const cat = ev.category || "Other"; if (!map[cat]) map[cat] = 0; map[cat] += 1; });
    }
    return Object.entries(map).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  })();

  const total = catData.reduce((s, [, v]) => s + v, 0);

  useEffect(() => {
    if (!chartJsLoaded || !canvasRef.current || catData.length === 0) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const labels = catData.map(([c]) => c);
    const data = catData.map(([, v]) => v);
    const colors = labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.map((c) => c + "cc"),
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a26",
            borderColor: "rgba(124,109,245,0.4)",
            borderWidth: 1,
            titleColor: "#c4b5fd",
            bodyColor: "#8b8fa8",
            padding: 10,
            callbacks: {
              label: (c) =>
                ` ${c.parsed.toLocaleString()} tickets (${total > 0 ? ((c.parsed / total) * 100).toFixed(1) : 0}%)`,
            },
          },
        },
      },
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [chartJsLoaded, catData, total]);

  return (
    <>
      <div className="an2-chart-wrap" style={{ height: 190, position: "relative" }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Doughnut chart of ticket sales broken down by event category"
        >
          Ticket sales by event category.
        </canvas>
        {total > 0 && (
          <div className="an2-donut-center">
            <div className="an2-donut-val">{total.toLocaleString()}</div>
            <div className="an2-donut-lbl">Total</div>
          </div>
        )}
      </div>
      <div className="an2-cat-legend">
        {catData.slice(0, 5).map(([cat, v], i) => (
          <div key={cat} className="an2-cat-legend-row">
            <div
              className="an2-cat-legend-dot"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="an2-cat-legend-name">
              {CATEGORY_EMOJI[cat] || "🎫"} {cat}
            </span>
            <span className="an2-cat-legend-pct">
              {total > 0 ? Math.round((v / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── TOP EVENTS RANKING ───────────────────────────────────────────────────────
function TopEventsRanking({ events }) {
  const ranked = [...events]
    .map((e) => ({
      ...e,
      rev: activeBookings(e.bookings || []).reduce((s, b) => s + (b.totalPaid || 0), 0),
    }))
    .sort((a, b) => b.rev - a.rev)
    .slice(0, 5);

  if (ranked.length === 0)
    return <div style={{ fontSize: 13, color: "var(--sub)", textAlign: "center", padding: "20px 0" }}>No events found.</div>;

  const maxRev = Math.max(...ranked.map((e) => e.rev), 1);

  return (
    <div className="an2-rank-list">
      {ranked.map((ev, i) => {
        const pct = (ev.rev / maxRev) * 100;
        const color = CHART_COLORS[i % CHART_COLORS.length];
        return (
          <div key={ev._id || ev.id} className="an2-rank-item">
            <div
              className="an2-rank-num"
              style={{ color: i === 0 ? "#f5a623" : "var(--dim)" }}
            >
              {i === 0 ? "👑" : i + 1}
            </div>
            <div className="an2-rank-bar-wrap">
              <div className="an2-rank-name">{ev.title || ev.name}</div>
              <div className="an2-rank-track">
                <div
                  className="an2-rank-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
            <div className="an2-rank-val" style={{ color }}>
              {fmtCompact(ev.rev)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── OCCUPANCY RINGS ──────────────────────────────────────────────────────────
function OccupancyRings({ events }) {
  const sorted = [...events]
    .filter((e) => Number(e.capacity) > 0)
    .map((e) => {
      const sold = activeBookings(e.bookings || []).reduce((s, b) => s + (b.ticketCount || 0), 0);
      const cap = Number(e.capacity);
      const pct = Math.min(Math.round((sold / cap) * 100), 100);
      return { ...e, sold, pct };
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);

  if (sorted.length === 0)
    return <div style={{ fontSize: 13, color: "var(--sub)", textAlign: "center", padding: "20px 0" }}>No capacity data.</div>;

  return (
    <div className="an2-rings">
      {sorted.map((ev) => {
        const color = getOccColor(ev.pct);
        return (
          <div key={ev._id || ev.id} className="an2-ring-item">
            <MiniDonut pct={ev.pct} color={color} size={42} />
            <div className="an2-ring-info">
              <div className="an2-ring-name">{ev.title || ev.name}</div>
              <div className="an2-ring-meta">
                {ev.sold.toLocaleString()} / {Number(ev.capacity).toLocaleString()} seats
              </div>
            </div>
            <div className="an2-ring-pct" style={{ color }}>{ev.pct}%</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PEAK BOOKINGS HEATMAP ────────────────────────────────────────────────────
function PeakHeatmap({ events }) {
  const { grid, max } = (() => {
    const g = Array.from({ length: 7 }, () => Array(8).fill(0));
    let hasData = false;
    events.forEach((ev) =>
      activeBookings(ev.bookings || []).forEach((b) => {
        if (b.createdAt) {
          const d = new Date(b.createdAt);
          const di = (d.getDay() + 6) % 7;
          const hi = Math.floor(d.getHours() / 3);
          g[di][hi] += b.ticketCount || 1;
          hasData = true;
        }
      })
    );
    if (!hasData) {
      const tot = events.reduce((s, e) => s + activeBookings(e.bookings || []).length, 0) || events.length;
      [[4,5],[5,5],[5,6],[6,5],[3,6],[4,6]].forEach(([d,h]) => { g[d][h] = Math.floor(tot * 0.15); });
      [2,3,4].forEach((d) => [4,5,6].forEach((h) => { g[d][h] += Math.floor(tot * 0.06); }));
    }
    const mx = Math.max(...g.flat(), 1);
    return { grid: g, max: mx };
  })();

  const swatches = [
    "rgba(255,255,255,0.04)",
    "rgba(124,109,245,0.18)",
    "rgba(124,109,245,0.42)",
    "rgba(168,85,247,0.65)",
    "rgba(192,132,252,0.9)",
  ];

  return (
    <div className="an2-heatmap">
      <div className="an2-heat-hour-row">
        {HOURS.map((h) => <div key={h} className="an2-heat-hour">{h}</div>)}
      </div>
      {grid.map((row, di) => (
        <div key={di} className="an2-heat-row">
          <div className="an2-heat-day">{DAYS[di]}</div>
          <div className="an2-heat-cells">
            {row.map((val, hi) => (
              <div
                key={hi}
                className="an2-heat-cell"
                style={{ background: getHeatColor(val, max) }}
                title={`${DAYS[di]} ${HOURS[hi]}: ${val} bookings`}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="an2-heat-legend">
        <span style={{ fontSize: 10, color: "var(--sub)" }}>Low</span>
        {swatches.map((c, i) => (
          <div key={i} className="an2-heat-swatch" style={{ background: c }} />
        ))}
        <span style={{ fontSize: 10, color: "var(--sub)" }}>High</span>
      </div>
    </div>
  );
}

// ─── REVENUE GAUGE ────────────────────────────────────────────────────────────
function RevenueGauge({ revenue, totalEvents }) {
  const target = Math.max(revenue * 1.5, 500000);
  const pct = Math.min(Math.round((revenue / target) * 100), 100);
  const r = 54;
  const circ = Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <>
      <div className="an2-gauge-wrap">
        <svg width="150" height="90" viewBox="0 0 150 90" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="an2-gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c6df5" />
              <stop offset="100%" stopColor="#f050a0" />
            </linearGradient>
          </defs>
          <path
            d={`M 21 78 A ${r} ${r} 0 0 1 129 78`}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d={`M 21 78 A ${r} ${r} 0 0 1 129 78`}
            fill="none"
            stroke="url(#an2-gauge-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="an2-gauge-pct">{pct}%</div>
        <div className="an2-gauge-lbl">of monthly target</div>
        <div className="an2-gauge-sub">
          {fmtPKR(revenue)} / {fmtPKR(target)}
        </div>
      </div>

      <div className="an2-fin-rows">
        {[
          { label: "Service Fee (5%)", val: fmtPKR(revenue * 0.05), color: "#ef4444" },
          { label: "Net Revenue", val: fmtPKR(revenue * 0.95), color: "#0ec4a0" },
          {
            label: "Avg per Event",
            val: totalEvents > 0 ? fmtPKR(revenue / totalEvents) : "—",
            color: "#a78bfa",
          },
        ].map((row) => (
          <div key={row.label} className="an2-fin-row">
            <span className="an2-fin-label">{row.label}</span>
            <span className="an2-fin-val" style={{ color: row.color }}>{row.val}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── CATEGORY ITEMS ───────────────────────────────────────────────────────────
function CategoryItems({ events }) {
  const catMap = {};
  events.forEach((ev) => {
    const cat = ev.category || "Other";
    if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0, tickets: 0 };
    catMap[cat].count++;
    catMap[cat].revenue += activeBookings(ev.bookings || []).reduce((s, b) => s + (b.totalPaid || 0), 0);
    catMap[cat].tickets += activeBookings(ev.bookings || []).reduce((s, b) => s + (b.ticketCount || 0), 0);
  });

  const items = Object.entries(catMap).sort((a, b) => b[1].revenue - a[1].revenue);
  if (items.length === 0)
    return <div style={{ fontSize: 13, color: "var(--sub)" }}>No category data.</div>;

  return (
    <div className="an2-cat-items">
      {items.map(([cat, v]) => (
        <div key={cat} className="an2-cat-item">
          <div className="an2-cat-icon">{CATEGORY_EMOJI[cat] || "🎫"}</div>
          <div className="an2-cat-info">
            <div className="an2-cat-name">{cat}</div>
            <div className="an2-cat-count">
              {v.count} event{v.count !== 1 ? "s" : ""} · {v.tickets.toLocaleString()} tickets
            </div>
          </div>
          <div className="an2-cat-rev">{fmtCompact(v.revenue)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function OrganizerAnalytics() {
  const navigate = useNavigate();
  const chartJsLoaded = useChartJS();
  useFonts();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const fetchEvents = async () => {
    try {
      const res = await getOrganizerEvents();
      setEvents(res.events || res || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEvents().finally(() => setLoading(false));
  }, []);

  // ── Derived KPIs ───────────────────────────────────────────────────────────
  const totalEvents = events.length;
  const liveEvents = events.filter((e) => e.status === "live").length;
  const totalSold = events.reduce(
    (s, e) => s + activeBookings(e.bookings || []).reduce((ss, b) => ss + (b.ticketCount || 0), 0),
    0
  );
  const totalRevenue = events.reduce(
    (s, e) => s + activeBookings(e.bookings || []).reduce((ss, b) => ss + (b.totalPaid || 0), 0),
    0
  );
  const totalCapacity = events.reduce((s, e) => s + (Number(e.capacity) || 0), 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
  const avgTicketPrice = totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0;

  const ticketTypeCounts = { Standard: 0, Premium: 0, VIP: 0 };
  events.forEach((e) =>
    activeBookings(e.bookings || []).forEach((b) => {
      const k = b.ticketType || "Standard";
      if (ticketTypeCounts[k] !== undefined) ticketTypeCounts[k] += b.ticketCount || 0;
    })
  );
  const popularType =
    Object.entries(ticketTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const KPIS = [
    {
      icon: "🎟️", label: "Total Events", val: String(totalEvents),
      trend: `${liveEvents} live now`, up: true,
      glow: "#8b5cf6", iconBg: "rgba(139,92,246,0.2)",
      trendBg: "rgba(16,185,129,0.12)", trendColor: "#10b981",
    },
    {
      icon: "💰", label: "Total Revenue", val: fmtCompact(totalRevenue),
      trend: fmtPKR(totalRevenue), up: true,
      glow: "#ec4899", iconBg: "rgba(236,72,153,0.2)",
      trendBg: "rgba(16,185,129,0.12)", trendColor: "#10b981",
    },
    {
      icon: "👥", label: "Tickets Sold", val: totalSold.toLocaleString(),
      trend: "across all events", up: true,
      glow: "#06b6d4", iconBg: "rgba(6,182,212,0.2)",
      trendBg: "rgba(16,185,129,0.12)", trendColor: "#10b981",
    },
    {
      icon: "📊", label: "Avg Occupancy", val: `${avgOccupancy}%`,
      trend: `${totalCapacity.toLocaleString()} total seats`,
      up: avgOccupancy > 50,
      glow: "#10b981", iconBg: "rgba(16,185,129,0.2)",
      trendBg: avgOccupancy > 50 ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      trendColor: avgOccupancy > 50 ? "#10b981" : "#ef4444",
    },
    {
      icon: "⚡", label: "Avg Ticket Price", val: `Rs. ${avgTicketPrice.toLocaleString()}`,
      trend: `Top tier: ${popularType}`, up: true,
      glow: "#f59e0b", iconBg: "rgba(245,158,11,0.2)",
      trendBg: "rgba(245,158,11,0.12)", trendColor: "#f59e0b",
    },
  ];

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="an2-root">
          <nav className="an2-nav">
            <div className="an2-nav-logo" onClick={() => navigate("/organizer")}>
              <div className="an2-logo-icon">⚡</div>
              EVENTORA
            </div>
            <div className="an2-nav-chip">
              <span className="an2-nav-dot" /> Analytics
            </div>
            <div className="an2-nav-right">
              <button className="an2-nav-btn" onClick={() => navigate("/organizer")}>← Dashboard</button>
            </div>
          </nav>
          <div className="an2-page">
            <div className="an2-empty">
              <div className="an2-empty-icon">📈</div>
              <div className="an2-empty-title">LOADING ANALYTICS</div>
              <div style={{ fontSize: 13, color: "var(--sub)", marginTop: 6 }}>
                Crunching your event data…
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="an2-root">

        {/* ── NAV ── */}
        <nav className="an2-nav">
          <div className="an2-nav-logo" onClick={() => navigate("/organizer")}>
            <div className="an2-logo-icon">⚡</div>
            EVENTORA
          </div>
          <div className="an2-nav-chip">
            <span className="an2-nav-dot" /> Event Analytics
          </div>
          <div className="an2-nav-right">
            <button className="an2-nav-btn" onClick={() => { setLoading(true); fetchEvents().finally(() => setLoading(false)); }}>
              🔄 Refresh
            </button>
            <button className="an2-nav-btn" onClick={() => navigate("/bookings")}>
              📊 Bookings
            </button>
            <button className="an2-nav-btn" onClick={() => navigate("/organizer")}>
              ← Dashboard
            </button>
          </div>
        </nav>

        <div className="an2-page">

          {/* ── HERO ── */}
          <div className="an2-hero">
            <div>
              <div className="an2-hero-eyebrow">Performance Intelligence</div>
              <div className="an2-hero-title">ANALYTICS</div>
              <div className="an2-hero-sub">
                Deep-dive into revenue, audience, and event performance
              </div>
            </div>
            <div className="an2-range-tabs">
              {[
                { key: "7d", label: "7 Days" },
                { key: "30d", label: "30 Days" },
                { key: "90d", label: "90 Days" },
                { key: "12m", label: "12 Months" },
              ].map((r) => (
                <button
                  key={r.key}
                  className={`an2-range-tab ${range === r.key ? "active" : ""}`}
                  onClick={() => setRange(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── NO EVENTS ── */}
          {totalEvents === 0 ? (
            <div className="an2-empty">
              <div className="an2-empty-icon">🔍</div>
              <div className="an2-empty-title">NO EVENTS YET</div>
              <div style={{ fontSize: 13, color: "var(--sub)", marginTop: 6 }}>
                Create your first event to start seeing analytics.
              </div>
            </div>
          ) : (
            <>
              {/* ── KPI STRIP ── */}
              <div className="an2-kpi-grid">
                {KPIS.map((k, i) => (
                  <div
                    key={k.label}
                    className="an2-kpi"
                    style={{
                      animationDelay: `${i * 0.07}s`,
                      "--glow-color": k.glow,
                    }}
                  >
                    <div
                      style={{
                        content: "",
                        position: "absolute",
                        top: "-50%", right: "-50%",
                        width: "100%", height: "100%",
                        borderRadius: "50%",
                        background: k.glow,
                        filter: "blur(40px)",
                        opacity: 0.18,
                        pointerEvents: "none",
                      }}
                    />
                    <div className="an2-kpi-top">
                      <div className="an2-kpi-icon" style={{ background: k.iconBg }}>
                        {k.icon}
                      </div>
                      <div
                        className="an2-kpi-trend"
                        style={{ background: k.trendBg, color: k.trendColor }}
                      >
                        {k.up ? "↑" : "↓"}
                      </div>
                    </div>
                    <div className="an2-kpi-val" style={{ color: k.glow }}>{k.val}</div>
                    <div className="an2-kpi-label">{k.label}</div>
                    <div className="an2-kpi-sub">{k.trend}</div>
                  </div>
                ))}
              </div>

              {/* ── SECTION: REVENUE & SALES ── */}
              <div className="an2-section-head">
                <div className="an2-section-label">Revenue & Sales Trends</div>
                <div className="an2-section-line" />
              </div>

              <div className="an2-grid-full">
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Revenue & Tickets Over Time</div>
                      <div className="an2-card-sub">
                        Combined revenue (line) and tickets sold (bars)
                      </div>
                    </div>
                    <div className="an2-legend" style={{ margin: 0 }}>
                      <div className="an2-legend-item">
                        <div className="an2-legend-sq" style={{ background: "#a78bfa" }} />
                        <span style={{ color: "#c4b5fd" }}>Revenue</span>
                      </div>
                      <div className="an2-legend-item">
                        <div className="an2-legend-sq" style={{ background: "#06b6d4" }} />
                        <span style={{ color: "#7dd3fc" }}>Tickets</span>
                      </div>
                    </div>
                  </div>
                  <div className="an2-card-body">
                    {chartJsLoaded ? (
                      <RevenueChart events={events} range={range} chartJsLoaded={chartJsLoaded} />
                    ) : (
                      <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sub)" }}>
                        Loading chart…
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="an2-grid-2">
                {/* Ticket Type Chart */}
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Ticket Type Distribution</div>
                      <div className="an2-card-sub">Standard · Premium · VIP breakdown</div>
                    </div>
                    <div
                      className="an2-card-badge"
                      style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)" }}
                    >
                      {popularType} leads
                    </div>
                  </div>
                  <div className="an2-card-body">
                    {chartJsLoaded ? (
                      <TicketTypeChart events={events} chartJsLoaded={chartJsLoaded} />
                    ) : (
                      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sub)" }}>
                        Loading…
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Events Ranking */}
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Top Events by Revenue</div>
                      <div className="an2-card-sub">Ranked by total earnings</div>
                    </div>
                    <div
                      className="an2-card-badge"
                      style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                      👑 Top {Math.min(totalEvents, 5)}
                    </div>
                  </div>
                  <div className="an2-card-body">
                    <TopEventsRanking events={events} />
                  </div>
                </div>
              </div>

              {/* ── SECTION: CAPACITY & AUDIENCE ── */}
              <div className="an2-section-head">
                <div className="an2-section-label">Capacity & Audience Insights</div>
                <div className="an2-section-line" />
              </div>

              <div className="an2-grid-3">
                {/* Occupancy Rings */}
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Seat Occupancy</div>
                      <div className="an2-card-sub">Per-event fill rate</div>
                    </div>
                    <div
                      className="an2-card-badge"
                      style={{
                        background: avgOccupancy > 70 ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                        color: avgOccupancy > 70 ? "#10b981" : "#f59e0b",
                        border: `1px solid ${avgOccupancy > 70 ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`,
                      }}
                    >
                      Avg {avgOccupancy}%
                    </div>
                  </div>
                  <div className="an2-card-body">
                    <OccupancyRings events={events} />
                  </div>
                </div>

                {/* Heatmap */}
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Peak Booking Times</div>
                      <div className="an2-card-sub">When your audience books</div>
                    </div>
                  </div>
                  <div className="an2-card-body">
                    <PeakHeatmap events={events} />
                  </div>
                </div>

                {/* Category Donut */}
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Tickets by Category</div>
                      <div className="an2-card-sub">Event type breakdown</div>
                    </div>
                  </div>
                  <div className="an2-card-body">
                    {chartJsLoaded ? (
                      <CategoryDonut events={events} chartJsLoaded={chartJsLoaded} />
                    ) : (
                      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sub)" }}>
                        Loading…
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION: FINANCIAL OVERVIEW ── */}
              <div className="an2-section-head">
                <div className="an2-section-label">Financial Overview</div>
                <div className="an2-section-line" />
              </div>

              <div className="an2-grid-main">
                {/* Category Revenue Items */}
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Revenue by Event Category</div>
                      <div className="an2-card-sub">Earnings breakdown per event type</div>
                    </div>
                  </div>
                  <div className="an2-card-body">
                    <CategoryItems events={events} />
                  </div>
                </div>

                {/* Revenue Gauge */}
                <div className="an2-card">
                  <div className="an2-card-head">
                    <div>
                      <div className="an2-card-title">Revenue Target</div>
                      <div className="an2-card-sub">Progress toward monthly goal</div>
                    </div>
                  </div>
                  <div className="an2-card-body">
                    <RevenueGauge revenue={totalRevenue} totalEvents={totalEvents} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}