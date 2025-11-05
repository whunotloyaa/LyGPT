// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // Vérifie que la requête est POST
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Récupère le message envoyé depuis le frontend
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message" });

  try {
    // Appel à l'API OpenAI
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // ta clé OpenAI est dans les variables d'environnement
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        max_tokens: 800,
        temperature: 0.2
      })
    });

    const data = await resp.json();
    // Renvoie la réponse au frontend
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Erreur API OpenAI" });
  }
}
