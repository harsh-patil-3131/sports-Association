import express from "express";
import {
  createBooking,
  getBookingsByCoach,
  updateBookingStatus,
  getBookingsByUser
} from "../controllers/bookingController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/coach/:coachId", verifyToken, getBookingsByCoach);
router.get("/user/:userId", verifyToken, getBookingsByUser);
router.put("/:id", verifyToken, updateBookingStatus);

export default router;
