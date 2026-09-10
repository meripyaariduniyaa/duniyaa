import { NextResponse } from 'next/server';
import { getFallbackPersonalization } from '@/lib/personalization';

export async function POST(request) {
  let userContext = {};
  try {
    const body = await request.json();
    userContext = body.userContext || {};
  } catch {
    userContext = {};
  }

  const hfToken = process.env.HUGGINGFACE_API_KEY;

  if (!hfToken) {
    return NextResponse.json(getFallbackPersonalization(userContext));
  }

  const prompt = `You are a web personalization AI. Analyze the visitor details below and return ONLY a valid JSON object.
Visitor details:
- Visit Count: ${userContext.visitCount || 1}
- Chosen Emotion/Mood: ${userContext.chosenEmotion || 'none'}
- Last Viewed Template: ${userContext.lastViewedTemplate || 'none'}
- Referrer: ${userContext.referrer || 'direct'}

Return JSON format:
{
  "persona": "romantic_partner | best_friend | long_distance | reconciliation | general",
  "heroTitle": "Short catchy title (max 9 words)",
  "heroSubtitle": "Short catchy subtitle (max 18 words)",
  "featuredIds": ["proposal", "birthday", "surprise-reveal-box", "things-i-never-said"],
  "ctaText": "Short button CTA"
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 250, temperature: 0.3, return_full_text: false },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(getFallbackPersonalization(userContext));
    }

    const data = await response.json();
    let textResult = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      textResult = data[0].generated_text;
    } else if (data.generated_text) {
      textResult = data.generated_text;
    }

    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.heroTitle && parsed.featuredIds) {
        return NextResponse.json(parsed);
      }
    }
  } catch (err) {
    console.warn('AI Personalization endpoint fallback:', err.message);
  }

  return NextResponse.json(getFallbackPersonalization(userContext));
}
