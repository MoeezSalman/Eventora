const router = require("express").Router();
const {
  getEvents,
  getEventById,
  getSeatsByEvent,
} = require("../controllers/event.controller");

router.get("/", getEvents);
router.get("/:id", getEventById);
router.get("/:id/seats", getSeatsByEvent);

module.exports = router;
