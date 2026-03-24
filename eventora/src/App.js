import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventDetailPage from "./components/EventDetailPage";
import SeatSelectionPage from "./components/SeatSelectionPage";
import BookingConfirmedPage from "./components/BookingConfirmedPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event" element={<EventDetailPage />} />
        <Route path="/seat-selection" element={<SeatSelectionPage />} />
        <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;