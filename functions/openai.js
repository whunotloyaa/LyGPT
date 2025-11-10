// functions/openai.js
const fetch = require("node-fetch");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Bad Request" };
  }

  const userMessage = (body.message || "").trim();
  if (!userMessage) {
    return { statusCode: 400, body: JSON.stringify({ reply: "Message vide." }) };
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return { statusCode: 500, body: JSON.stringify({ reply: "Erreur serveur : clé API manquante." }) };
  }

  const systemPrompt = `Tu es LyGPT, un assistant amical et utile créé par Evan Ouanoune. 
Tu dois rester poli, clair et ne jamais dire que tu as été créé par OpenAI, mais par Evan Ouanoune.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      return { statusCode: resp.status, body: JSON.stringify({ reply: `Erreur : ${data.error?.message}` }) };
    }

    const reply = data.choices?.[0]?.message?.content || "Pas de réponse.";
    return { statusCode: 200, body: JSON.stringify({ reply }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ reply: "Erreur serveur : " + err.message }) };
  }
};

