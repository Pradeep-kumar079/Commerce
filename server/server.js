// server.js (fixed) - replace your existing file with this
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Route imports (kept as you had them)
const authRoutes = require('./routes/authRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require("./routes/orderRoutes");
const UserRoutes = require('./routes/UserRoutes');

const app = express();

// ---------- Logging middleware (temporary, helpful) ----------
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- CORS CONFIG ----------
const allowedOrigins = [
  "https://commerce-cruv.vercel.app",
  // add other allowed frontends here if needed
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // ensures older browsers get HTTP 200 for preflight
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));

// ---------- Middlewares ----------
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// (Optional) health check route for Render/browser
app.get('/', (req, res) => {
  res.send('API is running ✅');
});

// ---------- Database connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---------- Routes (kept unchanged) ----------
app.use('/api/auth', authRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

// ---------- Server start ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
