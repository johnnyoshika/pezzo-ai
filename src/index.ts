import 'dotenv/config';
import express from 'express';
import { Pezzo, PezzoOpenAI } from '@pezzo/client';

const app = express();

const pezzo = new Pezzo({
  apiKey: process.env.PEZZO_API_KEY,
  projectId: process.env.PEZZO_PROJECT_ID,
  environment: 'Production',
});

const openai = new PezzoOpenAI(pezzo);

app.get('/observe', async (req, res) => {
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

app.get('/prompt', async (req, res) => {
  const numFacts = req.query.numFacts?.toString() ?? '3';
  const topic = req.query.topic?.toString() ?? 'Cats';

  const prompt = await pezzo.getPrompt('FactGenerator');

  const completion = await openai.chat.completions.create(prompt, {
    variables: {
      numFacts,
      topic,
    },
    properties: {
      // You can optionally specify custom properties that will be associated with the request.
      source: 'pezzo-ai app',
    },
  });

  res.send(completion.choices[0].message.content);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
