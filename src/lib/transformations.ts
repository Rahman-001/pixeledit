// Platform transformation configurations for Cloudinary
// Each preset defines the transformation chain for a specific e-commerce platform

export interface PlatformConfig {
  name: string;
  displayName: string;
  emoji: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  transformation: Record<string, unknown>[];
  isGenFill?: boolean;
}

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  instagram: {
    name: 'instagram',
    displayName: 'Instagram Square',
    emoji: '📸',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Feed post & shop listing',
    transformation: [
      {
        width: 1080,
        height: 1080,
        crop: 'fill',
        gravity: 'center',
        background: 'white',
        fetch_format: 'auto',
        quality: 'auto',
      },
    ],
  },
  whatsapp: {
    name: 'whatsapp',
    displayName: 'WhatsApp Product',
    emoji: '💬',
    width: 800,
    height: 800,
    aspectRatio: '1:1',
    description: 'WhatsApp Business catalog',
    transformation: [
      {
        width: 800,
        height: 800,
        crop: 'fill',
        gravity: 'center',
        background: 'white',
        fetch_format: 'auto',
        quality: 'auto',
      },
    ],
  },
  flipkart: {
    name: 'flipkart',
    displayName: 'Flipkart Listing',
    emoji: '🛒',
    width: 500,
    height: 500,
    aspectRatio: '1:1',
    description: 'Product listing image',
    transformation: [
      {
        width: 500,
        height: 500,
        crop: 'pad',
        gravity: 'center',
        background: 'white',
        fetch_format: 'jpg',
        quality: 'auto',
      },
    ],
  },
  amazon: {
    name: 'amazon',
    displayName: 'Amazon Main',
    emoji: '📦',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    description: 'Main product image (high res)',
    transformation: [
      {
        width: 2000,
        height: 2000,
        crop: 'pad',
        gravity: 'center',
        background: 'white',
        fetch_format: 'jpg',
        quality: 100,
      },
    ],
  },
  facebook: {
    name: 'facebook',
    displayName: 'Facebook Ad Banner',
    emoji: '📣',
    width: 1200,
    height: 628,
    aspectRatio: '1.91:1',
    description: 'Ad banner format',
    isGenFill: false,
    transformation: [
      {
        aspect_ratio: '1.91:1',
        width: 1200,
        crop: 'pad',
        background: 'white',
        gravity: 'center',
        fetch_format: 'auto',
        quality: 'auto',
      },
    ],
  },
  meesho: {
    name: 'meesho',
    displayName: 'Meesho Portrait',
    emoji: '👗',
    width: 600,
    height: 800,
    aspectRatio: '3:4',
    description: 'Portrait listing for Meesho',
    transformation: [
      {
        width: 600,
        height: 800,
        crop: 'fill',
        gravity: 'center',
        background: 'white',
        fetch_format: 'auto',
        quality: 'auto',
      },
    ],
  },
};

export const BACKGROUND_PRESETS = [
  {
    id: 'white_studio',
    label: 'White Studio',
    emoji: '⬜',
    prompt: 'clean white studio background with soft professional lighting',
  },
  {
    id: 'wooden_table',
    label: 'Wooden Table',
    emoji: '🪵',
    prompt: 'wooden table with soft natural light and warm tones',
  },
  {
    id: 'outdoor_market',
    label: 'Indian Market',
    emoji: '🏪',
    prompt: 'vibrant outdoor Indian market stall with colorful background',
  },
  {
    id: 'minimalist_shelf',
    label: 'Minimalist Shelf',
    emoji: '🗄️',
    prompt: 'modern minimalist shelf with clean grey background',
  },
  {
    id: 'pastel_gradient',
    label: 'Pastel Gradient',
    emoji: '🌸',
    prompt: 'soft gradient pastel background in pink and lavender tones',
  },
  {
    id: 'bokeh_lifestyle',
    label: 'Bokeh Lifestyle',
    emoji: '✨',
    prompt: 'bokeh blurred lifestyle background with warm golden light',
  },
];

export const PIPELINE_STEPS = [
  { id: 1, label: 'Uploading', description: 'Sending to Cloudinary CDN' },
  { id: 2, label: 'Removing Background', description: 'AI background removal' },
  { id: 3, label: 'Detecting Product', description: 'AI auto-tagging analysis' },
  { id: 4, label: 'Generating Variants', description: 'Creating 6 platform images' },
  { id: 5, label: 'Adding Captions', description: 'Gemini AI caption generation' },
];
