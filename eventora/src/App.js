import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventDetailPage from "./components/EventDetailPage";
import SeatSelectionPage from "./components/SeatSelectionPage";
import BookingConfirmedPage from "./components/BookingConfirmedPage";
import Dashboard from "./components/Dashboard";
import EventoraAuth from "./components/EventoraAuth";
import OrganizerDashboard from "./components/OrganizerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventoraAuth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/event" element={<EventDetailPage />} />
        <Route path="/seat-selection" element={<SeatSelectionPage />} />
        <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;