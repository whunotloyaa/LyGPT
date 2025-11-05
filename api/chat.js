// api/chat.js
const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "No message" });

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",      // <-- utilise gpt-3.5-turbo (disponible pour ta clé)
        messages: [{ role: "user", content: message }],
        max_tokens: 800,
        temperature: 0.2
      })
    });

    // Lire le body (texte/json)
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = null; }

    // Si status non OK, renvoie l'erreur OpenAI
    if (!resp.ok) {
      console.error("OpenAI HTTP error:", resp.status, text);
      const msg = data?.error?.message || `OpenAI HTTP ${resp.status}`;
      return res.status(500).json({ reply: `Erreur API OpenAI : ${msg}` });
    }

    // Si la structure attendue n'existe pas
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("OpenAI response invalid:", text);
      return res.status(500).json({ reply: `maintenance en cours : discord : cgqp (${text.slice(0,300)})` });
    }

    // Tout bon — renvoyer le texte
    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ reply: "Erreur API OpenAI" });
  }
};




