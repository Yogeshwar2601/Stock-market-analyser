const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/validate/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params;

        const response = await axios.get(
            `https://finnhub.io/api/v1/search?q=${symbol}&token=${process.env.API_KEY}`
        );

        const results = response.data.result;

        // ✅ STRICT MATCH CHECK
        const match = results.find(
            (item) => item.symbol.toUpperCase() === symbol.toUpperCase()
        );

        if (!match) {
            return res.json({ valid: false });
        }

        return res.json({ valid: true });

    } catch (err) {
        console.log("Validation error:", err.message);
        res.json({ valid: false });
    }
});

module.exports = router;