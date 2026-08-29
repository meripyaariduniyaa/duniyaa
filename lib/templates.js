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
    price: 199,
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
    id: 'puzzle',
    title: 'Surprise Photo Puzzle',
    icon: '🧩',
    description: 'A jigsaw puzzle game revealing a hidden image and message. They have to solve it to see the surprise!',
    time: '≈ 3 min',
    bestFor: ['Surprises', 'Announcements', 'Fun Reveals'],
    basePrice: 499,
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 1,
      min: 1,
      max: 1,
      tip: 'Upload 1 high-quality photo that will be scrambled into the puzzle.'
    },
    detailsNeeded: ["Recipient Name", "Hidden Message", "1 Surprise Photo"],
    prompts: [
      "Can you piece this together? A special surprise awaits! 🧩",
      "Solve this to reveal a memory I'll always cherish..."
    ],
    tips: "Choose a photo that is clear and easy to recognize once they start solving."
  },
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash',
    icon: '🎂',
    description: 'A 7-scene cinematic birthday journey! Featuring interactive balloon popping, a memory photo gallery, a real microphone candle blowout, a spin-the-wheel wish generator, and a typewritten heartfelt letter.',
    time: '≈ 4 min',
    bestFor: ['Birthdays', 'Milestone Years', 'Midnight Reveals'],
    basePrice: 499,
    price: 199,
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
    price: 199,
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
    id: 'sorry',
    title: 'Heartfelt Apology Card',
    icon: '🥺',
    description: 'A deeply personal, interactive apology letter presented beautifully. Much better than a plain text message.',
    time: '≈ 2 min',
    bestFor: ['Apologies', 'Making Up', 'Sincere Confessions'],
    basePrice: 499,
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 0,
      min: 0,
      max: 0,
      tip: 'Focus entirely on your words for a sincere apology.'
    },
    detailsNeeded: ["Recipient Name", "Sincere Apology Message"],
    prompts: [
      "I know I messed up, and I promise to do better. I am truly sorry...",
      "Please forgive me? You mean the world to me and I hate seeing you upset."
    ],
    tips: "Speak from the heart. The clean, focused design will make your words shine."
  },
  {
    id: 'mothers-day',
    title: 'Mother\'s Day Reveal',
    icon: '💐',
    description: 'A tender animated sequence of three scenes revealing your letter, accented with floating sticky-note memories of her.',
    time: '≈ 3 min',
    bestFor: ["Mother's Day", 'Mom\'s Birthday', 'Gratitude'],
    basePrice: 499,
    price: 199,
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
    price: 199,
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
    id: 'wedding-invitation',
    title: 'Wedding Invitation',
    icon: '💒',
    description: 'Regal red & gold save-the-date with live countdown clock, Mehndi/Sangeet/Vivah timeline, venue map link, and instant RSVP form.',
    time: '≈ 4 min',
    bestFor: ['Indian Weddings', 'Save-The-Date', 'Destination Weddings'],
    basePrice: 499,
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 2,
      min: 1,
      max: 6,
      tip: 'Upload 1–3 pre-wedding or couple portrait photos for the regal gold border frame.'
    },
    detailsNeeded: ["Bride & Groom Names", "Wedding Date & Location", "Mehndi / Sangeet / Vivah Schedule", "1–3 Pre-wedding Photos"],
    prompts: [
      "We cordially invite you to celebrate our union of love, laughter, and togetherness 💒🪔",
      "Save the Date! Join us as we take our seven sacred vows together under the stars ✨",
      "Your presence will make our special day complete. Please RSVP and celebrate with us!"
    ],
    tips: "Provide clear event timings and venue details so guests can RSVP with ease."
  },
  {
    id: 'surprise-reveal-box',
    title: 'Surprise Reveal Box',
    icon: '🎁',
    description: 'Interactive 3D gift box with ribbon untie, lid pop, confetti burst, and multi-layer sequential surprise reveals.',
    time: '≈ 4 min',
    bestFor: ['Proposals', 'Reveal Moments', 'Big-Day Surprises'],
    basePrice: 499,
    price: 199,
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
    id: 'a-rose-for-someone-special',
    title: 'A Rose for Someone Special',
    icon: '🌹',
    description: 'A cinematic virtual rose blooming in candlelight with multi-petal animation and your words at the heart of the bloom.',
    time: '≈ 4 min',
    bestFor: ['Love Confessions', 'Apologies', 'Just-Because Romance'],
    basePrice: 499,
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 1,
      min: 1,
      max: 4,
      tip: 'Upload 1 high-quality portrait photo that will appear inside the golden rose heart frame.'
    },
    detailsNeeded: ["Special Someone's Name", "Poetic or Heartfelt Message", "Dedication Line", "1 Main Portrait Photo"],
    prompts: [
      "Like a rose that blooms under the moonlight, my affection for you grows deeper every day 🌹✨",
      "This virtual rose will never wither — just like my love and gratitude for you ❤️",
      "For the person who fills my world with warmth, color, and endless joy..."
    ],
    tips: "Choose a romantic or heartfelt tone to match the blooming petal music & animations."
  },
  {
    id: 'rakshabandhan',
    title: 'Raksha Bandhan — A Bond Forever',
    icon: '🪢',
    description: 'A 4-step sibling celebration: rakhi thread tying animation, interactive diya glow gauge, marigold-framed photo reel, and typewriter sibling message with festive confetti.',
    time: '≈ 3 min',
    bestFor: ['Rakshabandhan', 'Siblings', 'Festive Occasions'],
    basePrice: 499,
    price: 199,
    recommended: false,
    isNew: true,
    photoRequirement: {
      recommended: 5,
      min: 1,
      max: 15,
      tip: 'Upload up to 15 sibling photos or childhood memories together for the timeline memory reel.'
    },
    detailsNeeded: ["Sibling's Name / Nickname", "Heartfelt Raksha Bandhan Message", "A cherished memory or promise", "2–4 Sibling Photos"],
    prompts: [
      "This rakhi ties more than a thread — it binds my heart to yours, forever. Happy Raksha Bandhan! 🪢",
      "No matter how far life takes us, you are always my first best friend. Dua hai tujhe sab kuch mile 💛",
      "Remember all those fights we had? I wouldn't trade a single one. You complete my world, Bhai/Didi ❤️"
    ],
    tips: "Add a childhood memory or an inside joke to make it extra special and personal for your sibling!"
  }
];

// Keep legacy templates first-class while making the new emotion-first products
// available to every existing catalog consumer.
export const templates = [...emotionalTemplates.map((template) => ({
  ...template,
  basePrice: template.price,
  recommended: true,
  bestFor: template.relationships,
  time: template.price >= 149 ? '≈ 3 min' : '≈ 2 min',
  photoRequirement: { recommended: Math.min(template.photoLimit, 3), min: 0, max: template.photoLimit, tip: `Add up to ${template.photoLimit} personal photos.` },
  detailsNeeded: ['Recipient name', 'Personal message', 'Your memories'],
  prompts: [],
  tips: 'The specific details are what make the experience feel made for them.',
  isEmotionalExperience: true,
})), ...legacyTemplates];
