const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER CONTROLLER
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });

        await user.save();

        res.json({ message: "User registered" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// LOGIN CONTROLLER
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateWatchlist = async (req, res) => {
    try {
        const { watchlist } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { watchlist },
            { new: true }
        );

        res.json(user.watchlist);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getWatchlist = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user.watchlist);
};