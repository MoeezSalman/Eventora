const router = require("express").Router();
const {
  getOrganizerDashboard,
  getOrganizerEvents,
  createOrganizerEvent,
  updateOrganizerEvent,
} = require("../controllers/organizer.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect, authorize("organizer"));

router.get("/dashboard", getOrganizerDashboard);
router.get("/events", getOrganizerEvents);
router.post("/events", createOrganizerEvent);
router.patch("/events/:id", updateOrganizerEvent);

module.exports = router;
