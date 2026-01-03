const functions = require("firebase-functions");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

exports.summarizeText = functions.https.onRequest(
  async (req, res) => {
    try {
      const { text, mode } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      let prompt = "";

      if (mode === "short") {
        prompt = `Summarize this text in 2-3 sentences:\n${text}`;
      } else if (mode === "bullets") {
        prompt = `Summarize this text into key bullet points:\n${text}`;
      } else {
        prompt = `Summarize this text in one paragraph:\n${text}`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const summary = response.choices[0].message.content;

      res.json({ summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "AI summarization failed" });
    }
  }
);
