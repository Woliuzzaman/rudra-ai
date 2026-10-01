const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

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
      return res.status(500).json({ error: "OPENAI_API_KEY সেট করা নেই" });
    }
    const message = (req.body && req.body.message || "").toString().trim();
    const history = Array.isArray(req.body && req.body.history)
      ? req.body.history.slice(-10)
      : [];
    if (!message) {
      return res.status(400).json({ error: "message খালি" });
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: message },
        ],
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return res
        .status(r.status)
        .json({ error: (data.error && data.error.message) || "API error" });
    }
    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, "0.0.0.0", () => console.log("RUDRA AI running on " + PORT));
