const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    userId: String,
    symbol: String,
    price: Number,
});

module.exports = mongoose.model("Alert", alertSchema);