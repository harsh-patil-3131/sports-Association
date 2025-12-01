import { db } from "../db.js";

// CREATE BOOKING REQUEST
export const getBookingsByUser = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT b.*, u.name AS coachName 
    FROM bookings b
    LEFT JOIN users u ON b.coachId = u.id
    WHERE b.userId = ?
    ORDER BY b.createdAt DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

export const createBooking = (req, res) => {
  const { coachId, date, time, duration, message } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO bookings (userId, coachId, date, time, duration, message, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
  `;

  db.query(sql, [userId, coachId, date, time, duration, message], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Booking request created" });
  });
};

// GET BOOKINGS FOR COACH
export const getBookingsByCoach = (req, res) => {
  const coachId = req.params.coachId;

  const sql = `
    SELECT b.*, u.name AS userName
    FROM bookings b
    LEFT JOIN users u ON b.userId = u.id
    WHERE coachId = ?
    ORDER BY b.createdAt DESC
  `;

  db.query(sql, [coachId], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

// UPDATE BOOKING (ACCEPT / REJECT)
export const updateBookingStatus = (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  const sql = `UPDATE bookings SET status=? WHERE id=?`;

  db.query(sql, [status, bookingId], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking status updated", status });
  });
};
