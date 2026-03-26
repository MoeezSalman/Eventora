
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
const styles = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0b0b12; font-family: 'DM Sans', sans-serif; color: #fff; }

  .page-bg {
    min-height: 100vh;
    background: #0b0b12;
    background-image:
      radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 50%);
  }
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 16px 40px;
  }
  .ticket-card {
    background: linear-gradient(145deg, #12122a, #1a1a35);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  .details-card {
    background: #13131f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px;
  }
  .detail-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 13px;
  }
  .detail-row:last-child { border-bottom: none; }
  .dashed-divider { border: none; border-top: 1px dashed rgba(255,255,255,0.1); margin: 0 20px; }
  .seat-chip {
    display: inline-flex; align-items: center; justify-content: center;
    background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.4);
    border-radius: 8px; padding: 5px 12px; font-size: 13px; font-weight: 600;
  }
  .whats-next-card {
    background: #13131f; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 18px 20px; margin-top: 16px;
  }
  .step-dot {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0; color: #fff;
  }
  .qr-wrap {
    width: 80px; height: 80px; background: #fff; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; padding: 6px;
  }

  /* Responsive */
  @media (max-width: 700px) {
    .content-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 420px) {
    .event-meta-row { flex-direction: column; gap: 12px !important; }
  }
`;



export default function BookingConfirmedPage() {
  const navigate = useNavigate();
const location = useLocation();

const booking = location.state || {
  eventTitle: "Sample Event",
  venue: "Sample Venue",
  date: "22 Mar 2025",
  time: "7:00 PM",
  gateOpens: "6:00 PM",
  email: "user@example.com",
  bookingId: "EVT239184",
  ticketCode: "EVT-92A7-4ED1",
  seats: ["A12", "A13"],
  ticketType: "Premium",
  ticketCount: 2,
  subtotal: 9000,
  serviceFee: 450,
  totalPaid: 9450,
  paymentStatus: "Paid",
};
  return (
    <>
      <style>{styles}</style>
      <div className="page-bg">

        {/* Navbar */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 52, borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(11,11,18,0.95)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
            <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚡</div>
            Eventora
          </div>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>M</div>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '44px 16px 28px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #10b981', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>
            Booking <span style={{ color: '#10b981' }}>Confirmed!</span>
          </h1>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
            Your tickets are secured. A confirmation with your QR pass has been sent to{' '}
            <strong style={{ color: '#fff' }}>{booking.email}</strong>
          </p>
        </div>

        {/* Grid */}
        <div className="content-grid">

          {/* LEFT: Ticket Card */}
          <div className="ticket-card">
            <div style={{ padding: '20px 20px 16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#10b981', fontWeight: 600, marginBottom: 14 }}>
                ✦ Booking Confirmed
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                {booking.eventTitle}
              </h2>
              <p style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>📍 {booking.venue}</p>
              <div className="event-meta-row" style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                {[
  { label: 'DATE', value: booking.date },
  { label: 'TIME', value: booking.time },
  { label: 'GATE OPENS', value: booking.gateOpens },
].map(item => (
  <div key={item.label}>
    <p style={{ fontSize: '10px', color: '#666', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 3 }}>
      {item.label}
    </p>
    <p style={{ fontSize: 14, fontWeight: 700 }}>{item.value}</p>
  </div>
))}
              </div>
            </div>

            <hr className="dashed-divider" />

            <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div className="qr-wrap">
  <QRCode
  value={`
Booking ID: ${booking.bookingId}
Ticket Code: ${booking.ticketCode}
Event: ${booking.eventTitle}
Venue: ${booking.venue}
Date: ${booking.date}
Time: ${booking.time}
Seats: ${(booking.seats || []).join(", ")}
Ticket Type: ${booking.ticketType}
Total Paid: Rs. ${booking.totalPaid}
  `}
  size={68}
  bgColor="#FFFFFF"
  fgColor="#000000"
/>
</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Scan at the entrance</p>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 12 }}>
                  Present this QR code at the venue gate. Each seat holder must show a valid pass.
                </p>
                <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: '#bbb', fontFamily: 'monospace' }}>
                  {booking.ticketCode}
                </div>
              </div>
            </div>

            <hr className="dashed-divider" />

            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(booking.seats || []).map(s => (
  <span key={s} className="seat-chip">{s}</span>
))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, padding: '5px 14px' }}>
                {booking.ticketType} Tickets
              </span>
            </div>
          </div>

          {/* RIGHT: Details + What's Next */}
          <div>
            <div className="details-card">
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Booking Details</p>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>Reference & payment summary</p>

              {[
  { label: 'Booking ID', value: `#${booking.bookingId}` },
  { label: 'Tickets', value: `${booking.ticketCount} × ${booking.ticketType}` },
  { label: 'Seats', value: (booking.seats || []).join(', ') },
  { label: 'Subtotal', value: `Rs. ${booking.subtotal.toLocaleString()}` },
  { label: 'Service Fee', value: `Rs. ${booking.serviceFee.toLocaleString()}` },
  { label: 'Payment Status', value: booking.paymentStatus, highlight: true },
  { label: 'Total Paid', value: `Rs. ${booking.totalPaid.toLocaleString()}`, bold: true },
].map(row => (
  <div key={row.label} className="detail-row">
    <span style={{ color: '#888' }}>{row.label}</span>
    <span
      style={{
        fontWeight: row.bold ? 700 : 500,
        fontSize: row.bold ? 15 : 13,
        color: row.highlight ? '#10b981' : row.bold ? '#a78bfa' : '#fff'
      }}
    >
      {row.value}
    </span>
  </div>
))}

              <button style={{ width: '100%', marginTop: 18, padding: 13, background: 'linear-gradient(90deg,#8b5cf6,#ec4899)', border: 'none', borderRadius: 12, color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 10 }}>
                ⬇ Download Ticket
              </button>
              <button style={{ width: '100%', padding: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#ccc', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                ⬆ Share Ticket
              </button>
            </div>

            <div className="whats-next-card">
              <p style={{ fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>WHAT'S NEXT</p>
              {[
                { num: 1, color: '#8b5cf6', bg: 'rgba(139,92,246,0.2)', text: <><strong>Arrive 30 minutes early</strong> for smooth entry.</> },
                { num: 2, color: '#06b6d4', bg: 'rgba(6,182,212,0.2)',   text: <>Show your <strong>QR ticket</strong> at the entrance gate.</> },
                { num: 3, color: '#10b981', bg: 'rgba(16,185,129,0.2)',  text: <>Enjoy the event and keep your seat number handy.</> },
              ].map(step => (
                <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div className="step-dot" style={{ background: step.bg, color: step.color }}>{step.num}</div>
                  <p style={{ fontSize: 13, color: '#bbb', lineHeight: 1.6, paddingTop: 2 }}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}