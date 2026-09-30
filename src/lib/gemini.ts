import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface CaptionResult {
  instagram: string[];
  whatsapp: string[];
  flipkart: string[];
  facebook: string[];
}

/**
 * Generate product captions for multiple platforms using Gemini.
 * Returns 3 variants per platform in Hinglish (Hindi + English mix).
 */
export async function generateCaptions(tags: string[]): Promise<CaptionResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const tagString = tags.join(', ');

  const prompt = `You are a product listing expert for Indian D2C sellers on platforms like Meesho, Instagram, and Flipkart.

Based on these auto-detected product tags: "${tagString}"

Generate captions in Hinglish (mix of Hindi and English) for each platform. Return ONLY valid JSON, no markdown.

Requirements:
- Instagram: 3 captions, each under 150 chars, include 3-5 relevant hashtags, emojis welcome
- WhatsApp: 3 captions, each under 80 chars, short and punchy
- Flipkart: 3 captions, each under 120 chars, SEO-friendly product titles
- Facebook: 3 captions, each under 200 chars, ad copy style with call to action

Return this exact JSON structure:
{
  "instagram": ["caption1", "caption2", "caption3"],
  "whatsapp": ["caption1", "caption2", "caption3"],
  "flipkart": ["caption1", "caption2", "caption3"],
  "facebook": ["caption1", "caption2", "caption3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as CaptionResult;
    return parsed;
  } catch (error) {
    console.error('Gemini caption generation failed:', error);
    // Return fallback captions
    return getFallbackCaptions(tags);
  }
}

/**
 * Fallback captions when Gemini is unavailable.
 */
function getFallbackCaptions(tags: string[]): CaptionResult {
  const product = tags[0] || 'product';
  return {
    instagram: [
      `✨ Premium ${product} for every occasion! Quality aur style ka perfect combo 🛍️ #Fashion #D2C #IndianFashion`,
      `Apne style ko upgrade karo with our latest ${product} collection 💫 #ShopNow #Trendy`,
      `Handpicked ${product} just for you! DM for orders 📩 #MadeInIndia #ShopLocal`,
    ],
    whatsapp: [
      `Premium ${product} available! DM to order 📱`,
      `New ${product} collection! Limited stock 🔥`,
      `Best quality ${product} at great price! Order now ✅`,
    ],
    flipkart: [
      `Premium ${product} - High Quality, Fast Delivery`,
      `Best ${product} for Daily Use - Buy Now`,
      `Top Rated ${product} - Free Shipping Available`,
    ],
    facebook: [
      `🎉 Introducing our premium ${product}! Shop now and get 20% off your first order. Quality guaranteed. Order today!`,
      `Looking for the perfect ${product}? Look no further! Premium quality, fast delivery, best prices. Shop now!`,
      `Transform your style with our amazing ${product} collection. Limited stock available. Don't miss out — buy now!`,
    ],
  };
}
