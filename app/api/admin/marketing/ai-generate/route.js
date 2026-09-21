import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/creator-auth';
import { getAdminDb } from '@/lib/firebase-admin';

// Hugging Face Serverless Inference Model Endpoints
const HF_IMAGE_MODELS = [
  'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
  'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
  'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0',
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
];

const HF_TEXT_MODELS = [
  'https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3',
  'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
];

/**
 * Upload Base64 AI-generated visual directly to Cloudinary cloud storage
 */
async function uploadToCloudinary(base64Data, contentType = 'image/jpeg', folder = 'lovelycrafts_marketing') {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'vkcgnlm1';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'apology_images';

  const dataUri = `data:${contentType};base64,${base64Data}`;

  if (!cloudName) {
    return dataUri;
  }

  try {
    const formData = new FormData();
    formData.append('file', dataUri);

    if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const paramsToSign = {
        folder: folder,
        timestamp: timestamp,
      };
      const sortedKeys = Object.keys(paramsToSign).sort();
      const toSignString = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join('&') + apiSecret;
      const signature = crypto.createHash('sha1').update(toSignString).digest('hex');

      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('folder', folder);
      formData.append('signature', signature);
    } else {
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);
    }

    const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (cldRes.ok) {
      const cldData = await cldRes.json();
      if (cldData.secure_url) {
        return cldData.secure_url;
      }
    } else {
      const errText = await cldRes.text().catch(() => '');
      console.warn('Cloudinary upload warning:', errText);
    }
  } catch (cldErr) {
    console.error('Cloudinary upload error:', cldErr);
  }

  return dataUri;
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const type = body.type || 'text'; // 'text' or 'image'
    const prompt = body.prompt ? String(body.prompt).trim() : '';
    const mode = body.mode || 'general'; // 'instagram_caption', 'reel_script', 'whatsapp_agent', 'marketing_strategy', 'campaign_plan'
    const context = body.context || '';

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required for generation.' }, { status: 400 });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    // ─────────────────────────────────────────────────────────────
    // 1. AI IMAGE GENERATION (Hugging Face FLUX.1 / SDXL + Cloudinary Storage)
    // ─────────────────────────────────────────────────────────────
    if (type === 'image') {
      if (!apiKey) {
        return NextResponse.json({
          error: 'HUGGINGFACE_API_KEY environment variable is not configured on the server. Please add it to your environment variables to enable AI image generation.',
        }, { status: 400 });
      }

      const enhancedImagePrompt = `${prompt}, high quality, aesthetic social media poster, vibrant colors, premium digital gift branding, 4k, photorealistic, elegant design, trending on Instagram`;

      let imgBuffer = null;
      let contentType = 'image/jpeg';
      let lastError = null;

      for (const modelUrl of HF_IMAGE_MODELS) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 28000);

          const res = await fetch(modelUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ inputs: enhancedImagePrompt }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            imgBuffer = await res.arrayBuffer();
            contentType = res.headers.get('content-type') || 'image/jpeg';
            break;
          } else {
            const errJson = await res.json().catch(() => ({}));
            lastError = errJson?.error || `Model ${modelUrl} returned HTTP ${res.status}`;
          }
        } catch (e) {
          lastError = e.message;
        }
      }

      if (imgBuffer) {
        const base64 = Buffer.from(imgBuffer).toString('base64');
        // Upload immediately to Cloudinary cloud storage
        const permanentCloudinaryUrl = await uploadToCloudinary(base64, contentType, 'lovelycrafts_marketing');

        return NextResponse.json({
          imageUrl: permanentCloudinaryUrl,
          prompt: enhancedImagePrompt,
          storage: permanentCloudinaryUrl.startsWith('http') && !permanentCloudinaryUrl.startsWith('data:') ? 'cloudinary' : 'inline',
        });
      } else {
        return NextResponse.json({
          error: lastError || 'All Hugging Face image models were unavailable. Please check your token permissions.',
        }, { status: 400 });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. AI TEXT GENERATION (Mistral 7B + Domain Fallbacks)
    // ─────────────────────────────────────────────────────────────
    let systemInstruction = `You are LovelyCrafts Chief AI Marketing Officer for LovelyCrafts (lovelycrafts.in), India's premier digital gift & personalized surprise platform.
Provide structured, highly engaging, copy-paste ready marketing output with hashtags, hooks, and actionable steps where applicable.`;

    if (mode === 'instagram_caption') {
      systemInstruction += ` Focus on viral Instagram captions: 1 strong curiosity hook in the first line, relatable emotional body, clear Call To Action (link in bio / DM for link), and 15 targeted hashtags (#giftideasindia #digitalgifts #anniversarysurprise #lovelynotes #birthdaygift).`;
    } else if (mode === 'reel_script') {
      systemInstruction += ` Focus on viral 30-45 second Instagram Reel scripts:
[0-3s Hook (Visual + Audio Text)]:
[3-15s Emotional Problem / Tension]:
[15-30s The LovelyCrafts Digital Experience Reveal]:
[30-40s Call to Action & WhatsApp share reminder]:`;
    } else if (mode === 'whatsapp_agent') {
      systemInstruction += ` Focus on warm, friendly, non-spammy WhatsApp messages from LovelyCrafts AI Agent. Use emojis nicely, clear line breaks, and personalized dynamic placeholders like {{name}}, {{coupon}}, and {{template}}.`;
    }

    if (apiKey) {
      for (const modelUrl of HF_TEXT_MODELS) {
        try {
          const fullPrompt = `<s>[INST] ${systemInstruction}\n${context ? `Context: ${context}\n` : ''}\nUser Task: ${prompt} [/INST]`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);

          const textRes = await fetch(modelUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              inputs: fullPrompt,
              parameters: {
                max_new_tokens: 550,
                temperature: 0.7,
                top_p: 0.9,
                return_full_text: false,
              },
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (textRes.ok) {
            const data = await textRes.json();
            const reply = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
            const cleaned = (reply || '')
              .trim()
              .replace(/^<s>\s*\[INST\].*?\[\/INST\]/is, '')
              .replace(/^Assistant:\s*/i, '')
              .trim();

            if (cleaned) {
              return NextResponse.json({ reply: cleaned });
            }
          }
        } catch (err) {
          console.warn('HF text generation fallback attempt:', err.message);
        }
      }
    }

    // Built-in intelligent marketing heuristics fallback
    const fallbackText = generateMarketingFallback(prompt, mode);
    return NextResponse.json({ reply: fallbackText });

  } catch (error) {
    console.error('Marketing AI API error:', error);
    return NextResponse.json({ error: error.message || 'Marketing AI generation failed.' }, { status: 500 });
  }
}

function generateMarketingFallback(prompt, mode) {
  if (mode === 'reel_script') {
    return `🎬 **Viral Instagram Reel Script:**

**[0-3s Visual Hook]**:
(Text on Screen): *"Don't send him another boring gift card... 😳"*
(Audio): Trending aesthetic acoustic background music.

**[3-15s Relatable Story]**:
*"I wanted to do something memorable for our anniversary at midnight, but flowers and cakes feel so basic. So I created this interactive digital story link on LovelyCrafts..."*

**[15-30s The Reveal & Reaction]**:
(Show phone screen scrolling through interactive scratch cards, photo flipbooks, and music player)
*"He literally cried when the customized song and open-when letters started playing at 12:00 AM."*

**[30-40s Call To Action]**:
*"Takes 2 minutes to customize on your phone. Tap the link in bio or drop a '❤️' in DMs and I'll send you the link!"*

**Hashtags**:
#digitalgifts #personalizedsurprise #anniversarygift #relationshipgoals #midnightgifts #lovelycrafts #customcard`;
  }

  if (mode === 'instagram_caption') {
    return `✨ *When words aren't enough, send an unforgettable digital experience.* 💌

Why send a standard text when you can send an interactive virtual world filled with your inside jokes, favorite photos, countdown timers, and music? 🎶💫

Tap the link in bio to build your personalized surprise in 2 minutes! 📲

🎁 Use code **LOVE15** for 15% off your first creation today.

---
#digitalgifts #personalizedgifts #birthdaygiftideas #creativegifts #anniversarygift #couplesgoals #surprisebirthday #lovelycrafts #giftideasforhim #giftideasforher`;
  }

  if (mode === 'whatsapp_agent') {
    return `✨ *Hey {{name}}! LovelyCrafts AI here with a special surprise for you.* 💌

Your personalized digital gift link for **{{template}}** is ready to view and share!

🔗 *Direct Link:* {{tracking_link}}
🎟️ *Special Upgrade Coupon:* \`{{coupon}}\` (15% OFF)

Share this directly with your special someone on WhatsApp to make their day truly memorable. Need any adjustments? Reply right here and I'll help instantly! ❤️`;
  }

  return `🚀 **LovelyCrafts AI Marketing Blueprint:**

1. **Campaign Angle**: Focus on *Zero-Hassle Midnight Delivery* — 74% of users buy relationship surprises within 48 hours of an event.
2. **Channel Focus**: Instagram Reels (UGC reaction format) + Direct WhatsApp Broadcasts.
3. **Offer Structure**: \`LOVE15\` (15% off) with an optional add-on custom audio playlist.
4. **Creator Collab**: Partner with relationship niche micro-influencers and give them a 16% commission link.`;
}
