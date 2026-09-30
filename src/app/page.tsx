import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, Sparkles, Tag, Search, Image, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'VisualCraft — AI Product Photography for Indian D2C Sellers',
  description:
    'Upload a phone photo → AI removes background → 6 platform-ready images in 10 seconds. Free for Meesho, Instagram, Flipkart, Amazon sellers.',
};

const HOW_IT_WORKS = [
  { step: 1, label: 'Upload', desc: 'Drop any phone photo', emoji: '📱' },
  { step: 2, label: 'Remove BG', desc: 'Cloudinary AI removes background', emoji: '✂️' },
  { step: 3, label: 'Smart Crop', desc: 'Auto-centered for each platform', emoji: '🎯' },
  { step: 4, label: 'Generate', desc: '6 platform variants ready', emoji: '⚡' },
  { step: 5, label: 'Download', desc: 'ZIP with captions included', emoji: '📦' },
];

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Background Removal',
    desc: 'Cloudinary e_background_removal — no manual masking needed. Works on any product.',
  },
  {
    icon: '🎨',
    title: 'Generative Fill',
    desc: 'AI extends portrait photos to landscape banners for Facebook Ads seamlessly.',
  },
  {
    icon: '🌄',
    title: 'Background Replace',
    desc: 'Swap background with "wooden table", "studio white", or "outdoor market" in one click.',
  },
  {
    icon: '🏷️',
    title: 'Auto Product Tagging',
    desc: 'AI detects product type, fabric, style — powers search and Gemini captions.',
  },
  {
    icon: '✍️',
    title: 'Hinglish Captions',
    desc: 'Gemini generates 3 caption variants per platform in Hindi-English mix.',
  },
  {
    icon: '📐',
    title: '6 Platform Presets',
    desc: 'Instagram, WhatsApp, Flipkart, Amazon, Facebook, Meesho — all perfect dimensions.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    location: 'Chennai',
    role: 'Instagram Boutique Owner',
    text: 'Mujhe pehle studio ke liye ₹3000 dene padte the. VisualCraft se 10 second mein same quality! 😍',
    emoji: '👗',
  },
  {
    name: 'Rahul K.',
    location: 'Jaipur',
    role: 'Meesho Reseller',
    text: 'Auto-tagging feature bahut helpful hai. Now my products rank better on Meesho search.',
    emoji: '📦',
  },
  {
    name: "Ananya's Boutique",
    location: 'Mumbai',
    role: 'Flipkart Seller',
    text: 'The background replace is mind-blowing. Ek click mein professional studio look aa gaya!',
    emoji: '✨',
  },
];

const PLATFORMS = [
  { name: 'Instagram', dims: '1080×1080', emoji: '📸' },
  { name: 'WhatsApp', dims: '800×800', emoji: '💬' },
  { name: 'Flipkart', dims: '500×500', emoji: '🛒' },
  { name: 'Amazon', dims: '2000×2000', emoji: '📦' },
  { name: 'Facebook Ad', dims: '1200×628', emoji: '📣' },
  { name: 'Meesho', dims: '600×800', emoji: '👗' },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* ===================== HERO ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-light border border-blue/20 rounded-full">
              <Zap className="w-3.5 h-3.5 text-blue" />
              <span className="text-xs font-medium text-blue">
                HackIndia × Cloudinary 2026 · Team Elite
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Turn phone photos into{' '}
              <span className="text-blue">store-ready</span>{' '}
              product images
            </h1>

            <p className="text-base text-muted leading-relaxed max-w-lg">
              Upload → AI removes background → 6 platform-ready images in 10 seconds.
              Free for Meesho sellers, Instagram shops, Flipkart, Amazon. No studio needed.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/upload"
                id="hero-cta"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue text-white text-sm font-semibold rounded-md hover:bg-blue-hover transition-colors"
              >
                Process Your First Photo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-5 py-2.5 text-sm font-medium border border-border text-foreground rounded-md hover:bg-surface transition-colors"
              >
                How it works
              </Link>
            </div>

            <p className="text-xs text-subtle">
              No signup required · Powered by Cloudinary AI + Gemini
            </p>
          </div>

          {/* Right: Platform preview grid */}
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="bg-surface border border-border rounded-xl p-3 text-center space-y-1.5 hover:border-blue/30 hover:shadow-card-hover transition-all duration-200"
              >
                <span className="text-2xl">{p.emoji}</span>
                <p className="text-xs font-semibold text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted font-mono">{p.dims}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">How it works</h2>
          <p className="text-sm text-muted mt-1">5 automated steps. Under 15 seconds.</p>
        </div>

        <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-0">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="flex-1 relative">
              {/* Connector line */}
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden sm:block absolute top-6 left-[60%] right-0 h-px bg-border z-0" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center gap-2 px-2">
                {/* Step bubble */}
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-card text-xl">
                  {step.emoji}
                </div>
                {/* Step number + label */}
                <div>
                  <span className="text-xs font-mono text-muted">{step.step}.</span>
                  <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="text-xs text-muted leading-tight">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== CLOUDINARY FEATURES ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">Powered by Cloudinary AI</h2>
          <p className="text-sm text-muted mt-1">
            11 distinct Cloudinary features — each adding real value for sellers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="card p-5 space-y-2 hover:shadow-card-hover transition-shadow duration-200"
            >
              <span className="text-2xl">{feature.icon}</span>
              <p className="text-sm font-semibold text-foreground">{feature.title}</p>
              <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">Sellers love it</h2>
          <p className="text-sm text-muted mt-1">Real stories from Indian D2C sellers.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-5 space-y-3">
              <p className="text-sm text-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-base">
                  {t.emoji}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== CTA ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Start processing your first product photo
          </h2>
          <p className="text-sm text-muted">
            No signup needed. Upload → get 6 platform images + Hinglish captions in seconds.
          </p>
          <Link
            href="/upload"
            id="bottom-cta"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue text-white text-sm font-semibold rounded-md hover:bg-blue-hover transition-colors"
          >
            Try Free Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
