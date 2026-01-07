const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'us-east-1' 
});

const generateGrammarTopics = async () => {
  const prompt = `Generate 15 different Spanish grammar topics for B1 level. Return ONLY a JSON array of strings, no other text: ["topic1", "topic2", ...]`;
  
  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: prompt
      }]
    }),
    contentType: 'application/json'
  });

  try {
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let content = responseBody.content[0].text.trim();
    
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const topics = JSON.parse(content);
    
    return Array.isArray(topics) ? topics : [
      'pretérito perfecto vs pretérito indefinido',
      'subjuntivo presente',
      'ser vs estar',
      'por vs para',
      'condicional simple',
      'imperativo',
      'pronombres de objeto directo e indirecto',
      'pluscuamperfecto',
      'futuro simple vs futuro próximo',
      'presente de subjuntivo',
      'verbos reflexivos',
      'comparativos y superlativos',
      'oraciones condicionales',
      'estilo indirecto',
      'perífrasis verbales'
    ];
  } catch (error) {
    console.error('Error generating topics:', error);
    return [
      'pretérito perfecto vs pretérito indefinido',
      'subjuntivo presente',
      'ser vs estar',
      'por vs para',
      'condicional simple',
      'imperativo',
      'pronombres de objeto directo e indirecto',
      'pluscuamperfecto',
      'futuro simple vs futuro próximo',
      'presente de subjuntivo',
      'verbos reflexivos',
      'comparativos y superlativos',
      'oraciones condicionales',
      'estilo indirecto',
      'perífrasis verbales'
    ];
  }
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const grammarTopics = await generateGrammarTopics();
    const randomTopic = grammarTopics[Math.floor(Math.random() * grammarTopics.length)];
    
    const prompt = `Genera UNA pregunta sobre ${randomTopic} en español nivel B1 con 4 opciones múltiples. Responde SOLO en formato JSON: {"question": "pregunta aquí", "options": ["opción1", "opción2", "opción3", "opción4"], "correct": 0}`;

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: prompt
        }]
      }),
      contentType: 'application/json'
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let content = responseBody.content[0].text;
    
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsed = JSON.parse(content);
      
      if (parsed.question && Array.isArray(parsed.options) && parsed.options.length === 4 && typeof parsed.correct === 'number') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(parsed)
        };
      } else {
        throw new Error('Invalid structure');
      }
    } catch (parseError) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          question: `¿Cuál es la forma correcta? (${randomTopic})`,
          options: ["Primera opción", "Segunda opción", "Tercera opción", "Cuarta opción"],
          correct: Math.floor(Math.random() * 4)
        })
      };
    }
  } catch (error) {
    console.error('Bedrock Error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        question: "¿Cuál es la forma correcta del verbo 'ser' en primera persona del presente?",
        options: ["soy", "eres", "es", "somos"],
        correct: 0
      })
    };
  }
};
