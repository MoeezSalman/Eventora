const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { buildDefaultSeatMap } = require("../utils/seatFactory");

async function getOrganizerDashboard(req, res, next) {
  try {
    const events = await Event.find({ organizer: req.user._id });
    const eventIds = events.map((event) => event._id);
    const bookings = await Booking.find({ event: { $in: eventIds } });

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPaid, 0);
    const totalTicketsSold = bookings.reduce((sum, booking) => sum + booking.ticketCount, 0);

    res.json({
      success: true,
      stats: {
        totalEvents: events.length,
        liveEvents: events.filter((event) => event.status === "live").length,
        totalTicketsSold,
        totalRevenue,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getOrganizerEvents(req, res, next) {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 }).lean();
    const bookings = await Booking.find({
      event: { $in: events.map((e) => e._id) }
    }).lean();

    const enrichedEvents = events.map((event) => {
      const eventBookings = bookings.filter(
        (booking) => String(booking.event) === String(event._id)
      );

      const sold = event.seats?.filter((seat) => seat.isBooked).length || 0;
      const revenue = eventBookings.reduce((sum, booking) => sum + (booking.totalPaid || 0), 0);

      return {
        ...event,
        sold,
        revenue,
        capacity: event.seats?.length || 0,
        bookings: eventBookings,
      };
    });

    res.json({ success: true, events: enrichedEvents });
  } catch (err) {
    next(err);
  }
}

async function createOrganizerEvent(req, res, next) {
  try {
    const {
      title,
      category,
      venue,
      city,
      description,
      bannerEmoji,
      eventDate,
      gateOpens,
      status,
      ticketTiers,
    } = req.body;

    if (!title || !category || !venue || !eventDate) {
      const error = new Error("Title, category, venue, and event date are required");
      error.statusCode = 400;
      throw error;
    }

    const parsedTiers = Array.isArray(ticketTiers) && ticketTiers.length
      ? ticketTiers
      : [
          { name: "Standard", price: 2500, quantity: 156 },
          { name: "Premium", price: 4500, quantity: 88 },
          { name: "VIP", price: 8500, quantity: 54 },
        ];

    const event = await Event.create({
      title,
      category,
      venue,
      city: city || "Lahore",
      description: description || "",
      bannerEmoji: bannerEmoji || "🎫",
      eventDate,
      gateOpens: gateOpens || "6:00 PM",
      status: status || "upcoming",
      organizer: req.user._id,
      ticketTiers: parsedTiers,
      seats: buildDefaultSeatMap(),
    });

    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
}

async function updateOrganizerEvent(req, res, next) {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id });
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    const allowedFields = [
      "title",
      "category",
      "venue",
      "city",
      "description",
      "bannerEmoji",
      "eventDate",
      "gateOpens",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    if (req.body.ticketTiers) event.ticketTiers = req.body.ticketTiers;

    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOrganizerDashboard,
  getOrganizerEvents,
  createOrganizerEvent,
  updateOrganizerEvent,
};
