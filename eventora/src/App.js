import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventDetailPage from "./components/EventDetailPage";
import SeatSelectionPage from "./components/SeatSelectionPage";
import BookingConfirmedPage from "./components/BookingConfirmedPage";
import Dashboard from "./components/Dashboard";
import EventoraAuth from "./components/EventoraAuth";
import OrganizerDashboard from "./components/OrganizerDashboard";
import OrganizerAnalyticsPage from "./components/OrganizerAnalyticsPage";
import HistoryPage from "./components/HistoryPage";
import MyTicketsPage from "./components/MyTicketsPage";
import ProfilePage from "./components/ProfilePage";
import BookingsMonitoringPage from "./components/BookingsMonitoringPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventoraAuth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer-analytics" element={<OrganizerAnalyticsPage />} />
        <Route path="/bookings" element={<BookingsMonitoringPage />} />
        <Route path="/tickets" element={<MyTicketsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/seat-selection/:id" element={<SeatSelectionPage />} />
        <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;