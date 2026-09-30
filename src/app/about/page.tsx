import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — VisualCraft',
  description:
    'Technical overview of VisualCraft — all 11 Cloudinary features explained, architecture, and setup guide.',
};

const CLOUDINARY_FEATURES = [
  {
    name: 'Upload API + CldUploadWidget',
    package: 'next-cloudinary',
    tag: 'Feature 1',
    desc: 'Client-side drag-drop upload using CldUploadWidget with unsigned preset. Triggers the entire processing pipeline on success.',
    code: 'CldUploadWidget uploadPreset="visualcraft_unsigned"',
  },
  {
    name: 'AI Background Removal',
    package: 'transformation',
    tag: 'Feature 2',
    desc: 'Built-in AI background removal. No external service. Applied as the first step on every uploaded product image.',
    code: 'e_background_removal',
  },
  {
    name: 'Content-Aware Cropping',
    package: 'transformation',
    tag: 'Feature 3',
    desc: 'Keeps the product centered when resizing to different aspect ratios. Avoids cutting off key parts of the product.',
    code: 'g_auto:subject',
  },
  {
    name: 'Generative Fill',
    package: 'transformation',
    tag: 'Feature 4 (WOW)',
    desc: 'AI extends portrait photos to landscape (1.91:1) for Facebook Ads by generating natural background fill. Key differentiator.',
    code: 'b_gen_fill + c_pad + ar_1.91:1',
  },
  {
    name: 'Generative Background Replace',
    package: 'transformation',
    tag: 'Feature 5 (WOW)',
    desc: 'Replaces entire background with AI-generated scene based on text prompt. "wooden table", "white studio", etc.',
    code: 'e_gen_background_replace:prompt_{text}',
  },
  {
    name: 'Auto-Tagging',
    package: 'upload + admin API',
    tag: 'Feature 6',
    desc: 'AI detects product category, fabric, style on upload. Tags power the gallery search and Gemini caption generation.',
    code: 'auto_tagging: 0.6',
  },
  {
    name: 'Structured Metadata',
    package: 'upload',
    tag: 'Feature 7',
    desc: 'Context key-value pairs stored on each asset. Enables filtering by seller, platform, upload source.',
    code: 'context: { platform: "instagram", seller: "xyz" }',
  },
  {
    name: 'Named Transformations',
    package: 'dashboard + URL',
    tag: 'Feature 8',
    desc: '6 platform presets pre-registered as named transformations. Applied by name in URL chains for clean, cacheable URLs.',
    code: 't_instagram_square, t_facebook_banner, etc.',
  },
  {
    name: 'Search API',
    package: 'cloudinary SDK',
    tag: 'Feature 9',
    desc: 'Server-side query by tags, folder, resource type. Powers the gallery page with live tag-based filtering.',
    code: 'cloudinary.search().expression("tags:kurta")',
  },
  {
    name: 'Optimized Delivery',
    package: 'next-cloudinary CldImage',
    tag: 'Feature 10',
    desc: 'Auto WebP/AVIF format selection and quality optimization. Every image delivered at minimum file size.',
    code: 'f_auto, q_auto',
  },
  {
    name: 'CDN Delivery via CldImage',
    package: 'next-cloudinary',
    tag: 'Feature 11',
    desc: 'All preview images use CldImage component for global CDN delivery, lazy loading, and responsive sizes.',
    code: '<CldImage format="auto" quality="auto" />',
  },
];

const STACK = [
  { name: 'Next.js 14', desc: 'App Router, TypeScript, Server Components' },
  { name: 'Cloudinary', desc: '11 AI features for image processing' },
  { name: 'Supabase', desc: 'Upload history, anonymous sessions' },
  { name: 'Google Gemini', desc: 'Hinglish caption generation' },
  { name: 'Vercel', desc: 'Edge deployment, CI/CD' },
  { name: 'Tailwind CSS', desc: 'Design system, responsive UI' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">How VisualCraft Works</h1>
        <p className="text-sm text-muted mt-2">
          Technical overview for HackIndia × Cloudinary 2026 judges ·{' '}
          <span className="font-medium text-foreground">Team Elite · Track 3</span>
        </p>
      </div>

      {/* Problem statement */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-3">The Problem</h2>
        <p className="text-sm text-muted leading-relaxed">
          Indian D2C sellers on Meesho, Instagram shops, and Flipkart need professional product
          photos but can&apos;t afford studio shoots (₹3,000–₹5,000 per session). They shoot on
          phones — low quality, wrong dimensions, unprofessional backgrounds. Each platform has
          different size requirements. Creating variants manually takes hours.
        </p>
        <div className="mt-4 p-3 bg-amber-light border border-amber/20 rounded-lg">
          <p className="text-xs font-medium text-amber">
            📊 50M+ active sellers in India · avg ₹3,500/studio session · 6 platforms to optimize for
          </p>
        </div>
      </div>

      {/* Architecture */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Architecture</h2>
        <div className="bg-surface border border-border rounded-xl p-4 font-mono text-xs text-muted leading-relaxed overflow-x-auto">
          <pre>{`Phone Photo
     │
     ▼
[CldUploadWidget] ──────────────── Cloudinary CDN
     │ public_id
     ▼
/api/process (Next.js Server)
     ├── cloudinary.url() → 6 platform transformation URLs
     ├── cloudinary.api.resource() → auto-tags
     ├── generateCaptions() → Gemini 1.5 Flash
     └── saveUpload() → Supabase
     │
     ▼
Client receives:
  - platforms: { instagram, whatsapp, flipkart, amazon, facebook, meesho }
  - tags: string[]
  - captions: { instagram[], whatsapp[], flipkart[], facebook[] }
     │
     ▼
/api/download → JSZip → browser download`}</pre>
        </div>
      </div>

      {/* Cloudinary features */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Cloudinary Features Used ({CLOUDINARY_FEATURES.length})
        </h2>
        <div className="space-y-3">
          {CLOUDINARY_FEATURES.map((feature, i) => (
            <div key={feature.name} className="card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-light text-blue text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-foreground">{feature.name}</p>
                </div>
                <span className="flex-shrink-0 badge-blue text-[10px]">{feature.tag}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed ml-7 mb-2">{feature.desc}</p>
              <code className="ml-7 text-[10px] font-mono bg-surface border border-border px-2 py-1 rounded text-foreground">
                {feature.code}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Tech Stack</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {STACK.map((tech) => (
            <div key={tech.name} className="card p-4 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{tech.name}</p>
                <p className="text-xs text-muted">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup guide */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Setup</h2>
        <div className="card p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">1. Clone & install</p>
            <code className="block text-xs font-mono bg-surface border border-border p-3 rounded-lg text-foreground whitespace-pre">
{`git clone <repo-url>
cd visualcraft
npm install`}
            </code>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">2. Configure environment</p>
            <code className="block text-xs font-mono bg-surface border border-border p-3 rounded-lg text-foreground whitespace-pre">
{`cp .env.example .env.local
# Fill in your Cloudinary, Supabase, Gemini credentials`}
            </code>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">3. Cloudinary dashboard setup</p>
            <ul className="text-xs text-muted space-y-1 list-disc list-inside">
              <li>Create upload preset: <code className="font-mono text-foreground">visualcraft_unsigned</code> → Unsigned mode</li>
              <li>Register 6 named transformations (see README for full list)</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">4. Supabase table</p>
            <p className="text-xs text-muted mb-2">Run in Supabase SQL editor:</p>
            <code className="block text-xs font-mono bg-surface border border-border p-3 rounded-lg text-foreground whitespace-pre">
{`create table uploads (
  id uuid primary key default gen_random_uuid(),
  user_session_id text not null,
  cloudinary_public_id text not null,
  original_url text,
  platform_urls jsonb,
  tags text[],
  captions jsonb,
  background_style text,
  created_at timestamptz default now()
);`}
            </code>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">5. Run dev server</p>
            <code className="block text-xs font-mono bg-surface border border-border p-3 rounded-lg text-foreground">
              npm run dev
            </code>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-3">
        <Link
          href="/upload"
          className="flex items-center gap-1.5 px-4 py-2 bg-blue text-white text-sm font-medium rounded-md hover:bg-blue-hover transition-colors"
        >
          Try the Demo
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <a
          href="https://cld.media/hackathon-survey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 border border-border text-sm font-medium text-foreground rounded-md hover:bg-surface transition-colors"
        >
          Cloudinary Survey
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
