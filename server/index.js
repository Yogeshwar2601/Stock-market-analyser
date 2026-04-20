const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: "*",
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    for (let [id, s] of io.of("/").sockets) {
        if (id !== socket.id) {
            console.log("Killing old socket:", id);
            s.disconnect(true);
        }
    }

    let symbol = "AAPL";

    socket.interval = setInterval(async () => {
        try {
            const res = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.API_KEY}`
            );

            console.log("Fetching:", symbol, "Socket:", socket.id);

            socket.emit("stockData", {
                price: res.data.c,
                prevClose: res.data.pc,
                symbol,
            });

        } catch (err) {
            console.log(err.message);
        }
    }, 5000);

    socket.on("changeStock", (newSymbol) => {
        symbol = newSymbol;
        console.log("Switched to:", symbol, "Socket:", socket.id);
        socket.emit("stockChanged");
    });

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
        clearInterval(socket.interval);
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.get("/api/history/:symbol/:range", async (req, res) => {
    try {
        const { symbol, range } = req.params;

        let interval;
        let outputsize;

        switch (range) {
            case "1D":
                interval = "5min";
                outputsize = 200;
                break;

            case "1W":
                interval = "30min";
                outputsize = 300;
                break;

            case "1M":
                interval = "1day";
                outputsize = 200;
                break;

            case "1Y":
                interval = "1week";
                outputsize = 200;
                break;

            default:
                interval = "1day";
                outputsize = 200;
        }

        const response = await axios.get(
            `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${process.env.TWELVE_API_KEY}`
        );

        const data = response.data;

        if (!data.values) {
            console.log("No data:", data);
            return res.json([]);
        }

        // ✅ FIXED FORMAT FOR LINE CHART
        const formatted = data.values
            .reverse()
            .map((item) => ({
                time:
                    interval === "5min" || interval === "30min"
                        ? item.datetime
                        : item.datetime.split(" ")[0],
                price: Number(item.close), // 🔥 ONLY CLOSE PRICE
            }));

        res.json(formatted);
    } catch (err) {
        console.log("History error:", err.message);
        res.json([]);
    }
});

app.get("/", (req, res) => {
    res.send("API Running...");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

server.listen(5000, () => console.log("Server running on port 5000"));