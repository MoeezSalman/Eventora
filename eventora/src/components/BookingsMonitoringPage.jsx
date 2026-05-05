import { useState, useEffect } from "react";
import { getOrganizerEvents } from "../services/organizerService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  }

  body { background: var(--bg); color: var(--text); font-family: 'Instrument Sans', sans-serif; }

  .monitoring-shell {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 10% 0%, rgba(139,92,246,0.08) 0%, transparent 45%),
      radial-gradient(ellipse at 90% 100%, rgba(236,72,153,0.05) 0%, transparent 40%);
  }

  .monitoring-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 58px;
    border-bottom: 1px solid var(--border);
    background: rgba(8,8,16,0.92);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 200;
  }

  .monitoring-page { max-width: 1360px; margin: 0 auto; padding: 28px 32px 60px; }

  .page-title { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; margin-bottom:8px; }
  .page-sub { font-size:14px; color:var(--muted); margin-bottom:20px; }

  .controls { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 24px; 
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn { 
    display: inline-flex; align-items: center; gap: 8px; 
    padding: 11px 20px; border-radius: 10px; 
    font-family: 'Instrument Sans', sans-serif; 
    font-size: 14px; font-weight: 600; 
    cursor: pointer; border: none; transition: all 0.2s; 
  }

  .btn-primary { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: #fff; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

  .btn-secondary { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
  .btn-secondary:hover { border-color: var(--border-hi); }

  .search-box {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 9px 14px; flex: 1; max-width: 250px;
  }

  .search-box input {
    background: none; border: none; outline: none; color: var(--text);
    font-size: 13px; font-family: inherit; width: 100%;
  }

  .events-tabs {
    display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;
  }

  .event-tab {
    padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); cursor: pointer;
    font-size: 13px; font-weight: 600; transition: all 0.2s;
  }

  .event-tab.active {
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    color: #fff; border-color: transparent;
  }

  .event-tab:hover { border-color: var(--border-hi); }

  .bookings-container {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    overflow-x: auto;
  }

  .bookings-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .bookings-table th {
    color: var(--muted);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0 0 12px 0;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }

  .bookings-table td {
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    color: var(--text);
    vertical-align: middle;
  }

  .bookings-table tr:last-child td { border-bottom: none; }

  .attendee-info {
    display: flex; align-items: center; gap: 10px;
  }

  .attendee-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }

  .attendee-name { font-weight: 600; }
  .attendee-email { color: var(--muted); font-size: 12px; }

  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
    white-space: nowrap;
  }

  .status-confirmed { background: rgba(16, 185, 129, 0.15); color: #10b981; }
  .status-cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

  .stats-row { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 16px; 
    margin-bottom: 24px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
  }

  .stat-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
  .stat-value { font-size: 24px; font-weight: 800; color: #a78bfa; }

  .empty-state {
    text-align: center;
    padding: 48px 24px;
    color: var(--muted);
  }

  .empty-icon { font-size: 48px; margin-bottom: 12px; }

  @media (max-width: 800px) {
    .monitoring-page { padding: 20px 16px 48px; }
    .monitoring-nav { padding: 0 16px; }
    .controls { flex-direction: column; align-items: stretch; }
    .search-box { max-width: 100%; }
    .bookings-table { font-size: 12px; }
    .bookings-table td, .bookings-table th { padding: 10px 0; }
  }
`;

const formatPKR = (value) => {
  return `Rs. ${(Number(value) || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  })}`;
};

const formatEventDate = (dateStr) => {
  if (!dateStr) return "Date TBA";
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", { 
      day: "numeric", 
      month: "short", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return "Date TBA";
  }
};

export default function BookingsMonitoringPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getOrganizerEvents();
      const eventList = res.events || [];
      setEvents(eventList);
      if (eventList.length > 0) {
        setSelectedEventId(eventList[0]._id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const selectedEvent = events.find((e) => e._id === selectedEventId);
  const bookings = selectedEvent?.bookings || [];

  const filteredBookings = bookings.filter((b) => {
    const name = (b.user?.name || b.name || "").toLowerCase();
    const email = (b.user?.email || b.email || "").toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  const stats = {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    cancelledBookings: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.totalPaid || 0), 0),
  };

  const exportBookingsCSV = () => {
    if (filteredBookings.length === 0) {
      alert("No bookings to export");
      return;
    }

    const headers = ["Attendee", "Email", "Seats", "Ticket Type", "Amount", "Status", "Booked Date"];
    const rows = filteredBookings.map((b) => [
      b.user?.name || b.name || "N/A",
      b.user?.email || b.email || "N/A",
      (b.seats || []).join(", ") || "N/A",
      b.ticketType || "Standard",
      b.totalPaid || 0,
      b.status || "confirmed",
      new Date(b.createdAt).toLocaleString("en-GB"),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendees-${selectedEvent?.title || "export"}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBookingsPDF = () => {
    if (filteredBookings.length === 0) {
      alert("No bookings to export");
      return;
    }

    try {
      const safeTitle = (selectedEvent?.title || "export").replace(/[\\/:*?"<>|]/g, "-");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(16);
      doc.text(`Attendee List - ${selectedEvent?.title || "Event"}`, 14, 15);

      doc.setFontSize(10);
      doc.text(`Venue: ${selectedEvent?.venue || "N/A"}`, 14, 24);
      doc.text(`Date: ${formatEventDate(selectedEvent?.eventDate)}`, 14, 30);
      doc.text(`Total Bookings: ${filteredBookings.length}`, 14, 36);
      doc.text(`Exported: ${new Date().toLocaleDateString("en-GB")}`, 14, 42);

      const tableData = filteredBookings.map((b) => [
        b.user?.name || b.name || "N/A",
        b.user?.email || b.email || "N/A",
        (b.seats || []).join(", ") || "N/A",
        b.ticketType || "Standard",
        formatPKR(b.totalPaid || 0),
        b.status || "confirmed",
      ]);

      autoTable(doc, {
        head: [["Attendee", "Email", "Seats", "Type", "Amount", "Status"]],
        body: tableData,
        startY: 50,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], halign: "center" },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 50 },
          2: { cellWidth: 30 },
          3: { cellWidth: 22 },
          4: { cellWidth: 26 },
          5: { cellWidth: 20 },
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
        },
        margin: { left: 14, right: 14 },
      });

      doc.save(`attendees-${safeTitle}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="monitoring-shell">
        <nav className="monitoring-nav">
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>📊 Bookings Monitor</div>
          <button className="btn btn-primary" onClick={fetchEvents}>🔄 Refresh</button>
        </nav>

        <div className="monitoring-page">
          <div>
            <div className="page-title">Monitor Bookings</div>
            <div className="page-sub">Track ticket sales and manage attendees in real-time.</div>
          </div>

          {loading && <p style={{ color: "#aaa", marginTop: 20 }}>Loading events...</p>}
          {error && <p style={{ color: "#ef4444", marginTop: 20 }}>{error}</p>}

          {!loading && events.length > 0 && (
            <>
              <div className="events-tabs">
                {events.map((e) => (
                  <button
                    key={e._id}
                    className={`event-tab ${selectedEventId === e._id ? "active" : ""}`}
                    onClick={() => setSelectedEventId(e._id)}
                  >
                    {e.title} ({(e.bookings || []).length})
                  </button>
                ))}
              </div>

              {selectedEvent && (
                <>
                  <div className="stats-row">
                    <div className="stat-card">
                      <div className="stat-label">Total Bookings</div>
                      <div className="stat-value">{stats.totalBookings}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Confirmed</div>
                      <div className="stat-value" style={{ color: "#10b981" }}>{stats.confirmedBookings}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Cancelled</div>
                      <div className="stat-value" style={{ color: "#ef4444" }}>{stats.cancelledBookings}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Total Revenue</div>
                      <div className="stat-value">{formatPKR(stats.totalRevenue)}</div>
                    </div>
                  </div>

                  <div className="controls">
                    <div className="search-box">
                      <span>🔍</span>
                      <input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-secondary" onClick={exportBookingsCSV}>
                        📥 Export CSV
                      </button>
                      <button className="btn btn-secondary" onClick={exportBookingsPDF}>
                        📄 Export PDF
                      </button>
                    </div>
                  </div>

                  <div className="bookings-container">
                    {filteredBookings.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>No bookings found</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search query.</div>
                      </div>
                    ) : (
                      <table className="bookings-table">
                        <thead>
                          <tr>
                            <th>Attendee</th>
                            <th>Email</th>
                            <th>Seats</th>
                            <th>Ticket Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Booked Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBookings.map((b, i) => (
                            <tr key={i}>
                              <td>
                                <div className="attendee-info">
                                  <div className="attendee-avatar">{(b.user?.name || b.name || "U")[0]}</div>
                                  <div className="attendee-name">{b.user?.name || b.name || "N/A"}</div>
                                </div>
                              </td>
                              <td style={{ color: "var(--muted)" }}>{b.user?.email || b.email || "N/A"}</td>
                              <td style={{ color: "var(--muted)" }}>{(b.seats || []).join(", ") || "N/A"}</td>
                              <td>
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: "3px 8px",
                                    borderRadius: 14,
                                    background:
                                      b.ticketType === "VIP"
                                        ? "rgba(245, 158, 11, 0.15)"
                                        : b.ticketType === "Premium"
                                        ? "rgba(6, 182, 212, 0.15)"
                                        : "rgba(139, 92, 246, 0.15)",
                                    color:
                                      b.ticketType === "VIP"
                                        ? "#f59e0b"
                                        : b.ticketType === "Premium"
                                        ? "#06b6d4"
                                        : "#a78bfa",
                                  }}
                                >
                                  {b.ticketType || "Standard"}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700 }}>{formatPKR(b.totalPaid || 0)}</td>
                              <td>
                                <span
                                  className={`status-badge status-${b.status || "confirmed"}`}
                                >
                                  {b.status === "cancelled" ? "❌ Cancelled" : "✓ Confirmed"}
                                </span>
                              </td>
                              <td style={{ color: "var(--muted)", fontSize: 12 }}>
                                {new Date(b.createdAt).toLocaleString("en-GB")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {!loading && events.length === 0 && (
            <div className="empty-state" style={{ marginTop: 40 }}>
              <div className="empty-icon">📭</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>No events yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Create an event to start monitoring bookings.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
