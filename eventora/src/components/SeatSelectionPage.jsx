import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, getEventSeats } from "../services/eventService";
import { createBooking } from "../services/bookingService";

const styles = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0b0b12; font-family: 'DM Sans', sans-serif; color: #fff; }

  .seat-btn {
    width: 16px; height: 16px; border-radius: 3px; border: none; cursor: pointer;
    transition: transform 0.1s; flex-shrink: 0;
  }
  .seat-btn:hover:not(:disabled) { transform: scale(1.3); z-index: 2; position: relative; }
  .seat-btn:disabled { cursor: not-allowed; opacity: 0.4; }

  .ticket-type-btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03); cursor: pointer; margin-bottom: 8px;
    transition: border-color 0.2s, background 0.2s;
    font-family: 'DM Sans', sans-serif; width: 100%;
  }
  .ticket-type-btn.active { border-color: #7c3aed; background: rgba(124,58,237,0.12); }

  .selected-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(124,58,237,0.25); border: 1px solid rgba(124,58,237,0.5);
    border-radius: 20px; padding: 4px 10px; font-size: 12px; font-weight: 600;
  }

  .step-circle {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }

  /* Desktop */
  .main-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    min-height: calc(100vh - 52px);
  }
  .seat-map-scroll { padding: 20px 16px 32px; overflow-x: auto; }
  .sidebar { border-left: 1px solid rgba(255,255,255,0.07); background: #0f0f18; display: flex; flex-direction: column; }

  /* Tablet */
  @media (max-width: 860px) {
    .main-layout { grid-template-columns: 1fr; }
    .sidebar { border-left: none; border-top: 1px solid rgba(255,255,255,0.07); }
    .nav-steps { display: none !important; }
  }

  /* Mobile */
  @media (max-width: 520px) {
    .seat-btn { width: 11px; height: 11px; border-radius: 2px; }
    .seat-map-scroll { padding: 14px 8px 24px; }
  }
`;

function buildSection(rows, seatsPerRow, type, prefix) {
  return rows.map(row => ({
    row,
    seats: Array.from({ length: seatsPerRow }, (_, i) => ({
      id: `${prefix}_${row}${i + 1}`,
      label: `${row}${i + 1}`,
      taken: false,
      type,
    }))
  }));
}

function SeatRow({ rowLabel, seats, selected, onToggle }) {
  const half = Math.floor(seats.length / 2);

  const color = (seat) => {
    if (seat.isBooked) return "#3a3a3a";
    if (selected.includes(seat.code)) return "#7c3aed";
    if (seat.tier === "VIP") return "#78400a";
    if (seat.tier === "Premium") return "#0e3a3a";
    return "#1e2340";
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
      <span style={{ width: 12, fontSize: 9, color: "#555", textAlign: "right", flexShrink: 0 }}>
        {rowLabel}
      </span>

      <div style={{ display: "flex", gap: 2 }}>
        {seats.slice(0, half).map((seat) => (
          <button
            key={seat.code}
            className="seat-btn"
            disabled={seat.isBooked}
            style={{ background: color(seat) }}
            onClick={() => onToggle(seat.code)}
            title={seat.code}
          />
        ))}
      </div>

      <div style={{ width: 14, flexShrink: 0 }} />

      <div style={{ display: "flex", gap: 2 }}>
        {seats.slice(half).map((seat) => (
          <button
            key={seat.code}
            className="seat-btn"
            disabled={seat.isBooked}
            style={{ background: color(seat) }}
            onClick={() => onToggle(seat.code)}
            title={seat.code}
          />
        ))}
      </div>

      <span style={{ width: 12, fontSize: 9, color: "#555", flexShrink: 0 }}>
        {rowLabel}
      </span>
    </div>
  );
}
function groupSeatsByTierAndRow(seats = []) {
  const grouped = {
    VIP: {},
    Premium: {},
    Standard: {},
  };

  seats.forEach((seat) => {
    const row = seat.code.charAt(0); // A, B, C...
    if (!grouped[seat.tier][row]) grouped[seat.tier][row] = [];
    grouped[seat.tier][row].push(seat);
  });

  const sortRows = (rowsObj) =>
    Object.entries(rowsObj).map(([row, seats]) => ({
      row,
      seats: seats.sort((a, b) => {
        const aNum = parseInt(a.code.slice(1), 10);
        const bNum = parseInt(b.code.slice(1), 10);
        return aNum - bNum;
      }),
    }));

  return {
    VIP: sortRows(grouped.VIP),
    Premium: sortRows(grouped.Premium),
    Standard: sortRows(grouped.Standard),
  };
}
export default function SeatSelectionPage() {
  const { id } = useParams();
const [event, setEvent] = useState(null);
const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeType, setActiveType] = useState('premium');

const [seatRows, setSeatRows] = useState({
  VIP: [],
  Premium: [],
  Standard: [],
});
const allSeats = useMemo(() => {
  return [...seatRows.VIP, ...seatRows.Premium, ...seatRows.Standard].flatMap(
    (rowGroup) => rowGroup.seats
  );
}, [seatRows]);

  const seatTypeLabel = {
  standard: "Standard",
  premium: "Premium",
  vip: "VIP",
};

const selectedSeatObjects = selectedSeats
  .map((code) => allSeats.find((seat) => seat.code === code))
  .filter(Boolean);

const ticketType =
  selectedSeatObjects.length > 0
    ? selectedSeatObjects[0].tier
    : activeType === "vip"
    ? "VIP"
    : activeType === "premium"
    ? "Premium"
    : "Standard";

const bookingId = `EVT${Math.floor(100000 + Math.random() * 900000)}`;
const ticketCode = `EVT-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const toggleSeat = (id) =>
    setSelectedSeats(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

const totalPrice = selectedSeatObjects.reduce((sum, seat) => sum + (seat.price || 0), 0);
  const serviceFee = Math.round(totalPrice * 0.05);
  const getLabel = (code) => allSeats.find((s) => s.code === code)?.code ?? code;

  const steps = [
    { num: 1, label: 'Choose Tickets', done: true },
    { num: 2, label: 'Select Seats', active: true },
    { num: 3, label: 'Checkout' },
    { num: 4, label: 'Confirmation' },
  ];
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const eventRes = await getEventById(id);
      setEvent(eventRes.event || eventRes);

      const seatRes = await getEventSeats(id);
const seatEvent = seatRes.event || seatRes;
setSeatRows(groupSeatsByTierAndRow(seatEvent.seats || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);
const handleCheckout = async () => {
  if (selectedSeats.length === 0 || !event) return;

  try {
    const payload = {
      eventId: event._id || event.id,
      seats: selectedSeats,
      ticketType: ticketType,
      ticketCount: selectedSeats.length,
      subtotal: totalPrice,
      serviceFee,
      totalPaid: totalPrice + serviceFee,
    };

    const res = await createBooking(payload);
    const booking = res.booking || res;
    navigate("/booking-confirmed", {
      state: {
        eventTitle: event.title || event.name,
        venue: event.venue || event.location,
        date: event.eventDate
          ? new Date(event.eventDate).toLocaleDateString()
          : "Date TBA",

        time: event.gateOpens || "Time TBA",
        gateOpens: event.gateOpens || "Time TBA",
        email: booking.email || "user@example.com",
        bookingId: booking.bookingId || bookingId,
        ticketCode: booking.ticketCode || ticketCode,
        seats: booking.seats || selectedSeats,
        ticketType: booking.ticketType || ticketType,
        ticketCount: booking.ticketCount || selectedSeats.length,
        subtotal: booking.subtotal || totalPrice,
        serviceFee: booking.serviceFee || serviceFee,
        totalPaid: booking.totalPaid || totalPrice + serviceFee,
        paymentStatus: booking.paymentStatus || "Paid",
      },
    });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Booking failed");
  }
};
const tierPriceMap = useMemo(() => {
  const map = {
    Standard: 0,
    Premium: 0,
    VIP: 0,
  };

  (event?.ticketTiers || []).forEach((tier) => {
    if (tier.name === "Standard") map.Standard = Number(tier.price) || 0;
    if (tier.name === "Premium") map.Premium = Number(tier.price) || 0;
    if (tier.name === "VIP") map.VIP = Number(tier.price) || 0;
  });

  return map;
}, [event]);

const ticketTypes = [
  {
    key: "standard",
    label: "Standard",
    price: tierPriceMap.Standard,
    dot: "#6366f1",
  },
  {
    key: "premium",
    label: "Premium",
    price: tierPriceMap.Premium,
    dot: "#06b6d4",
  },
  {
    key: "vip",
    label: "VIP",
    price: tierPriceMap.VIP,
    dot: "#f59e0b",
  },
];
if (loading) return <div style={{ color: "#fff", padding: 20 }}>Loading seats...</div>;
if (!event) return <div style={{ color: "#fff", padding: 20 }}>Event not found</div>;

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: '100vh', background: '#0b0b12' }}>

        {/* Navbar */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52, borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0b0b12', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 16 }}>
              <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚡</div>
              Eventora
            </div>
            <button onClick={() => navigate(`/event/${id}`)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#bbb', padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>
              ← Event Details
            </button>
          </div>

          <div className="nav-steps" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div className="step-circle" style={{ background: s.done ? '#22c55e' : s.active ? '#7c3aed' : 'rgba(255,255,255,0.1)', color: s.done || s.active ? '#fff' : '#555' }}>
                    {s.done ? '✓' : s.num}
                  </div>
                  <span style={{ color: s.active ? '#fff' : s.done ? '#aaa' : '#555', fontWeight: s.active ? 600 : 400 }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />}
              </div>
            ))}
          </div>

          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>M</div>
        </nav>

        <div className="main-layout">

          {/* LEFT: Seat Map */}
          <div className="seat-map-scroll">
           <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>
  Select Your Seats
</h2>
<p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
  {(event.venue || event.location || "Venue TBA")} · Capacity {event.seats?.length || 0}
</p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
              {['+', '−', '↺'].map(icon => (
                <button key={icon} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#ccc', fontSize: 14, cursor: 'pointer' }}>{icon}</button>
              ))}
            </div>

            <div style={{ minWidth: 360 }}>
              <div style={{ background: 'linear-gradient(90deg,#1a1040,#2d1b6e,#1a1040)', borderRadius: 40, padding: '10px 0', textAlign: 'center', marginBottom: 4, marginLeft: 20, marginRight: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#bbb' }}>STAGE</span>
              </div>
              <p style={{ textAlign: 'center', fontSize: 9, color: '#555', marginBottom: 16 }}>Main Performance Area</p>

              <div style={{ marginBottom: 14 }}>
               <p style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", textAlign: "center", letterSpacing: "0.08em", marginBottom: 8 }}>
  ⭐ VIP SECTION — RS. 8500
</p>
                {seatRows.VIP.map(({ row, seats }) => (
  <div key={row} style={{ display: "flex", justifyContent: "center" }}>
    <SeatRow rowLabel={row} seats={seats} selected={selectedSeats} onToggle={toggleSeat} />
  </div>
))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", textAlign: "center", letterSpacing: "0.08em", marginBottom: 8 }}>
  💎 PREMIUM SECTION — RS. 4500
</p>
                {seatRows.Premium.map(({ row, seats }) => (
  <div key={row} style={{ display: "flex", justifyContent: "center" }}>
    <SeatRow rowLabel={row} seats={seats} selected={selectedSeats} onToggle={toggleSeat} />
  </div>
))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#888", textAlign: "center", letterSpacing: "0.08em", marginBottom: 8 }}>
  STANDARD SECTION — RS. 2500
</p>
                {seatRows.Standard.map(({ row, seats }) => (
  <div key={row} style={{ display: "flex", justifyContent: "center" }}>
    <SeatRow rowLabel={row} seats={seats} selected={selectedSeats} onToggle={toggleSeat} />
  </div>
))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                {[
                  { color: '#1e2340', label: 'Available' },
                  { color: '#7c3aed', label: 'Selected' },
                  { color: '#78400a', label: 'VIP' },
                  { color: '#0e3a3a', label: 'Premium' },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#999' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: color, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="sidebar">
            <div style={{ height: 90, background: 'linear-gradient(135deg,#1a1040,#4c1d95,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 44, transform: 'rotate(-15deg)', filter: 'drop-shadow(0 4px 12px rgba(239,68,68,0.5))' }}>🎸</span>
            </div>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>
    {event.title || event.name}
  </p>
  
  <p style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>
    🕐 {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date TBA"}
  </p>
  <p style={{ fontSize: 12, color: '#888' }}>
    📍 {event.venue || event.location || "Location TBA"}
  </p>
</div>

            <div style={{ padding: 14, flex: 1, overflowY: 'auto' }}>
              <p style={{ fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>TICKET TYPE</p>
              {ticketTypes.map((t) => (
                <button key={t.key} className={`ticket-type-btn ${activeType === t.key ? 'active' : ''}`} onClick={() => setActiveType(t.key)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#ddd', fontWeight: 500 }}>{t.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: activeType === t.key ? '#a78bfa' : '#aaa' }}>{t.price}</span>
                </button>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 8 }}>
                <p style={{ fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>SELECTED SEATS ({selectedSeats.length})</p>
                {selectedSeats.length > 0 && (
                  <button onClick={() => setSelectedSeats([])} style={{ fontSize: 11, color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Clear all</button>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 32 }}>
                {selectedSeats.length === 0 && <p style={{ fontSize: 12, color: '#444' }}>No seats selected</p>}
                {selectedSeats.map(id => (
                  <span key={id} className="selected-tag">
                    {getLabel(id)}
                    <button onClick={() => toggleSeat(id)} style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: 14, flexShrink: 0 }}>
              {selectedSeats.length > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999', marginBottom: 5 }}>
                    <span>Tickets ({selectedSeats.length})</span><span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999', marginBottom: 10 }}>
                    <span>Service fee</span><span>Rs. {serviceFee.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                    <span>Total</span><span style={{ color: '#a78bfa' }}>Rs. {(totalPrice + serviceFee).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 12, color: '#555', marginBottom: 12, textAlign: 'center' }}>Select seats to see pricing</p>
              )}
              <button
  onClick={handleCheckout}
  disabled={selectedSeats.length === 0}
  style={{
    width: '100%',
    padding: 13,
    background: selectedSeats.length > 0
      ? 'linear-gradient(90deg,#8b5cf6,#ec4899)'
      : 'rgba(255,255,255,0.06)',
    border: 'none',
    borderRadius: 12,
    color: selectedSeats.length > 0 ? '#fff' : '#555',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: 14,
    cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
    marginBottom: 8
  }}
>
  Proceed to Checkout →
</button>
              <p style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>🔒 Seats held for 8 mins after selection</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}