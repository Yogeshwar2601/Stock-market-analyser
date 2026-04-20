const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// 🔥 GET alerts
router.get("/", async (req, res) => {
    const alerts = await Alert.find({ userId: req.user.id });
    res.json(alerts);
});

// 🔥 ADD alert
router.post("/", async (req, res) => {
    const { symbol, price } = req.body;

    const alert = await Alert.create({
        userId: req.user.id,
        symbol,
        price,
    });

    res.json(alert);
});

// 🔥 DELETE alert
router.delete("/:id", async (req, res) => {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;