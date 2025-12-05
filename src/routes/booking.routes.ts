import { Router } from "express";
import { createBooking, getMyBookings, updateBooking } from "../controllers/booking.controller";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

// Create booking
router.post("/", authenticate, createBooking);

// Get logged-in user's bookings
router.get("/me", authenticate, getMyBookings);

// Cancel booking
router.patch("/:bookingId/cancel", authenticate, (req, res) => {
  req.body.status = "cancelled";
  updateBooking(req, res);
});

// Return booking
router.patch("/:bookingId/return", authenticate, (req, res) => {
  req.body.status = "returned";
  updateBooking(req, res);
});

export default router;
