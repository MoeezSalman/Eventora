const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },

  seats: [String],

  // NEW FIELD (VERY IMPORTANT)
  seatSummary: [
    {
      tier: String,     // VIP / Premium / Standard
      count: Number,    // how many seats
      price: Number,    // total price for this tier
    }
  ],

  ticketCount: Number,
  subtotal: Number,
  serviceFee: Number,
  totalPaid: Number,

  ticketType: String,

  bookingId: String,
  ticketCode: String,

  paymentStatus: String,
  email: String
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);