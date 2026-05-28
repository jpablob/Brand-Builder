import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Initialize the Google GenAI SDK
const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper function to check for valid API Key
function isApiKeyValid() {
  return apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0;
}

// API Routes FIRST

// 1. Generate descriptive ad prompts for consistent mediums
app.post('/api/generate-prompts', async (req, res) => {
  try {
    if (!isApiKeyValid()) {
      return res.status(401).json({
        error: 'MISSING_API_KEY',
        message: 'Your Gemini API Key is missing or set to a placeholder. Please configure a valid API key in the Settings > Secrets menu of AI Studio.',
      });
    }

    const { productName, productDescription, brandTone } = req.body;

    if (!productName || !productDescription) {
      return res.status(400).json({ error: 'Missing product details' });
    }

    const promptMessage = `
You are a luxury branding strategist and elite prompt engineer. 
We need to launch a visually cohesive advertising campaign for the following product:
- Product Name: ${productName}
- Product Description: ${productDescription}
- Brand Voice/Tone: ${brandTone || 'sophisticated, modern'}

Your core goal is to preserve absolute Product Visual Consistency across three completely different target mediums, and strictly follow the negative rule: NO human hands, faces, body parts, or people can be visible in any generated image at all. It must only feature the product and its environment.

To achieve consistent styling across all images, you must first extract the product's precise visual blueprint (e.g. materials, shape, color, typography of the brand label, lid, finish status) and weave this core detailed visual description unchanged into the 'prompt' field for all three mediums.

Design prompts for the following three mediums:
1. 'billboard' (wide 16:9 ratio): An expansive outdoor grand commercial showcase in a beautiful high-end metro plaza. Needs spacious negative space and pristine architectural backgrounds. No people.
2. 'newspaper' (vintage text 4:3 ratio): A classic monochrome editorial newspaper clipping. High-contrast ink newsprint ad. No people, rich texture.
3. 'social' (1:1 ratio): A gorgeous soft and modern lifestyle layout, studio setup with pastel backdrop, precise reflections, catalog lookbook appeal. No people.

Deliver the results as a clean JSON conforming to the requested schema. Do not output anything other than pure valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptMessage,
      config: {
        systemInstruction: 'You are a detail-oriented luxury copywriter. Ensure there are absolutely NO people or body parts in the generated prompts, and duplicate the core product visual description text in each prompt for consistency.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            productDescription: { type: Type.STRING },
            brandTone: { type: Type.STRING },
            prompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medium: { type: Type.STRING, description: "Must be exactly 'billboard', 'newspaper', or 'social'" },
                  title: { type: Type.STRING, description: 'Ad title/headline appropriate for this medium' },
                  description: { type: Type.STRING, description: 'Creative direction and composition outline' },
                  prompt: { type: Type.STRING, description: 'The absolute detailed image prompt. MUST contain positive descriptive instructions of the product. MUST enforce no humans. Example: "A close up photo of... in black and white newsprint style, no people, photorealistic."' },
                  aspectRatio: { type: Type.STRING, description: "Must be '16:9' for billboard, '4:3' for newspaper, or '1:1' for social" }
                },
                required: ['medium', 'title', 'description', 'prompt', 'aspectRatio']
              }
            }
          },
          required: ['productName', 'productDescription', 'brandTone', 'prompts']
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from model');
    }

    const campaignData = JSON.parse(responseText.trim());
    res.json(campaignData);
  } catch (err: any) {
    console.error('Error in /api/generate-prompts:', err);
    const isQuotaError = 
      err.status === 429 || 
      err.statusCode === 429 ||
      err.code === 429 ||
      (err.message && (
        err.message.includes('429') || 
        err.message.toLowerCase().includes('quota') || 
        err.message.toLowerCase().includes('rate_limit') ||
        err.message.toLowerCase().includes('resource_exhausted') ||
        err.message.toLowerCase().includes('exceeded')
      ));
      
    if (isQuotaError) {
      return res.status(429).json({
        error: 'QUOTA_EXHAUSTED',
        message: 'Your Gemini API Key has run out of quota on the Free Tier. To unlock unlimited generation, please select a billing-enabled key or wait a few seconds before retrying.'
      });
    }
    res.status(500).json({
      error: 'GENERATION_ERROR',
      message: err.message || 'Failed to generate campaign concepts. Please try again.'
    });
  }
});

// 2. Generate Image using the Nano-Banana model (gemini-2.5-flash-image)
app.post('/api/generate-image', async (req, res) => {
  try {
    if (!isApiKeyValid()) {
      return res.status(401).json({
        error: 'MISSING_API_KEY',
        message: 'Your Gemini API Key is missing or set to a placeholder. Please configure a valid API key in the Settings > Secrets menu of AI Studio.',
      });
    }

    let { prompt, aspectRatio, medium } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt for image generation' });
    }

    // Double check aspect ratio formatting to prevent failure.
    // Allowed values: '1:1', '3:4', '4:3', '9:16', '16:9'
    let allowedRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    let safeRatio = allowedRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // To strictly support user instructions: "I do not want to see people in any of the images."
    // We append negative prompts to keep it entirely clear.
    const strictPrompt = `${prompt}. Focus solely on the products. Absolutely empty of any people, no models, no hands, no human figures, completely deserted background. Raw commercial photograph.`;

    console.log(`Generating image for medium ${medium} using gemini-2.5-flash-image (Nano-Banana) with ratio ${safeRatio}`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // The Nano-Banana model designated for flash image tasks
      contents: {
        parts: [
          {
            text: strictPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: safeRatio as any,
        },
      },
    });

    // Check response parts for base64 inlineData
    let base64Data: string | undefined;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Data = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Data) {
      throw new Error('No image bytes were returned by the Nano-Banana image generation model.');
    }

    res.json({
      imageUrl: `data:image/png;base64,${base64Data}`
    });
  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    const isQuotaError = 
      err.status === 429 || 
      err.statusCode === 429 ||
      err.code === 429 ||
      (err.message && (
        err.message.includes('429') || 
        err.message.toLowerCase().includes('quota') || 
        err.message.toLowerCase().includes('rate_limit') ||
        err.message.toLowerCase().includes('resource_exhausted') ||
        err.message.toLowerCase().includes('exceeded')
      ));
      
    if (isQuotaError) {
      return res.status(429).json({
        error: 'QUOTA_EXHAUSTED',
        message: 'Your Gemini API Key has run out of quota on the Free Tier for image generation. To unlock unlimited generation, please switch to a plan with billing enabled, or wait a minute before retrying.'
      });
    }
    res.status(500).json({
      error: 'IMAGE_GENERATION_FAILED',
      message: err.message || 'The Nano-Banana image model failed to generate. Make sure your API key has appropriate permissions and quota.'
    });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Builder Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
