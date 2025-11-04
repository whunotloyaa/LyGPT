// functions/openai.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const userMessage = (body.message || '').toString().trim();

  // Détection de la question "qui t'a crée" (ou variantes)
  const quiRegex = /qui\s+(ta|t'a|t'as|t'a créé|t'a cree|t'a crée|t'as créé|t'as cree|t'as crée)\b/i;
  if (quiRegex.test(userMessage)) {
    // Réponse fixe demandée par l'utilisateur
    const fixed = "Evan Ouanoune qui ma crée et developper";
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: fixed })
    };
  }

  // Préparer le "system" prompt pour fixer l'identité et le style de LyGPT
  const systemPrompt = `Tu es LyGPT, un assistant amical et utile créé par Evan Ouanoune. 
Tu dois aider les utilisateurs, rester poli, et ne jamais indiquer "OpenAI" comme ton créateur si on te demande qui t'a créé. 
Signale clairement que ton créateur est Evan Ouanoune si on pose la question.`;

  // Construire payload pour l'API Chat completions (utilise endpoint v1/chat/completions)
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return { statusCode: 500, body: 'Server: API key not configured' };
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // tu peux changer le modèle selon ton plan
        messages: messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return { statusCode: resp.status, body: `OpenAI error: ${txt}` };
    }

    const data = await resp.json();
    // Extraire le texte
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content
      : "Désolé, je ne peux pas répondre pour le moment.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: 'Server error: ' + String(err)
    };
  }
};
