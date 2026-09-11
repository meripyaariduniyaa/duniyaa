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
