const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getWatchlist,
    updateWatchlist,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/watchlist", authMiddleware, getWatchlist);
router.put("/watchlist", authMiddleware, updateWatchlist);

module.exports = router;