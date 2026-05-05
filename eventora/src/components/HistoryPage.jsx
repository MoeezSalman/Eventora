import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import ProfileHeader from "./ProfileHeader";

const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'DM Sans', sans-serif; color: #f8fafc; background: #090b14; }
  .history-shell { max-width: 1120px; margin: 0 auto; padding: 24px; }
  .history-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 24px; }
  .history-title { font-size: clamp(26px, 3vw, 34px); font-weight: 800; }
  .history-tabs { display: flex; flex-wrap: wrap; gap: 10px; }
  .history-tab { padding: 10px 18px; border-radius: 999px; border: 1px solid rgba(148, 163, 184, 0.18); background: rgba(255,255,255,0.04); color: #d1d5db; cursor: pointer; font-weight: 700; }
  .history-tab.active { background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; border-color: transparent; }
  .history-grid { display: grid; gap: 18px; }
  .booking-card { padding: 22px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 18px 50px rgba(0,0,0,0.18); }
  .booking-card-header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .booking-title { font-size: 18px; font-weight: 800; color: #fff; }
  .booking-meta { color: #9ca3af; font-size: 13px; margin-top: 4px; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .badge.upcoming { background: rgba(59,130,246,0.16); color: #93c5fd; }
  .badge.past { background: rgba(16,185,129,0.16); color: #86efac; }
  .badge.cancelled { background: rgba(239,68,68,0.16); color: #fecaca; }
  .booking-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
  .detail-item { display: flex; flex-direction: column; gap: 6px; color: #d1d5db; }
  .detail-key { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9ca3af; }
  .detail-value { font-size: 14px; color: #f8fafc; font-weight: 700; }
  .booking-actions { display: flex; flex-wrap: wrap; gap: 10px; }
  .booking-btn { padding: 10px 16px; border-radius: 12px; border: none; cursor: pointer; font-weight: 700; transition: transform 0.2s; }
  .booking-btn:hover { transform: translateY(-1px); }
  .download-btn { background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; }
  .cancel-btn { background: rgba(255,255,255,0.06); color: #f8fafc; border: 1px solid rgba(239,68,68,0.35); }
  .empty-state { padding: 42px 24px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); text-align: center; color: #9ca3af; }
  @media (max-width: 680px) { .booking-details { grid-template-columns: 1fr; } }
`;

const formatDate = (value) => {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (value) => {
  if (!value) return "TBA";
  return value;
};

export default function HistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const { bookings } = await getMyBookings();
        setBookings(bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const now = useMemo(() => new Date(), [bookings]);

  const categorized = useMemo(() => {
    const upcoming = [];
    const past = [];
    const cancelled = [];

    bookings.forEach((booking) => {
      const eventDate = booking.event?.eventDate ? new Date(booking.event.eventDate) : null;
      if (booking.status === "cancelled") {
        cancelled.push(booking);
      } else if (eventDate && eventDate > now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    return { upcoming, past, cancelled };
  }, [bookings, now]);

  const currentList = categorized[activeTab];

  const handleDownload = (booking) => {
    navigate("/booking-confirmed", { state: { booking } });
  };

  const handleCancel = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <ProfileHeader />
      <div className="history-shell">
        <div className="history-header">
          <div>
            <h1 className="history-title">Booking History</h1>
            <p style={{ color: "#9ca3af", marginTop: 8 }}>
              Review your past, upcoming and cancelled tickets in one place.
            </p>
          </div>

          <div className="history-tabs">
            {[
              { id: "upcoming", label: "Upcoming events" },
              { id: "past", label: "Past bookings" },
              { id: "cancelled", label: "Cancelled tickets" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`history-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} ({categorized[tab.id].length})
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: "#d1d5db" }}>Loading bookings...</p>}
        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        {!loading && currentList.length === 0 && (
          <div className="empty-state">
            {activeTab === "upcoming" && "No upcoming bookings yet. Find your next ticket on the dashboard."}
            {activeTab === "past" && "No past bookings yet. Your completed events will appear here."}
            {activeTab === "cancelled" && "No cancelled bookings yet. Cancelled tickets will appear here."}
          </div>
        )}

        <div className="history-grid">
          {currentList.map((booking) => {
            const eventDate = booking.event?.eventDate || booking.date;
            const status = booking.status || "confirmed";
            const badgeType = status === "cancelled" ? "cancelled" : eventDate && new Date(eventDate) > now ? "upcoming" : "past";
            return (
              <div key={booking._id} className="booking-card">
                <div className="booking-card-header">
                  <div>
                    <div className="booking-title">{booking.event?.title || booking.eventTitle || "Event"}</div>
                    <div className="booking-meta">{booking.event?.venue || booking.venue || "Venue TBA"}</div>
                  </div>
                  <div className={`badge ${badgeType}`}>{status === "cancelled" ? "Cancelled" : badgeType === "upcoming" ? "Upcoming" : "Past"}</div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-key">Date</span>
                    <span className="detail-value">{formatDate(eventDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Gate Opens</span>
                    <span className="detail-value">{formatTime(booking.event?.gateOpens || booking.gateOpens)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Ticket code</span>
                    <span className="detail-value">{booking.ticketCode || booking.code || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Tickets</span>
                    <span className="detail-value">{booking.ticketCount || booking.quantity || 1}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Ticket type</span>
                    <span className="detail-value">{booking.ticketType || "General"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Total Paid</span>
                    <span className="detail-value">Rs. {(booking.totalPaid || booking.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Seats</span>
                    <span className="detail-value">{booking.seats?.join(", ") || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-key">Payment status</span>
                    <span className="detail-value">{booking.paymentStatus || "Paid"}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button className="booking-btn download-btn" onClick={() => handleDownload(booking)}>
                    Download Ticket
                  </button>
                  {status !== "cancelled" && badgeType === "upcoming" && (
                    <button
                      className="booking-btn cancel-btn"
                      onClick={() => handleCancel(booking._id)}
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
