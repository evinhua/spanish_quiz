const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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

app.post('/api/generate-question', async (req, res) => {
  try {
    const randomTopic = grammarTopics[Math.floor(Math.random() * grammarTopics.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it',
        messages: [{
          role: 'user',
          content: `Genera UNA pregunta ÚNICA sobre ${randomTopic} en español nivel B1 con 4 opciones múltiples. ID: ${randomNumber}. Responde SOLO en formato JSON válido: {"question": "pregunta aquí", "options": ["opción1", "opción2", "opción3", "opción4"], "correct": 0}. El índice correct debe ser 0-3. Asegúrate de que sea JSON válido.`
        }],
        temperature: 0.9,
        max_tokens: 300
      })
    });

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean up the response to extract JSON
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsed = JSON.parse(content);
      
      // Validate the structure
      if (parsed.question && Array.isArray(parsed.options) && parsed.options.length === 4 && typeof parsed.correct === 'number') {
        res.json(parsed);
      } else {
        throw new Error('Invalid structure');
      }
    } catch (parseError) {
      console.log('Parse error, using fallback. Content was:', content);
      res.json({
        question: `¿Cuál es la forma correcta? (${randomTopic})`,
        options: ["Primera opción", "Segunda opción", "Tercera opción", "Cuarta opción"],
        correct: Math.floor(Math.random() * 4)
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    const randomTopic = grammarTopics[Math.floor(Math.random() * grammarTopics.length)];
    res.json({
      question: `Error: pregunta sobre ${randomTopic}`,
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correct: Math.floor(Math.random() * 4)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
