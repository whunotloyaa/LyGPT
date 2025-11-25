const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  // Configurer CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY non configurée');
      return res.status(500).json({ error: 'Clé API non configurée sur le serveur' });
    }

    const configuration = new Configuration({
      apiKey: apiKey,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Tu es LyGPT, un assistant IA créé par Evan Ouanoune. 
          Tu es utile, amical et concis dans tes réponses.
          Quand on te demande qui t'a créé, répond toujours: "J'ai été créé et développé par Evan Ouanoune !"
          Garde tes réponses relativement courtes et naturelles.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content;

    res.status(200).json({ 
      reply: reply,
      usage: completion.data.usage
    });

  } catch (error) {
    console.error('Erreur OpenAI:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Clé API invalide - Vérifiez votre clé OpenAI' });
    } else if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Limite de requêtes dépassée - Réessayez plus tard' });
    } else if (error.response?.status === 403) {
      return res.status(403).json({ error: 'Accès refusé - Vérifiez votre abonnement OpenAI' });
    } else {
      return res.status(500).json({ 
        error: 'Erreur serveur: ' + (error.response?.data?.error?.message || error.message) 
      });
    }
  }
};
