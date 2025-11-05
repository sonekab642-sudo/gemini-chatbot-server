import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // ✅ ব্রাউজার থেকে রিকুয়েস্ট অনুমতি দেবে

const GEMINI_API_KEY = "AIzaSyCpp65YPn73c1E9yCQsx56oDUz5NEARkwk";

app.get("/", (req, res) => {
  res.send("🧠 Gemini 2.5 Flash Server is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: userMessage }] }]
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    res.json({ reply });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API Error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
