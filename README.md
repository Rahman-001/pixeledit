# VisualCraft — AI Product Photography for D2C Sellers

**HackIndia × Cloudinary Pixels to Products 2026 | Team Elite | Track 3**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black)](https://your-demo.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Team%20Elite-blue)](https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-team-elite)

---

## 🎯 Problem

Indian D2C sellers on **Meesho, Instagram shops, and Flipkart** need professional product photos but can't afford studio shoots (₹3,000–₹5,000 per session). They photograph products on their phones — but these images aren't suitable for platform listings due to wrong dimensions, messy backgrounds, and lack of platform-specific formatting.

Each platform has different image requirements:
- Instagram: 1080×1080 px
- WhatsApp: 800×800 px
- Flipkart: 500×500 px white background
- Amazon: 2000×2000 px (pure white)
- Facebook Ads: 1200×628 px
- Meesho: 600×800 px portrait

Preparing all 6 manually from one phone photo takes **hours** and requires design software.

---

## ✅ Solution

**VisualCraft** is an AI pipeline powered by Cloudinary that transforms any raw product photo into **6 platform-ready images in under 10 seconds** — completely free.

```
Phone Photo → [Upload] → [AI BG Remove] → [Smart Crop] → [6 Variants] → [Captions] → [Download ZIP]
```

---

## ☁️ Cloudinary Features Used (11 total)

| # | Feature | Implementation |
|---|---------|----------------|
| 1 | **Upload API + CldUploadWidget** | Client-side unsigned upload with drag-drop |
| 2 | **AI Background Removal** | `e_background_removal` — first transformation step |
| 3 | **Content-Aware Cropping** | `g_auto:subject` — keeps product centered |
| 4 | **Generative Fill** | `b_gen_fill` — extends portrait → 1.91:1 landscape for Facebook Ads |
| 5 | **Generative Background Replace** | `e_gen_background_replace:prompt_` — AI background swap |
| 6 | **Auto-Tagging** | `auto_tagging: 0.6` — AI product categorization |
| 7 | **Structured Metadata** | `context` param — platform, seller, upload_source |
| 8 | **Named Transformations** | 6 platform presets: `t_instagram_square`, `t_facebook_banner`, etc. |
| 9 | **Search API** | `cloudinary.search()` — tag-based gallery filtering |
| 10 | **Optimized Delivery** | `f_auto, q_auto` — auto WebP/AVIF, auto quality |
| 11 | **CDN Delivery via CldImage** | `next-cloudinary` CldImage with lazy loading |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Image Processing | Cloudinary (11 features) |
| Database | Supabase (upload history, anonymous sessions) |
| AI Captions | Google Gemini 1.5 Flash |
| Deployment | Vercel |
| ZIP Export | JSZip (server-side) |

---

## 🚀 Setup

### Prerequisites
- Node.js 18+
- Cloudinary account (free tier)
- Supabase project (free tier)
- Google AI Studio API key

### 1. Clone & Install

```bash
git clone https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-team-elite
cd visualcraft
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Cloudinary Dashboard Setup

**Upload Preset:**
1. Settings → Upload → Add upload preset
2. Name: `visualcraft_unsigned`
3. Signing mode: **Unsigned**
4. Save

**Named Transformations** (Settings → Transformations → Named Transformations):

| Name | Transformation |
|------|---------------|
| `t_instagram_square` | `c_fill,g_auto:subject,w_1080,h_1080,e_background_removal,b_white,f_auto,q_auto` |
| `t_whatsapp_product` | `c_fill,g_auto:subject,w_800,h_800,e_background_removal,b_white,f_auto,q_auto` |
| `t_flipkart_listing` | `c_pad,g_auto:subject,w_500,h_500,b_white,f_jpg,q_auto` |
| `t_amazon_main` | `c_pad,g_auto:subject,w_2000,h_2000,b_white,f_jpg,q_100` |
| `t_facebook_banner` | `c_pad,ar_1.91:1,w_1200,b_gen_fill,f_auto,q_auto` |
| `t_meesho_portrait` | `c_fill,g_auto:subject,w_600,h_800,e_background_removal,b_white,f_auto,q_auto` |

### 4. Supabase Table

Run in Supabase SQL Editor:

```sql
create table uploads (
  id uuid primary key default gen_random_uuid(),
  user_session_id text not null,
  cloudinary_public_id text not null,
  original_url text,
  platform_urls jsonb,
  tags text[],
  captions jsonb,
  background_style text,
  created_at timestamptz default now()
);
```

### 5. Run Dev Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
src/
  app/
    page.tsx                    # Landing page
    upload/page.tsx             # Upload + pipeline + results
    gallery/page.tsx            # Gallery with search
    about/page.tsx              # Technical docs
    layout.tsx                  # Root layout
    globals.css                 # Design system
    api/
      process/route.ts          # Main pipeline API
      captions/route.ts         # Gemini captions
      background/route.ts       # BG replace API
      search/route.ts           # Cloudinary search
      download/route.ts         # ZIP download
  components/
    UploadZone.tsx              # CldUploadWidget drag-drop
    PipelineProgress.tsx        # 5-step progress
    PlatformCard.tsx            # Per-platform result card
    BackgroundPicker.tsx        # 6 BG style presets
    CaptionPanel.tsx            # Platform caption tabs
    TagCloud.tsx                # Auto-tag pills
    GalleryGrid.tsx             # Search results grid
    BeforeAfterSlider.tsx       # Drag compare slider
    DownloadAllButton.tsx       # ZIP trigger
    Navbar.tsx
    Footer.tsx
  lib/
    cloudinary.ts               # SDK config + helpers
    supabase.ts                 # DB client + queries
    gemini.ts                   # Caption generation
    transformations.ts          # Platform configs
    utils.ts                    # Utilities
```

---

## 🔗 Links

- **Live Demo:** [your-demo.vercel.app](https://your-demo.vercel.app)
- **Demo Video:** [YouTube/Drive link]
- **Cloudinary Survey:** [cld.media/hackathon-survey](https://cld.media/hackathon-survey) ✅
- **HackIndia:** Team Elite · Track 3

---

## 👥 Team Elite

Built for **HackIndia × Cloudinary Pixels to Products 2026**.

> ⚠️ **Important:** Complete the Cloudinary feedback survey at [cld.media/hackathon-survey](https://cld.media/hackathon-survey) BEFORE submitting. Required for prize eligibility.
