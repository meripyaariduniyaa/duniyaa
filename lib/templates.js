import { emotionalTemplates } from './emotionalTemplates';

const legacyTemplates = [
  {
    id: 'proposal', 
    title: 'The Perfect Proposal',
    icon: '💕',
    description: 'A "yes/no" confession link where the NO button playfully dodges away, forcing a YES! Includes celebratory animations on success.',
    time: '≈ 2 min',
    bestFor: ['Proposals', "Valentine's Day", 'Confessions'],
    basePrice: 499,
    price: 219,
    recommended: true,
    photoRequirement: {
      recommended: 2,
      min: 0,
      max: 6,
      tip: 'Upload 1-2 cute photos to display when they finally click YES!'
    },
    detailsNeeded: ["Recipient Name", "Playful Proposal Question"],
    prompts: [
      "You make my heart skip a beat. Will you be my forever? 🌹💕",
      "I promise unlimited coffee and endless laughter if you say YES! ☕✨",
      "There's only one acceptable answer here... try clicking NO if you dare! 😉"
    ],
    tips: "Keep the message playful! The dodging NO button guarantees a big laugh."
  },
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash',
    icon: '🎂',
    description: 'A 7-scene cinematic birthday journey! Featuring interactive balloon popping, a memory photo gallery, a real microphone candle blowout, a spin-the-wheel wish generator, and a typewritten heartfelt letter.',
    time: '≈ 4 min',
    bestFor: ['Birthdays', 'Milestone Years', 'Midnight Reveals'],
    basePrice: 499,
    price: 219,
    recommended: true,
    photoRequirement: {
      recommended: 3,
      min: 1,
      max: 5,
      tip: 'Upload 1-5 special memory photos to be displayed in the interactive memory gallery scene.'
    },
    detailsNeeded: ["Birthday Person's Name", "Your Name (Sender)", "Heartfelt Birthday Letter", "4 Balloon Words", "6 Bouquet Messages", "1-5 Memory Photos"],
    prompts: [
      "Wishing you the happiest birthday! May all your secret dreams come true this year 🎉🎂",
      "Blow out the candles and make a big wish! So lucky to have you in my life ✨",
      "Another year wiser, cooler, and even more amazing! Happy Birthday cutie 🎈"
    ],
    tips: "Send this link at exactly 12:00 AM midnight for the ultimate surprise!"
  },
  {
    id: 'friendship',
    title: 'Friendship Day Experience',
    icon: '👯',
    description: 'A multimedia "Museum of Us" with interactive memory swipes, a photo reveal curtain, a mini word-search, and a final Friendship Contract.',
    time: '≈ 4 min',
    bestFor: ['Best Friends', 'Friendship Day', 'Long Distance Besties'],
    basePrice: 499,
    price: 219,
    recommended: false,
    photoRequirement: {
      recommended: 1,
      min: 1,
      max: 3,
      tip: 'Upload a fun photo of you both for the curtain reveal!'
    },
    detailsNeeded: ["Bestie's Name", "Relationship Type & Vibe", "Bond Traits", "Years Known", "1 Fun Photo"],
    prompts: [
      "To my partner in crime, happy friendship day! Let's take a walk down memory lane... 👯",
      "No matter the distance, our chaotic energy remains unmatched! 💖"
    ],
    tips: "Pick fun 'bond traits' like chaotic, emotional, or funny to personalize the mini-games."
  },
  {
    id: 'mothers-day',
    title: 'Mother\'s Day Reveal',
    icon: '💐',
    description: 'A tender animated sequence of three scenes revealing your letter, accented with floating sticky-note memories of her.',
    time: '≈ 3 min',
    bestFor: ["Mother's Day", 'Mom\'s Birthday', 'Gratitude'],
    basePrice: 499,
    price: 219,
    recommended: false,
    photoRequirement: {
      recommended: 0,
      min: 0,
      max: 0,
      tip: 'Your words and memories take center stage here.'
    },
    detailsNeeded: ["What you call her (Maa/Amma)", "Letter Text", "2-3 Sticky Note Memories"],
    prompts: [
      "Thank you for every warm meal, endless hugs, and always believing in me 💐",
      "One thing I never told you: your strength inspires me every single day ❤️"
    ],
    tips: "Mention a specific childhood memory for the sticky notes to bring a joyful tear to her eyes!"
  },
  {
    id: 'anniversary',
    title: 'Anniversary Special',
    icon: '🥂',
    description: 'Fill a virtual love meter, seal a pinky promise, blow out a celebration candle, and read a handwritten letter with floating promises.',
    time: '≈ 3 min',
    bestFor: ['Anniversaries', 'Romantic Milestones', 'Couples'],
    basePrice: 499,
    price: 219,
    recommended: false,
    photoRequirement: {
      recommended: 0,
      min: 0,
      max: 0,
      tip: 'The interactive elements (pinky promise, love meter) will guide the romance.'
    },
    detailsNeeded: ["Partner's Name", "Anniversary Date", "Letter Text", "5 Promises for the Future"],
    prompts: [
      "Every single day with you feels like a beautiful dream I never want to wake up from ❤️",
      "Happy Anniversary my love! Here's to countless more memories together 💕"
    ],
    tips: "Customize the 5 promises to reflect your unique relationship quirks!"
  },
  {
    id: 'surprise-reveal-box',
    title: 'Surprise Reveal Box',
    icon: '🎁',
    description: 'Interactive 3D gift box with ribbon untie, lid pop, confetti burst, and multi-layer sequential surprise reveals.',
    time: '≈ 4 min',
    bestFor: ['Proposals', 'Reveal Moments', 'Big-Day Surprises'],
    basePrice: 499,
    price: 219,
    recommended: false,
    photoRequirement: {
      recommended: 3,
      min: 1,
      max: 6,
      tip: 'Upload 3 photos representing sequential clues or surprise reveals inside the gift box layers.'
    },
    detailsNeeded: ["Recipient Name", "3-Layer Surprise Hints/Notes", "Final Big Surprise Announcement", "2–4 Reveal Photos"],
    prompts: [
      "Unwrap layer by layer... something extra special is waiting inside for you! 🎁✨",
      "Hint #1: It's sweet. Hint #2: It's about us. Open to see the final surprise!",
      "Behind every ribbon lies a heart overflowing with love. Ready for your surprise?"
    ],
    tips: "Create intrigue by writing 3 short hints for each layer of the box!"
  },
  {
    id: 'fathers-day',
    title: "A Letter to Dad / Father's Day",
    icon: '👔',
    description: 'A deeply moving tribute to Dad: vintage pocket watch animation, life lessons checklist, childhood memory frame, and heartfelt gratitude letter.',
    time: '≈ 3 min',
    bestFor: ["Father's Day", "Dad's Birthday", "Family", "Gratitude"],
    basePrice: 499,
    price: 219,
    recommended: true,
    isNew: true,
    photoRequirement: {
      recommended: 2,
      min: 0,
      max: 6,
      tip: 'Upload 1-3 childhood or family photos with Dad.'
    },
    detailsNeeded: ["What you call him (Papa/Dad/Appa)", "Heartfelt Letter", "3 Life Lessons He Taught You", "1 Proud Memory"],
    prompts: [
      "To the man who taught me how to stand tall and work hard in silence. Happy Father's Day Papa! 👔❤️",
      "No matter how old I get, I will always look up to you. Thank you for your endless sacrifices.",
      "One thing I rarely say out loud: I am so proud to be your child. You are my hero 🌟"
    ],
    tips: "Mention a specific piece of advice or quirky habit of his to make him tear up with pride!"
  }
];

// Clean catalog combining all distinct emotional experiences and interactive templates
export const templates = [...emotionalTemplates.map((template) => ({
  ...template,
  basePrice: 499,
  recommended: true,
  bestFor: template.relationships,
  time: '≈ 3 min',
  photoRequirement: { recommended: Math.min(template.photoLimit, 3), min: 0, max: template.photoLimit, tip: `Add up to ${template.photoLimit} personal photos.` },
  detailsNeeded: ['Recipient name', 'Personal message', 'Your memories'],
  prompts: [],
  tips: 'The specific details are what make the experience feel made for them.',
  isEmotionalExperience: true,
})), ...legacyTemplates];
