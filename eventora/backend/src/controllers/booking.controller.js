const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { generateBookingId, generateTicketCode } = require("../utils/ticket");
const { sendEmail } = require("../utils/mail");

async function createBooking(req, res, next) {
  try {
    const {
      eventId,
      seats,
      ticketType,
      ticketCount,
      subtotal,
      serviceFee,
      totalPaid,
    } = req.body;

    // 1. Find event
    const event = await Event.findById(eventId);
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    // 2. Get selected seats from DB
    const selectedSeats = event.seats.filter((seat) =>
      seats.includes(seat.code)
    );

    if (selectedSeats.length !== seats.length) {
      const error = new Error("Some selected seats do not exist");
      error.statusCode = 400;
      throw error;
    }

    // 3. Check already booked
    const alreadyBooked = selectedSeats.find((seat) => seat.isBooked);
    if (alreadyBooked) {
      const error = new Error(
        `Seat ${alreadyBooked.code} is already booked`
      );
      error.statusCode = 400;
      throw error;
    }

    // 4. Build seatSummary (🔥 FIXED)
    const seatSummaryMap = {};

    selectedSeats.forEach((seat) => {
      if (!seatSummaryMap[seat.tier]) {
        seatSummaryMap[seat.tier] = {
          tier: seat.tier,
          count: 0,
          price: 0,
        };
      }

      seatSummaryMap[seat.tier].count += 1;
      seatSummaryMap[seat.tier].price += seat.price;
    });

    const seatSummary = Object.values(seatSummaryMap);

    // 5. Mark seats as booked
    event.seats.forEach((seat) => {
      if (seats.includes(seat.code)) {
        seat.isBooked = true;
      }
    });

    await event.save();

    // 6. Create booking
    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      seats,

      // ✅ NEW FIELD
      seatSummary,

      ticketType,
      ticketCount,
      subtotal,
      serviceFee,
      totalPaid,

      paymentStatus: "Paid",
      status: "confirmed",

      // ✅ Use utility functions (avoid duplicates)
      bookingId: generateBookingId(),
      ticketCode: generateTicketCode(),

      email: req.user.email,
    });

    const eventDateText = event.eventDate
      ? new Date(event.eventDate).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "TBA";

    const bookingEmailSubject = `Eventora booking confirmed — ${event.title}`;
    const bookingEmailText = `Hi ${req.user.name || "Guest"},\n\nYour booking for ${event.title} is confirmed.\n\nEvent date: ${eventDateText}\nTicket code: ${booking.ticketCode}\nSeats: ${booking.seats?.join(", ") || "TBA"}\nTotal paid: Rs. ${booking.totalPaid || 0}\n\nThank you for booking with Eventora!`;
    const bookingEmailHtml = `<p>Hi <strong>${req.user.name || "Guest"}</strong>,</p>
      <p>Your booking for <strong>${event.title}</strong> is confirmed.</p>
      <ul>
        <li><strong>Event date:</strong> ${eventDateText}</li>
        <li><strong>Ticket code:</strong> ${booking.ticketCode}</li>
        <li><strong>Seats:</strong> ${booking.seats?.join(", ") || "TBA"}</li>
        <li><strong>Total paid:</strong> Rs. ${booking.totalPaid || 0}</li>
      </ul>
      <p>We look forward to seeing you at the event.</p>
      <p>Thank you for booking with Eventora!</p>`;

    try {
      await sendEmail({
        to: req.user.email,
        subject: bookingEmailSubject,
        text: bookingEmailText,
        html: bookingEmailHtml,
      });
    } catch (mailErr) {
      console.error("Booking confirmation email failed:", mailErr);
    }

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

// -----------------------------

async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("event", "title venue eventDate gateOpens");

    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
}

// -----------------------------

async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    if (booking.status === "cancelled") {
      const error = new Error("Booking is already cancelled");
      error.statusCode = 400;
      throw error;
    }

    if (booking.event) {
      booking.event.seats.forEach((seat) => {
        if (booking.seats.includes(seat.code)) {
          seat.isBooked = false;
        }
      });
      await booking.event.save();
    }

    booking.status = "cancelled";
    booking.paymentStatus = "Refunded";
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event", "title venue eventDate gateOpens")
      .populate("user", "name email");

    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "organizer"
    ) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};