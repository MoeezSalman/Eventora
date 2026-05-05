import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import ProfileHeader from "./ProfileHeader";

const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'DM Sans', sans-serif; background: #090b14; color: #f8fafc; }
  .tickets-shell { max-width: 1120px; margin: 0 auto; padding: 24px; }
  .tickets-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 24px; }
  .tickets-title { font-size: clamp(26px, 3vw, 34px); font-weight: 800; }
  .tickets-subtitle { color: #9ca3af; margin-top: 8px; max-width: 720px; }
  .ticket-tabs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
  .ticket-tab { padding: 10px 18px; border-radius: 999px; border: 1px solid rgba(148,163,184,0.18); background: rgba(255,255,255,0.04); color: #d1d5db; cursor: pointer; font-weight: 700; }
  .ticket-tab.active { background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; border-color: transparent; }
  .tickets-grid { display: grid; gap: 18px; }
  .ticket-card { padding: 22px; border-radius: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 18px 50px rgba(0,0,0,0.18); }
  .ticket-card-header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .ticket-title { font-size: 18px; font-weight: 800; color: #fff; }
  .ticket-meta { color: #9ca3af; font-size: 13px; margin-top: 4px; }
  .ticket-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
  .detail-item { display: flex; flex-direction: column; gap: 6px; color: #d1d5db; }
  .detail-key { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9ca3af; }
  .detail-value { font-size: 14px; color: #f8fafc; font-weight: 700; }
  .ticket-actions { display: flex; flex-wrap: wrap; gap: 10px; }
  .ticket-btn { padding: 10px 16px; border-radius: 12px; border: none; cursor: pointer; font-weight: 700; transition: transform 0.2s; }
  .ticket-btn:hover { transform: translateY(-1px); }
  .download-btn { background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; }
  .cancel-btn { background: rgba(239,68,68,0.16); color: #fecaca; border: 1px solid rgba(239,68,68,0.35); }
  .cancel-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .status-upcoming { background: rgba(59,130,246,0.16); color: #93c5fd; }
  .status-past { background: rgba(16,185,129,0.16); color: #86efac; }
  .status-cancelled { background: rgba(239,68,68,0.16); color: #fecaca; }
  .empty-state { padding: 42px 24px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); text-align: center; color: #9ca3af; }
  @media (max-width: 680px) { .ticket-details { grid-template-columns: 1fr; } }
`;

const formatDate = (value) => {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const { bookings } = await getMyBookings();
        setBookings(bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your tickets.");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const now = new Date();

  const parseEventDate = (booking) => {
    const rawDate = booking.event?.eventDate || booking.eventDate || booking.date;
    if (!rawDate) return null;
    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getStatus = (booking) => {
    if (booking.status === "cancelled") return "cancelled";
    const eventDate = parseEventDate(booking);
    if (eventDate && eventDate > now) return "upcoming";
    return "past";
  };

  const canCancelBooking = (booking) => {
    if (booking.status === "cancelled") return false;
    const eventDate = parseEventDate(booking);
    return !eventDate || eventDate > now;
  };

  const categorizeBookings = () => {
    const upcoming = [];
    const past = [];
    const cancelled = [];

    bookings.forEach((booking) => {
      const status = getStatus(booking);
      if (status === "cancelled") cancelled.push(booking);
      else if (status === "upcoming") upcoming.push(booking);
      else past.push(booking);
    });

    return { upcoming, past, cancelled };
  };

  const categorized = categorizeBookings();
  const currentList = categorized[activeTab];

  const handleCancel = async (booking) => {
    if (booking.status === "cancelled") return;
    if (!window.confirm("Are you sure you want to cancel this ticket? This action cannot be undone.")) return;

    try {
      setCancellingId(booking._id);
      setError("");
      setMessage("");
      await cancelBooking(booking._id);
      setBookings((prev) =>
        prev.map((item) => (item._id === booking._id ? { ...item, status: "cancelled" } : item))
      );
      setMessage("Ticket cancelled successfully. The status has been updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel ticket.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <ProfileHeader />
      <div className="tickets-shell">
        <div className="tickets-header">
          <div>
            <h1 className="tickets-title">My Tickets</h1>
            <p className="tickets-subtitle">View your active and past tickets with full event, seat, and payment details.</p>
          </div>
        </div>

        <div className="ticket-tabs">
          {[
            { id: "upcoming", label: "Upcoming events" },
            { id: "past", label: "Past bookings" },
            { id: "cancelled", label: "Cancelled tickets" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`ticket-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({categorized[tab.id].length})
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "#d1d5db" }}>Loading your tickets...</p>}
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        {message && <p style={{ color: "#34d399" }}>{message}</p>}

        {!loading && currentList.length === 0 && (
          <div className="empty-state">
            {activeTab === "upcoming" && "No upcoming bookings yet. Book an event to add your next ticket."}
            {activeTab === "past" && "No past bookings yet. Your completed tickets will appear here."}
            {activeTab === "cancelled" && "No cancelled tickets yet. Cancelled bookings will appear here."}
          </div>
        )}

        <div className="tickets-grid">
          {currentList.map((booking) => {
            const status = getStatus(booking);
            const eventDate = booking.event?.eventDate || booking.eventDate || booking.date;
            const canCancel = activeTab === "upcoming" && canCancelBooking(booking);
            return (
              <div key={booking._id} className="ticket-card">
                <div className="ticket-card-header">
                  <div>
                    <div className="ticket-title">{booking.event?.title || booking.eventTitle || "Untitled event"}</div>
                    <div className="ticket-meta">{booking.event?.venue || booking.venue || "Venue TBA"}</div>
                  </div>
                  <div className={`status-pill status-${status}`}>{status === "cancelled" ? "Cancelled" : status === "upcoming" ? "Upcoming" : "Past"}</div>
                </div>

                <div className="ticket-details">
                  <div className="detail-item">
                    <span className="detail-key">Event date</span>
                    <span className="detail-value">{formatDate(eventDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Ticket code</span>
                    <span className="detail-value">{booking.ticketCode || booking.code || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Ticket type</span>
                    <span className="detail-value">{booking.ticketType || "General"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Quantity</span>
                    <span className="detail-value">{booking.ticketCount || booking.quantity || 1}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Seats</span>
                    <span className="detail-value">{booking.seats?.join(", ") || "TBA"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Paid</span>
                    <span className="detail-value">Rs. {(booking.totalPaid || booking.subtotal || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="ticket-actions">
                  <button className="ticket-btn download-btn" onClick={() => navigate("/booking-confirmed", { state: { booking } })}>
                    Download Ticket
                  </button>
                  {canCancel && (
                    <button
                      className="ticket-btn cancel-btn"
                      onClick={() => handleCancel(booking)}
                      disabled={cancellingId === booking._id}
                    >
                      {cancellingId === booking._id ? "Cancelling..." : "Cancel Ticket"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
