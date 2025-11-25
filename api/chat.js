const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  console.log('=== API CALL START ===');
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received POST request');
    
    // Parse the body
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    
    console.log('Raw body:', body);
    
    const { message } = JSON.parse(body);
    console.log('Parsed message:', message);

    if (!message) {
      console.log('No message provided');
      return res.status(400).json({ error: 'Message required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key present:', !!apiKey);
    
    if (!apiKey) {
      console.log('API key missing');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Initializing OpenAI...');
    const openai = new OpenAI({ 
      apiKey: apiKey 
    });

    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es LyGPT, un assistant IA créé par Evan Ouanoune. Sois utile et concis."
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    console.log('OpenAI response received');
    const reply = completion.choices[0].message.content;

    res.status(200).json({ 
      reply: reply
    });

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    console.error('Full error:', error);
    
    res.status(500).json({ 
      error: 'API Error: ' + (error.message || 'Unknown error'),
      details: error.code || 'No code'
    });
  }
};
