const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// 🔥 helper (safe userId)
const getUserId = (req) => {
    return req.user?.id || req.headers.authorization || "demo-user";
};

// 🔥 GET alerts
router.get("/", async (req, res) => {
    try {
        const userId = getUserId(req);

        const alerts = await Alert.find({ userId });

        res.json(alerts);
    } catch (err) {
        console.log("GET ALERT ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔥 ADD alert
router.post("/", async (req, res) => {
    try {
        const { symbol, price } = req.body;
        const userId = getUserId(req);

        if (!symbol || !price) {
            return res.status(400).json({ error: "Missing symbol or price" });
        }

        const alert = await Alert.create({
            userId,
            symbol,
            price,
        });

        res.json(alert);
    } catch (err) {
        console.log("POST ALERT ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔥 DELETE alert
router.delete("/:id", async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);

        res.json({ message: "Deleted" });
    } catch (err) {
        console.log("DELETE ALERT ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;