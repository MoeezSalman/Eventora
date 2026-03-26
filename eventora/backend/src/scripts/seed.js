const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { buildDefaultSeatMap } = require("../utils/seatFactory");

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Booking.deleteMany({});
  await Event.deleteMany({});
  await User.deleteMany({});

  const organizer = await User.create({
    name: "Moeez Organizer",
    email: "organizer@eventora.com",
    password: "123456",
    role: "organizer",
  });

  const attendee = await User.create({
    name: "Moeez Attendee",
    email: "attendee@eventora.com",
    password: "123456",
    role: "attendee",
  });

  const event = await Event.create({
    title: "Nescafé Basement Live — Season Finale",
    category: "Music",
    venue: "Alhamra Arts Council",
    city: "Lahore",
    description: "Live music event for Eventora demo backend.",
    bannerEmoji: "🎵",
    eventDate: new Date("2026-03-22T19:00:00.000Z"),
    gateOpens: "6:00 PM",
    status: "upcoming",
    organizer: organizer._id,
    ticketTiers: [
      { name: "Standard", price: 2500, quantity: 156 },
      { name: "Premium", price: 4500, quantity: 88 },
      { name: "VIP", price: 8500, quantity: 54 },
    ],
    seats: buildDefaultSeatMap(),
  });

  console.log("Seed complete");
  console.log({
    organizerEmail: organizer.email,
    attendeeEmail: attendee.email,
    password: "123456",
    sampleEventId: event._id.toString(),
  });

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
