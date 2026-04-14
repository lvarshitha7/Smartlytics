require('dotenv').config();

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in backend/.env');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText} - ${text}`);
  }

  const data = await response.json();
  const models = data.models || [];

  for (const model of models) {
    console.log(`${model.name} | ${JSON.stringify(model.supportedGenerationMethods || [])}`);
  }
}

main().catch((err) => {
  console.error('Failed to list models:', err.message);
  process.exit(1);
});
