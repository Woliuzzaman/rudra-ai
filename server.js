const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT =
  "তুমি রুদ্র এআই, একজন বন্ধুসুলভ বাংলা ভয়েস অ্যাসিস্ট্যান্ট। " +
  "সবসময় সহজ, পরিষ্কার বাংলায় ছোট উত্তর দাও, যাতে শুনতে সুবিধা হয়। " +
  "মার্কডাউন, তালিকা বা ইমোজি ব্যবহার করবে না।";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (req, res) => res.send("ok"));

app.post("/api/chat", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY সেট করা নেই" });
    }
    const message = ((req.body && req.body.message) || "").toString().trim();
    const history = Array.isArray(req.body && req.body.history)
      ? req.body.history.slice(-10)
      : [];
    if (!message) {
      return res.status(400).json({ error: "message খালি" });
    }

    const contents = [
      ...history.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: String(h.content || "") }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      MODEL +
      ":generateContent";

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return res
        .status(r.status)
        .json({ error: (data.error && data.error.message) || "API error" });
    }
    const parts =
      (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts) ||
      [];
    const reply = parts.map((p) => p.text || "").join("").trim();
    res.json({ reply: reply || "দুঃখিত, উত্তর পাওয়া যায়নি।" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, "0.0.0.0", () => console.log("RUDRA AI running on " + PORT));
