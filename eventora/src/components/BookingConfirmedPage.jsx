import React from "react";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import QRCodeLib from "qrcode";
import { formatTimeLabel } from "../utils/formatTime";
import ProfileHeader from "./ProfileHeader";

const styles = `
  :root {
    color-scheme: dark;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0b1020; }
  .event-bg {
    min-height: 100vh;
    background: #0b1020;
    color: #fff;
  }
  .event-container {
    width: min(1200px, 96vw);
    margin: 0 auto;
    padding: 0 0 48px;
    display: flex;
    gap: 32px;
    justify-content: space-between;
  }
  .event-main {
    flex: 1 1 0%;
    min-width: 0;
  }
  .event-card {
    background: linear-gradient(90deg, #4f2cc6 60%, #a855f7 100%);
    border-radius: 22px;
    padding: 32px 40px;
    color: #fff;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 10px 32px rgba(0,0,0,0.18);
    position: relative;
    overflow: hidden;
  }
  .event-card .event-icon {
    font-size: 70px;
    margin-left: 24px;
    filter: drop-shadow(0 2px 12px #a855f7cc);
  }
  .event-title {
    font-size: 36px;
    font-weight: 900;
    margin-bottom: 10px;
  }
  .event-meta {
    font-size: 15px;
    color: #e0e7ff;
    font-weight: 500;
    margin-bottom: 6px;
  }
  .event-tabs {
    display: flex;
    gap: 32px;
    margin-bottom: 18px;
    border-bottom: 1.5px solid #23263a;
  }
  .event-tab {
    padding: 0 0 12px 0;
    font-size: 16px;
    font-weight: 700;
    color: #bdbfff;
    background: none;
    border: none;
    cursor: pointer;
    border-bottom: 2.5px solid transparent;
    transition: color 0.2s, border-bottom 0.2s;
  }
  .event-tab.active {
    color: #fff;
    border-bottom: 2.5px solid #a855f7;
  }
  .event-section {
    margin-bottom: 32px;
  }
  .event-section-title {
    font-size: 13px;
    font-weight: 800;
    color: #bdbfff;
    letter-spacing: 0.12em;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .event-highlights {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
  }
  .highlight-card {
    background: #18192b;
    border-radius: 14px;
    padding: 18px 22px;
    min-width: 160px;
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 2px 8px #0002;
  }
  .highlight-label {
    font-size: 11px;
    color: #bdbfff;
    font-weight: 700;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .highlight-value {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
  }
  .event-side {
    width: 340px;
    flex-shrink: 0;
  }
  .side-card {
    background: #18192b;
    border-radius: 18px;
    padding: 24px 24px 18px;
    color: #fff;
    box-shadow: 0 2px 12px #0002;
    margin-bottom: 18px;
  }
  .side-date {
    color: #a855f7;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .side-title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 2px;
  }
  .side-venue {
    font-size: 13px;
    color: #bdbfff;
    margin-bottom: 14px;
  }
  .side-price-label {
    font-size: 12px;
    color: #bdbfff;
    margin-bottom: 2px;
    font-weight: 700;
  }
  .side-price {
    font-size: 28px;
    font-weight: 900;
    margin-bottom: 12px;
    color: #fff;
  }
  .side-tickets-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .side-tickets-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: #23263a;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .side-tickets-btn:active {
    background: #a855f7;
  }
  .side-total {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 18px;
  }
  .side-select-btn {
    width: 100%;
    padding: 12px 0;
    border-radius: 12px;
    border: none;
    background: linear-gradient(90deg,#a855f7,#f472b6);
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .side-wishlist {
    width: 100%;
    padding: 10px 0;
    border-radius: 12px;
    border: 1px solid #23263a;
    background: none;
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 14px;
    cursor: pointer;
    transition: border 0.2s;
  }
  .side-wishlist:active {
    border: 1.5px solid #a855f7;
  }
  .side-info {
    font-size: 12px;
    color: #bdbfff;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .side-share-row {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  .side-share-btn {
    flex: 1 1 0%;
    padding: 10px 0;
    border-radius: 10px;
    border: 1px solid #23263a;
    background: none;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: border 0.2s;
  }
  .side-share-btn:active {
    border: 1.5px solid #a855f7;
  }
  @media (max-width: 1100px) {
    .event-container {
      flex-direction: column;
      gap: 0;
    }
    .event-side {
      width: 100%;
      margin-top: 32px;
    }
  }
`;

const bookingStyles = `
  .booking-bg {
    min-height: 100vh;
    background: radial-gradient(ellipse at 20% 0%, rgba(20, 60, 100, 0.7) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 0%, rgba(10, 40, 80, 0.5) 0%, transparent 45%),
      linear-gradient(180deg, #0b1e38 0%, #0d2040 25%, #0a1830 55%, #081220 100%);
  }
  .booking-nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.02em;
    font-size: 12px;
  }
  .brand-icon {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    box-shadow: 0 18px 30px rgba(165, 85, 247, 0.18);
    font-size: 12px;
  }
  .user-avatar {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    color: #fff;
    font-weight: 800;
    box-shadow: 0 12px 18px rgba(99, 102, 241, 0.22);
    font-size: 11px;
  }
  .booking-shell {
    max-width: 1120px;
    margin: 0 auto;
    padding: 16px 16px 32px;
  }
  .booking-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    margin-bottom: 24px;
    padding: 36px 28px;
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.01));
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow: 0 45px 120px rgba(0, 0, 0, 0.32);
    backdrop-filter: blur(24px);
  }
  .hero-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.14);
    border: 1px solid rgba(16, 185, 129, 0.25);
    box-shadow: 0 22px 40px rgba(16, 185, 129, 0.16);
  }
  .hero-icon span {
    font-size: 14px;
    color: #10b981;
    font-weight: 900;
  }
  .booking-hero h1 {
    font-size: clamp(24px, 3vw, 36px);
    line-height: 1.05;
    margin: 0;
    letter-spacing: -0.04em;
    color: #f8fafc;
  }
  .booking-hero h1 span {
    color: #10b981;
  }
  .booking-subtitle {
    max-width: min(640px, 100%);
    margin: 0 auto 0;
    color: rgba(241, 245, 249, 0.82);
    font-size: 12px;
    line-height: 1.7;
    white-space: normal;
  }
  .booking-hero strong {
    color: #fff;
  }
  .booking-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(340px, 1fr);
    gap: 24px;
    align-items: stretch;
  }
  .booking-left,
  .booking-right {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .booking-right {
    align-self: stretch;
  }
  .booking-card,
  .booking-panel {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 22px;
    box-shadow: 0 28px 70px rgba(0,0,0,0.38);
    backdrop-filter: blur(20px);
  }
  .booking-card {
    padding: 24px;
  }
  .booking-panel {
    padding: 22px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .booking-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #bef264;
    background: rgba(34, 197, 94, 0.14);
    border: 1px solid rgba(34, 197, 94, 0.25);
  }
  .booking-event-title {
    margin: 6px 0 4px;
    font-size: 26px;
    font-weight: 900;
    color: #fff;
  }
  .booking-location {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: rgba(241, 245, 249, 0.72);
    font-weight: 600;
    margin-bottom: 0;
    font-size: 12px;
  }
  .booking-top-meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 18px;
  }
  .booking-top-meta .meta-item {
    padding: 14px 16px;
    border-radius: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(148, 163, 184, 0.08);
  }
  .booking-top-meta .meta-item span {
    display: block;
    font-size: 9px;
    color: rgba(241, 245, 249, 0.62);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-bottom: 6px;
  }
  .booking-top-meta .meta-item strong {
    display: block;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
  }
  .card-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .booking-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
  }
  .booking-panel-header h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 900;
    color: #fff;
  }
  .booking-panel-header p {
    margin: 1px 0 0;
    color: rgba(241, 245, 249, 0.72);
    font-size: 10px;
    line-height: 1.4;
    max-width: 260px;
  }
  .detail-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 6px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  }
  .detail-row:last-child {
    border-bottom: none;
  }
  .detail-key {
    color: rgba(241, 245, 249, 0.72);
    font-size: 11px;
    font-weight: 700;
  }
  .detail-value {
    color: #fff;
    font-size: 12px;
    font-weight: 900;
    text-align: right;
  }
  .detail-value.status-paid {
    color: #34d399;
  }
  .detail-value.total-paid {
    color: #c084fc;
    font-size: 14px;
  }
  .buttons-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
  }
  .primary-btn,
  .secondary-btn {
    width: 100%;
    padding: 12px 14px;
    border-radius: 14px;
    border: none;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .primary-btn {
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    color: #fff;
    box-shadow: 0 18px 40px rgba(236, 72, 153, 0.25);
  }
  .secondary-btn {
    background: rgba(255,255,255,0.04);
    color: #fff;
    border: 1px solid rgba(148, 163, 184, 0.18);
  }
  .primary-btn:hover,
  .secondary-btn:hover {
    transform: translateY(-1px);
  }
  .qr-section {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 18px;
    border-radius: 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(148, 163, 184, 0.10);
    min-height: 150px;
  }
  .qr-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }
  .qr-label {
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 0px;
  }
  .qr-text {
    font-size: 11px;
    line-height: 1.45;
    color: rgba(241, 245, 249, 0.78);
  }
  .qr-box {
    width: 140px;
    height: 140px;
    padding: 8px;
    border-radius: 18px;
    background: #0b1020;
    display: grid;
    place-items: center;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .qr-box svg {
    width: 100%;
    height: 100%;
  }
  .seat-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.12);
    color: #bef264;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin-top: 0;
    width: fit-content;
    font-size: 9px;
  }
  .booking-panel {
    padding: 10px;
  }
  @media (max-width: 960px) {
    .booking-grid {
      grid-template-columns: 1fr;
    }
    .booking-hero {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  @media (max-width: 680px) {
    .booking-nav,
    .booking-shell {
      padding: 12px;
    }
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .qr-box {
      margin: 0 auto;
    }
    .detail-row {
      grid-template-columns: 1fr;
      text-align: left;
    }
    .detail-value {
      text-align: left;
    }
  }
`;

const fallbackBooking = {
  bookingId: "EVT714122",
  eventTitle: "PSL",
  venue: "Kadafai",
  date: "4/15/2026",
  time: "14:02",
  gateOpens: "14:02",
  ticketType: "Standard",
  seats: ["S_D10"],
  ticketCount: 1,
  subtotal: 1200,
  serviceFee: 0,
  totalPaid: 1200,
  paymentStatus: "Paid",
  ticketCode: "EVT714122",
  email: "user@example.com",
  about: "wow",
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatMoney = (value) => Number(value || 0).toLocaleString();

const BookingConfirmedPage = () => {
  const location = useLocation();
  let rawBooking = location.state;
  if (rawBooking?.booking) rawBooking = rawBooking.booking;
  const booking = rawBooking || fallbackBooking;
  const normalizedBooking = {
    ...fallbackBooking,
    ...booking,
    time: formatTimeLabel(booking?.time || fallbackBooking.time),
    gateOpens: formatTimeLabel(booking?.gateOpens || fallbackBooking.gateOpens),
  };
  const price = normalizedBooking.subtotal || 1200;

  const ticketText = [
    `Eventora Ticket`,
    `Event: ${normalizedBooking.eventTitle}`,
    `Venue: ${normalizedBooking.venue}`,
    `Date: ${normalizedBooking.date}`,
    `Time: ${normalizedBooking.time}`,
    `Booking ID: ${normalizedBooking.bookingId}`,
    `Seats: ${normalizedBooking.seats.join(", ")}`,
    `Ticket Type: ${normalizedBooking.ticketType}`,
    `Code: ${normalizedBooking.ticketCode}`,
  ].join("\n");

  const qrValue = normalizedBooking.ticketCode || normalizedBooking.bookingId || "N/A";
  const pricePerTicket = normalizedBooking.subtotal || price || 1200;
  const serviceFee = normalizedBooking.serviceFee ?? Math.round(price * 0.05);
  const totalPaid = normalizedBooking.totalPaid ?? price + serviceFee;
  const paymentStatus = normalizedBooking.paymentStatus || fallbackBooking.paymentStatus || "Paid";
  const ticketLabel = `${normalizedBooking.ticketCount || 1} × ${normalizedBooking.ticketType}`;
  const seatLabel = normalizedBooking.seats?.join(", ") || "VIP_B10";
  const bookingIdLabel = normalizedBooking.bookingId?.startsWith("#")
    ? normalizedBooking.bookingId
    : `#${normalizedBooking.bookingId}`;
  const userEmail = normalizedBooking.email || fallbackBooking.email;

  const buildTicketHtml = async () => {
    const qrDataUrl = await QRCodeLib.toDataURL(qrValue, {
      width: 52,
      margin: 1,
      color: { dark: "#1e1b4b", light: "#FFFFFF" }
    });

    const seatNum = normalizedBooking.seats?.[0]?.replace(/[^0-9]/g, "") || "2";
    const rowVal = normalizedBooking.row ?? "2";

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Eventora Ticket</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 420px;
      height: 165px;
      overflow: hidden;
      background: #d0d0d0;
      display: grid;
      place-items: center;
      font-family: 'Lato', sans-serif;
    }

    /* ── outer shell ── */
    .ticket-shell {
      width: 395px;
      height: 140px;
      display: grid;
      grid-template-columns: 112px 10px 1fr;
      border-radius: 0;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.35), 0 6px 20px rgba(0,0,0,0.2);
    }

    /* ── LEFT STUB ── */
    .left-stub {
      background: #f0eff4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 8px;
      gap: 6px;
      position: relative;
    }

    /* purple decorative lines (logo area) */
    .stub-logo {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0 5px;
    }
    .stub-logo-line {
      height: 4px;
      border-radius: 2px;
      background: #5b21b6;
    }
    .stub-logo-line:nth-child(1) { width: 100%; }
    .stub-logo-line:nth-child(2) { width: 78%; }
    .stub-logo-line:nth-child(3) { width: 55%; }

    .stub-qr {
      width: 56px;
      height: 56px;
      background: #fff;
      border-radius: 4px;
      padding: 2px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.10);
      display: grid;
      place-items: center;
    }
    .stub-qr img {
      width: 100%;
      height: 100%;
      display: block;
    }

    .stub-meta {
      width: 100%;
      padding: 0 2px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .stub-meta-row {
      display: flex;
      gap: 3px;
      align-items: baseline;
    }
    .stub-meta-label {
      font-size: 5px;
      font-weight: 900;
      text-transform: uppercase;
      color: #374151;
      letter-spacing: 0.05em;
      min-width: 38px;
    }
    .stub-meta-value {
      font-size: 6px;
      font-weight: 700;
      color: #111827;
    }

    /* ── PERFORATED DIVIDER ── */
    .ticket-divider {
      width: 10px;
      background: #c8c4d4;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 0;
    }
    .ticket-divider::before {
      content: '';
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 100%;
      background-image: radial-gradient(circle, rgba(180,170,200,0.9) 38%, transparent 40%);
      background-size: 3px 9px;
      background-repeat: repeat-y;
    }

    /* ── RIGHT MAIN PANEL ── */
    .right-panel {
      background: linear-gradient(135deg, #1a1060 0%, #2a1880 35%, #1e1254 65%, #150e45 100%);
      color: #f8fafc;
      padding: 9px 14px 9px 11px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .swirl-ornament {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 82px;
      height: 82px;
      opacity: 0.88;
      pointer-events: none;
    }

    .rp-top { position: relative; z-index: 2; }
    .rp-date {
      font-size: 5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: rgba(248,250,252,0.75);
      margin-bottom: 1px;
    }
    .rp-time {
      font-size: 5px;
      color: rgba(248,250,252,0.72);
      margin-bottom: 1px;
    }
    .rp-venue {
      font-size: 5px;
      color: rgba(248,250,252,0.72);
    }
    .rp-price-badge {
      display: inline-flex;
      align-items: center;
      margin-top: 4px;
      padding: 2px 7px;
      border-radius: 2px;
      background: rgba(255,255,255,0.13);
      border: 1px solid rgba(255,255,255,0.18);
      font-size: 5px;
      font-weight: 800;
      letter-spacing: 0.07em;
      color: #f8fafc;
    }
    .rp-headline {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      font-weight: 900;
      line-height: 0.92;
      letter-spacing: -0.01em;
      color: #7dd3fc;
      text-shadow: 0 0 16px rgba(125,211,252,0.22);
      margin-top: 3px;
      position: relative;
      z-index: 2;
    }
    .rp-headline-underline {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(248,250,252,0.35), transparent);
      margin-top: 3px;
    }
    .rp-footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: 4px;
      position: relative;
      z-index: 2;
    }
    .rp-footer-brand {
      font-size: 5px;
      letter-spacing: 0.12em;
      color: rgba(248,250,252,0.60);
      text-transform: uppercase;
    }
    .rp-footer-event {
      font-size: 5.5px;
      font-weight: 800;
      color: rgba(248,250,252,0.85);
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="ticket-shell">

    <!-- LEFT STUB -->
    <div class="left-stub">
      <div class="stub-logo">
        <div class="stub-logo-line"></div>
        <div class="stub-logo-line"></div>
        <div class="stub-logo-line"></div>
      </div>

      <div class="stub-qr">
        <img src="${qrDataUrl}" alt="QR Code" />
      </div>

      <div class="stub-meta">
        <div class="stub-meta-row">
          <span class="stub-meta-label">ROW</span>
          <span class="stub-meta-value">${escapeHtml(rowVal)}</span>
        </div>
        <div class="stub-meta-row">
          <span class="stub-meta-label">SEAT</span>
          <span class="stub-meta-value">${escapeHtml(seatLabel)}</span>
        </div>
        <div class="stub-meta-row">
          <span class="stub-meta-label">ID NUMBER</span>
          <span class="stub-meta-value">${escapeHtml(normalizedBooking.bookingId)}</span>
        </div>
      </div>
    </div>

    <!-- PERFORATED DIVIDER -->
    <div class="ticket-divider"></div>

    <!-- RIGHT MAIN PANEL -->
    <div class="right-panel">
      <!-- Golden swirl SVG ornament -->
      <svg class="swirl-ornament" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f5d060"/>
            <stop offset="60%" stop-color="#c8960c"/>
            <stop offset="100%" stop-color="#8a6200" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Main large swirl -->
        <path d="M160 30 C180 10, 200 40, 175 65 C155 85, 120 80, 110 55 C100 30, 120 10, 145 18 C165 25, 170 50, 150 60 C135 68, 115 60, 118 45" 
              fill="none" stroke="url(#g1)" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Second curl -->
        <path d="M140 15 C170 -5, 205 25, 185 55 C170 78, 140 85, 120 68 C100 52, 108 25, 128 20" 
              fill="none" stroke="#d4a017" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
        <!-- Small accent swirl left -->
        <path d="M80 50 C95 35, 115 42, 108 58 C102 70, 85 68, 82 56 C80 46, 90 38, 98 45" 
              fill="none" stroke="#c8960c" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <!-- Tiny dots -->
        <circle cx="72" cy="38" r="3" fill="#d4a017" opacity="0.55"/>
        <circle cx="64" cy="52" r="2" fill="#c8960c" opacity="0.4"/>
        <circle cx="188" cy="78" r="2.5" fill="#d4a017" opacity="0.45"/>
        <!-- Leaf/petal accents -->
        <path d="M155 90 C165 82, 178 88, 170 98 C163 106, 150 100, 155 90Z" 
              fill="#c8960c" opacity="0.5"/>
        <path d="M130 100 C140 93, 150 100, 143 110 C137 118, 125 112, 130 100Z" 
              fill="#b8860b" opacity="0.4"/>
      </svg>

      <div class="rp-top">
        <div class="rp-date">${escapeHtml(normalizedBooking.eventDateLabel || normalizedBooking.date || "SUNDAY 10 JUNE 2026")}</div>
        <div class="rp-time">${escapeHtml(normalizedBooking.eventTimeLabel || normalizedBooking.time || "6am-10pm")}</div>
        <div class="rp-venue">${escapeHtml(normalizedBooking.venue)}</div>
        <div class="rp-price-badge">TICKET PRICE Rs. ${formatMoney(pricePerTicket)}</div>
      </div>

      <div>
        <div class="rp-headline">EVENT<br/>TICKET</div>
        <div class="rp-headline-underline"></div>
      </div>

      <div class="rp-footer">
        <div class="rp-footer-brand">WWW.EVENTORA.COM</div>
        <div class="rp-footer-event">${escapeHtml(normalizedBooking.eventTitle)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadTicket = async () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-99999px";
    iframe.style.top = "0";
    iframe.style.width = "420px";
    iframe.style.height = "185px";
    iframe.style.border = "0";
    iframe.srcdoc = await buildTicketHtml();

    document.body.appendChild(iframe);

    try {
      await new Promise((resolve) => {
        iframe.onload = resolve;
      });

      const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!frameDoc) throw new Error("Unable to access ticket preview frame");

      // Wait for Google Fonts to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (frameDoc.fonts?.ready) {
        await frameDoc.fonts.ready;
      }

      const ticketElement = frameDoc.querySelector(".ticket-shell");
      if (!ticketElement) throw new Error("Ticket layout not found");

      const canvas = await html2canvas(ticketElement, {
        backgroundColor: null,
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Could not create image file.");
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${normalizedBooking.bookingId || "eventora-ticket"}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error(error);
      alert("Unable to generate the ticket image.");
    } finally {
      iframe.remove();
    }
  };

  const handleShareTicket = async () => {
    const shareData = {
      title: `Eventora Ticket - ${normalizedBooking.eventTitle}`,
      text: ticketText,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(`${ticketText}\n\n${window.location.href}`);
      alert("Ticket details copied to clipboard.");
    } catch (error) {
      console.error(error);
      alert("Unable to share ticket right now.");
    }
  };

  return (
    <>
      <style>{styles + bookingStyles}</style>
      <ProfileHeader />
      <div className="booking-bg">

        <div className="booking-shell">
          <section className="booking-hero">
            <div className="hero-icon"><span>✓</span></div>
            <div>
              <h1>Booking <span>Confirmed!</span></h1>
              <p className="booking-subtitle">
                Your tickets are secured. A confirmation with your QR<br />
                pass has been sent to <strong>{userEmail}</strong>.
              </p>
            </div>
          </section>

          <div className="booking-grid">
            <div className="booking-left">
              <section className="booking-card">
                <div className="booking-card-header">
                  <div>
                    <div className="pill">Booking Confirmed</div>
                    <h2 className="booking-event-title">{normalizedBooking.eventTitle}</h2>
                    <div className="booking-location">📍 {normalizedBooking.venue}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="ticket-pill">{ticketLabel}</div>
                  </div>
                </div>

                <div className="booking-top-meta">
                  <div className="meta-item">
                    <span>DATE</span>
                    <strong>{normalizedBooking.date}</strong>
                  </div>
                  <div className="meta-item">
                    <span>TIME</span>
                    <strong>{normalizedBooking.time}</strong>
                  </div>
                  <div className="meta-item">
                    <span>GATE OPENS</span>
                    <strong>{normalizedBooking.gateOpens}</strong>
                  </div>
                </div>

                <div className="qr-section">
                  <div className="qr-box">
                    <QRCode value={qrValue} size={116} bgColor="#0b1020" fgColor="#fff" />
                  </div>
                  <div className="qr-info">
                    <div className="qr-label">Scan at the entrance</div>
                    <div className="qr-text">Present this QR code at the venue gate. Each seat holder must show a valid pass.</div>
                    <div className="ticket-code-badge">{normalizedBooking.ticketCode}</div>
                  </div>
                </div>

                <div className="card-footer-row">
                  <div className="seat-chip">{seatLabel}</div>
                  <div className="ticket-pill">{normalizedBooking.ticketType} Tickets</div>
                </div>
              </section>
            </div>

            <aside className="booking-right">
              <section className="booking-panel">
                <div className="booking-panel-header">
                  <div>
                    <h2>Booking Details</h2>
                    <p>Reference & payment summary</p>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-key">Booking ID</div>
                  <div className="detail-value">{bookingIdLabel}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">Tickets</div>
                  <div className="detail-value">{ticketLabel}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">Seats</div>
                  <div className="detail-value">{seatLabel}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">Subtotal</div>
                  <div className="detail-value">Rs. {formatMoney(pricePerTicket)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">Service Fee</div>
                  <div className="detail-value">Rs. {formatMoney(serviceFee)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">Payment Status</div>
                  <div className={`detail-value ${paymentStatus === "Paid" ? "status-paid" : ""}`}>{paymentStatus}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-key">Total Paid</div>
                  <div className="detail-value total-paid">Rs. {formatMoney(totalPaid)}</div>
                </div>

                <div className="buttons-row">
                  <button className="primary-btn" onClick={handleDownloadTicket}>Download Ticket</button>
                  <button className="secondary-btn" onClick={handleShareTicket}>Share Ticket</button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmedPage;