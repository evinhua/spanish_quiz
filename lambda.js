const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'us-east-1' 
});

const grammarTopics = [
  'pretérito perfecto vs pretérito indefinido',
  'subjuntivo presente',
  'pronombres de objeto directo e indirecto',
  'ser vs estar',
  'por vs para',
  'condicional simple',
  'imperativo',
  'pluscuamperfecto',
  'futuro simple vs futuro perfecto',
  'presente de subjuntivo en oraciones subordinadas',
  'participios irregulares',
  'voz pasiva con se',
  'artículos definidos e indefinidos',
  'preposiciones de lugar y tiempo',
  'gerundio vs infinitivo'
];

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
    const randomTopic = grammarTopics[Math.floor(Math.random() * grammarTopics.length)];
    
    const prompt = `Genera UNA pregunta ÚNICA sobre ${randomTopic} en español nivel B1 con 4 opciones múltiples. Responde SOLO en formato JSON válido: {"question": "pregunta aquí", "options": ["opción1", "opción2", "opción3", "opción4"], "correct": 0}. El índice correct debe ser 0-3.`;

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-5-sonnet-20250106-v1:0',
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
        question: `¿Cuál es la forma correcta del verbo 'ser' en primera persona del presente?`,
        options: ["soy", "eres", "es", "somos"],
        correct: 0
      })
    };
  }
};
