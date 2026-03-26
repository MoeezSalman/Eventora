const mongoose = require("mongoose");

const ticketTierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const seatSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    tier: {
      type: String,
      enum: ["Standard", "Premium", "VIP"],
      required: true,
    },
    price: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    venue: { type: String, required: true },
    city: { type: String, default: "Lahore" },
    description: { type: String, default: "" },
    bannerEmoji: { type: String, default: "🎫" },
    eventDate: { type: Date, required: true },
    gateOpens: { type: String, default: "6:00 PM" },
    status: {
      type: String,
      enum: ["draft", "upcoming", "live", "ended"],
      default: "upcoming",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketTiers: [ticketTierSchema],
    seats: [seatSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
