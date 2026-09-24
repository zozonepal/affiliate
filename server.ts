import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to sanitize & extract metadata from raw HTML
function extractHtmlMetadata(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  
  // JSON-LD scripts
  const jsonLdMatches: string[] = [];
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    if (match[1]) jsonLdMatches.push(match[1].trim());
  }

  // Strip scripts/styles for text content
  const cleanedText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 12000);

  return {
    title: ogTitleMatch?.[1] || titleMatch?.[1] || '',
    ogImage: ogImageMatch?.[1] || '',
    ogDescription: ogDescMatch?.[1] || '',
    jsonLd: jsonLdMatches.slice(0, 3).join('\n'),
    bodyText: cleanedText,
  };
}

// API Endpoint: Automatic Product Details Extraction
app.post('/api/extract-product', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim().startsWith('http')) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid HTTP/HTTPS product URL (e.g. Daraz, Amazon, AliExpress).',
      });
    }

    const trimmedUrl = url.trim();
    let fetchedMeta = { title: '', ogImage: '', ogDescription: '', jsonLd: '', bodyText: '' };
    let fetchSuccess = false;

    // 1. Fetch raw page content
    try {
      const response = await fetch(trimmedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      if (response.ok) {
        const html = await response.text();
        fetchedMeta = extractHtmlMetadata(html);
        fetchSuccess = true;
      }
    } catch (fetchError) {
      console.warn('Direct fetch attempt notice:', fetchError);
    }

    // 2. Prepare AI prompt for Gemini
    const prompt = `You are a precise e-commerce product details extractor for Daraz Nepal, Amazon, AliExpress, and tech stores.
Extract complete product details from the given product link and page information.

Target Product Link: ${trimmedUrl}
${fetchSuccess ? `Page Title: ${fetchedMeta.title}` : ''}
${fetchSuccess ? `OG Image: ${fetchedMeta.ogImage}` : ''}
${fetchSuccess ? `OG Description: ${fetchedMeta.ogDescription}` : ''}
${fetchSuccess ? `JSON-LD Data: ${fetchedMeta.jsonLd}` : ''}
${fetchSuccess ? `Page Sample Content: ${fetchedMeta.bodyText.slice(0, 8000)}` : ''}

Task Instructions:
1. Title: Provide full, clean product title (e.g. "Ultima Atom 192 Wireless Earbuds").
2. Category: Select best fit from ['Audio', 'Keyboards & Mice', 'Wearables', 'Mobile Accessories', 'Gaming', 'PC Components', 'Lifestyle'].
3. Price: Price in NPR (Nepali Rupees) as a pure integer number. If USD/INR, estimate in NPR (e.g. 1 USD ~ 135 NPR, 1 INR ~ 1.6 NPR).
4. OriginalPrice: Original/MSRP price in NPR before discount as integer number (or null if no discount).
5. Badge: Short discount badge (e.g. "35% OFF", "Hot Deal", "Best Seller") or empty string.
6. PromoCode: Any voucher code found or empty string.
7. Image: Main high quality product image URL. Use OG Image or extract high res image. If missing, generate a pristine Unsplash e-commerce image URL relevant to product category.
8. ColorVariants: If multiple colors exist (e.g. Black, White, Blue), return array of { name, colorCode, image }.
9. AffiliateUrl: Set to the provided URL "${trimmedUrl}".
10. Description: Concise bullet-style description with specs (battery, warranty, material, connectivity).
11. Seller: Store/Seller name (e.g., "Ultima Official Store (Daraz Mall)" or store name).
12. Rating: Float number out of 5.0 (e.g. 4.8).
13. ReviewsCount: Integer review count (e.g. 42).
14. InStock: boolean (true/false).
`;

    // Config with strict responseSchema
    const aiConfig: any = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          price: { type: Type.NUMBER },
          originalPrice: { type: Type.NUMBER },
          badge: { type: Type.STRING },
          promoCode: { type: Type.STRING },
          image: { type: Type.STRING },
          colorVariants: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                colorCode: { type: Type.STRING },
                image: { type: Type.STRING },
              },
            },
          },
          affiliateUrl: { type: Type.STRING },
          description: { type: Type.STRING },
          seller: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          reviewsCount: { type: Type.NUMBER },
          inStock: { type: Type.BOOLEAN },
        },
        required: ['title', 'category', 'price', 'image', 'affiliateUrl', 'description', 'inStock'],
      },
    };

    // Use googleSearch tool if direct fetch was incomplete or missing
    if (!fetchSuccess || fetchedMeta.bodyText.length < 200) {
      aiConfig.tools = [{ googleSearch: {} }];
    }

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: aiConfig,
    });

    const rawText = aiResponse.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(rawText.trim());
    } catch (pErr) {
      console.warn('JSON parse warning on extracted product:', pErr);
    }

    // Fallbacks and cleanup
    parsedData.affiliateUrl = trimmedUrl;
    if (!parsedData.price || isNaN(parsedData.price)) parsedData.price = 1999;
    if (!parsedData.title) parsedData.title = fetchedMeta.title || 'Extracted Product';
    if (!parsedData.category) parsedData.category = 'Tech';
    if (!parsedData.seller) parsedData.seller = 'Daraz Nepal Store';
    if (parsedData.inStock === undefined) parsedData.inStock = true;
    if (!parsedData.rating) parsedData.rating = 4.8;
    if (!parsedData.reviewsCount) parsedData.reviewsCount = 35;
    if (!parsedData.image) {
      parsedData.image = fetchedMeta.ogImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('API /api/extract-product error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to automatically extract product details.',
    });
  }
});

// Setup Vite middleware in dev or static serving in production
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      port: PORT,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
