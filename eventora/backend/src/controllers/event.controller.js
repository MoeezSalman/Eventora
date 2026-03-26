const Event = require("../models/Event");

async function getEvents(req, res, next) {
  try {
    const { category, search } = req.query;
    const query = { status: { $ne: "draft" } };

    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(query)
      .sort({ eventDate: 1 })
      .populate("organizer", "name email");

    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
}

async function getSeatsByEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id).select("title venue eventDate seats ticketTiers");
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEvents, getEventById, getSeatsByEvent };
