function generateBookingId() {
  return `EVT${Math.floor(100000 + Math.random() * 900000)}`;
}

function generateTicketCode() {
  const a = Math.random().toString(36).slice(2, 6).toUpperCase();
  const b = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EVT-${a}-${b}`;
}

module.exports = { generateBookingId, generateTicketCode };
