/**
 * Client & Server utilities for AI Personalization engine.
 * Tracks user behavior signals in cookies/localStorage and provides fallbacks.
 */

const INTENT_COOKIE_NAME = 'rn_user_intent';

export function getUserContext() {
  if (typeof window === 'undefined') {
    return {
      visitCount: 1,
      lastViewedTemplate: null,
      chosenEmotion: null,
      referrer: null,
    };
  }

  try {
    const raw = localStorage.getItem(INTENT_COOKIE_NAME);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        visitCount: (parsed.visitCount || 0) + 1,
        lastViewedTemplate: parsed.lastViewedTemplate || null,
        chosenEmotion: parsed.chosenEmotion || null,
        referrer: parsed.referrer || document.referrer || null,
      };
    }
  } catch (e) {
    console.warn('Could not read user context signals:', e);
  }

  return {
    visitCount: 1,
    lastViewedTemplate: null,
    chosenEmotion: null,
    referrer: typeof document !== 'undefined' ? document.referrer : null,
  };
}

export function trackUserSignal(key, value) {
  if (typeof window === 'undefined') return;

  try {
    const current = getUserContext();
    const updated = {
      ...current,
      [key]: value,
      updatedAt: Date.now(),
    };
    localStorage.setItem(INTENT_COOKIE_NAME, JSON.stringify(updated));
    document.cookie = `${INTENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=2592000; SameSite=Lax`;
  } catch (e) {
    console.warn('Could not store user signal:', e);
  }
}

export function getFallbackPersonalization(context = {}) {
  const emotionMap = {
    loved: {
      persona: 'romantic_partner',
      heroTitle: 'Craft a Romantic Digital Surprise She Will Treasure Forever',
      heroSubtitle: 'Turn your photos, heartfelt love notes, and song into a gamified digital moment on her phone in 2 minutes.',
      featuredIds: ['proposal', 'anniversary', 'birthday', 'emotional-apology'],
      ctaText: '✨ Craft Romantic Surprise Now',
    },
    missed: {
      persona: 'long_distance',
      heroTitle: 'Bridge the Distance with an Unforgettable Memory Journey',
      heroSubtitle: 'No matter the miles between you, make them feel right by your side with interactive photos & letters.',
      featuredIds: ['anniversary', 'birthday', 'proposal', 'emotional-apology'],
      ctaText: '✨ Send Long-Distance Surprise',
    },
    forgiven: {
      persona: 'reconciliation',
      heroTitle: 'Sincere Apology & Reconciliation Experience',
      heroSubtitle: 'Turn your words into a gentle, heartfelt reveal that gives them space to heal and smile.',
      featuredIds: ['emotional-apology', 'anniversary', 'birthday', 'proposal'],
      ctaText: '✨ Create Heartfelt Message',
    },
  };

  if (context.chosenEmotion && emotionMap[context.chosenEmotion]) {
    return emotionMap[context.chosenEmotion];
  }

  return {
    persona: 'general',
    heroTitle: 'Craft unforgettable interactive digital surprises.',
    heroSubtitle: 'Say goodbye to boring text messages & greeting cards. Turn special photos, heartfelt letters, and music into gamified digital moments.',
    featuredIds: ['birthday', 'proposal', 'anniversary', 'emotional-apology'],
    ctaText: '✨ Craft a Surprise Now',
  };
}
