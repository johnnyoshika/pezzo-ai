import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
const app = express();

const openai = new OpenAI({
  baseURL: 'https://proxy.pezzo.ai/openai/v1',
  defaultHeaders: {
    'X-Pezzo-Api-Key': process.env.PEZZO_API_KEY,
    'X-Pezzo-Project-Id': process.env.PEZZO_PROJECT_ID,
    'X-Pezzo-Environment': 'Production',
  },
});

app.get('/completion', async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'user',
        content: 'Tell me 5 fun facts about yourself',
      },
    ],
  });

  res.send(completion.choices[0].message.content);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
