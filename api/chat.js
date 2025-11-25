import OpenAI from 'openai';

export default async function handler(request, response) {
  // Configurer CORS
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { message } = await request.body;

    if (!message) {
      return response.status(400).json({ error: 'Message requis' });
    }

    // Utiliser la clé API depuis les variables d'environnement Vercel
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return response.status(500).json({ error: 'Clé API non configurée sur le serveur' });
    }

    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
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

    const reply = completion.choices[0].message.content;

    response.status(200).json({ 
      reply: reply,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Erreur OpenAI:', error);
    
    if (error.status === 401) {
      return response.status(401).json({ error: 'Clé API invalide - Contactez l\'administrateur' });
    } else if (error.status === 429) {
      return response.status(429).json({ error: 'Limite de requêtes dépassée - Réessayez plus tard' });
    } else {
      return response.status(500).json({ error: 'Erreur du serveur: ' + error.message });
    }
  }
}





