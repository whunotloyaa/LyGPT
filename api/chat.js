module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'No message' });
    }

    // Réponses prédéfinies de LyGPT
    const responses = [
      "Salut ! Je suis LyGPT, créé par Evan Ouanoune. Comment puis-je vous aider ?",
      "Je comprends ce que vous voulez dire. Pouvez-vous développer davantage ?",
      "C'est une question intéressante. Laissez-moi réfléchir à cela...",
      "D'après mes connaissances, je peux vous dire que...",
      "Je ne suis pas tout à fait sûr de comprendre. Pouvez-vous reformuler ?",
      "Merci de partager cela avec moi. Que souhaitez-vous savoir d'autre ?",
      "C'est un sujet fascinant ! J'aimerais en discuter plus en détail.",
      "Je vois. Avez-vous considéré d'autres perspectives sur ce sujet ?",
      "Permettez-moi de vérifier cela pour vous...",
      "Intéressant ! J'ai quelques informations qui pourraient vous être utiles.",
      "Je suis là pour vous aider. Que puis-je faire pour vous aujourd'hui ?",
      "Pourquoi les plongeurs plongent-ils toujours en arrière et pas en avant ? Parce que sinon, ils tombent dans le bateau !",
      "Qu'est-ce qu'un canard en pleine forme ? Un canard en forme de bouée !",
      "Que dit un oignon quand il se cogne ? Aïe !"
    ];

    // Réponses contextuelles basées sur des mots-clés
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('coucou')) {
      var reply = "Bonjour ! Ravie de vous parler. Comment allez-vous aujourd'hui ?";
    } else if (lowerMessage.includes('au revoir') || lowerMessage.includes('bye') || lowerMessage.includes('à plus')) {
      var reply = "Au revoir ! Ce fut un plaisir de discuter avec vous.";
    } else if (lowerMessage.includes('merci')) {
      var reply = "Je vous en prie ! C'est un plaisir de vous aider.";
    } else if (lowerMessage.includes('qui es-tu') || lowerMessage.includes('ton nom') || lowerMessage.includes('lygpt')) {
      var reply = "Je suis LyGPT, un assistant IA créé par Evan Ouanoune !";
    } else if (lowerMessage.includes('blague') || lowerMessage.includes('drôle') || lowerMessage.includes('humour')) {
      var reply = "Pourquoi les plongeurs plongent-ils toujours en arrière et pas en avant ? Parce que sinon, ils tombent dans le bateau !";
    } else if (lowerMessage.includes('météo') || lowerMessage.includes('temps')) {
      var reply = "Je n'ai pas accès aux données météo en temps réel, mais j'espère qu'il fait beau là où vous êtes !";
    } else if (lowerMessage.includes('aide') || lowerMessage.includes('problème')) {
      var reply = "Je suis là pour vous aider. Décrivez-moi votre problème et je ferai de mon mieux !";
    } else {
      // Réponse aléatoire par défaut
      var reply = responses[Math.floor(Math.random() * responses.length)];
    }

    // Simuler un délai de réponse
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    res.status(200).json({ 
      reply: reply,
      simulated: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Server error: ' + error.message,
      reply: "Désolé, une erreur est survenue. Pouvez-vous réessayer ?"
    });
  }
};

