const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        watchlist: {
            type: [String],
            default: ["AAPL"],
        },
        alerts: {
            type: [Number],
            default: [],
        },
    }
);

module.exports = mongoose.model("User", userSchema);

