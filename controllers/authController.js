import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid email" });

    const user = rows[0];

    if (!bcrypt.compareSync(password, user.password))
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    res.json({ user, token });
  });
};

// REGISTER
export const register = (req, res) => {
  const { 
    name, email, password, phone, location, role,
    sports, experience, rate, bio
  } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error while checking email" });
    }

    if (result && result.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    const sql = `
      INSERT INTO users 
      (name, email, password, phone, location, role, sports, experience, rate, bio)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `;

    const params = [
      name, email, hashed, phone, location, role,
      sports || null, 
      experience || null, 
      rate || null, 
      bio || null
    ];

    db.query(sql, params, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User registered successfully" });
    });
  });
};

