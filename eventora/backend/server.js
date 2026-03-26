const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/error.middleware");

dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Eventora API is running" });
});

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/events", require("./src/routes/event.routes"));
app.use("/api/bookings", require("./src/routes/booking.routes"));
app.use("/api/organizer", require("./src/routes/organizer.routes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
