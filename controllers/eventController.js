import { db } from "../db.js";

export const getEvents = (req, res) => {
  db.query("SELECT * FROM events", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};
