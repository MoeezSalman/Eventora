const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    seats: [{ type: String, required: true }],
    ticketType: { type: String, required: true },
    ticketCount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    totalPaid: { type: Number, required: true },
    paymentStatus: { type: String, default: "Paid" },
    bookingId: { type: String, required: true },
    ticketCode: { type: String, required: true },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);