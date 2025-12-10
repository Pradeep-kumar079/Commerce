// server.js / app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require("./routes/orderRoutes");
const UserRoutes = require('./routes/UserRoutes');

const app = express();

// ---------- CORS CONFIG ----------
const allowedOrigins = [
  "http://localhost:3000",              // local React dev
  "https://commerce-cruv.vercel.app",   // deployed frontend (no trailing slash)
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Handle preflight requests
app.options('*', cors(corsOptions));

// ---------- Middlewares ----------
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Database connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

// ---------- Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

// ---------- Server start ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
