const axios = require("axios");

exports.newsController = async (req, res) => {
    try {
        const { symbol } = req.params;

        console.log("News API hit:", symbol);

        const today = new Date().toISOString().split("T")[0];
        const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        const response = await axios.get(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${past}&to=${today}&token=${process.env.API_KEY}`
        );

        let news = response.data;

        if (!Array.isArray(news) || news.length === 0) {
            console.log("No API news, using fallback");

            news = [
                {
                    headline: `${symbol} shows strong market movement`,
                    summary: `${symbol} continues to attract investor attention.`,
                    url: "#",
                    datetime: Date.now() / 1000,
                },
                {
                    headline: `${symbol} investors remain cautious`,
                    summary: `Market participants are watching ${symbol} closely.`,
                    url: "#",
                    datetime: Date.now() / 1000,
                },
            ];
        }

        news = news.filter((item) => {
            const text = `${item.headline || ""} ${item.summary || ""}`.toLowerCase();
            return text.includes(symbol.toLowerCase());
        });

        res.json(news.slice(0, 10));

    } catch (err) {
        console.log("News error:", err.message);
        res.json([]);
    }
};