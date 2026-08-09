export const templates = [
  {
    id: 'sorry',
    title: 'Interactive Romantic Apology',
    icon: '🥺',
    description: 'A 5-step apology journey: tone selector, heart cuteness meter, promise cards, photo memory reel, and self-typing typewriter note.',
    time: '≈ 3 min',
    bestFor: ['Apologies', 'Romantic Gestures', 'Making Up'],
    price: 199,
    recommended: true,
    photoRequirement: {
      recommended: 3,
      min: 1,
      max: 6,
      tip: 'Upload 2–4 cute or goofy memories of you two together for the interactive 3D memory swiper cards.'
    },
    detailsNeeded: ["Recipient's Name", "Apology Reason / Sincere Message", "3 Promises for the Future", "2–4 Memory Photos"],
    prompts: [
      "I know I hurt you, and I promise to listen better from now on...",
      "Can you tap forgive me? Here are 3 promises I want to make to you...",
      "Remember this silly photo of us? You always make my heart warm..."
    ],
    tips: "Include an inside joke or a sweet promise to make the 5-step reveal super personal."
  },
  {
    id: 'birthday-surprise',
    title: 'Birthday Surprise',
    icon: '🎂',
    description: 'Bollywood red curtain rise, candle-blowing cake with confetti shower, party theme picker, and custom birthday banner.',
    time: '≈ 2 min',
    bestFor: ['Birthdays', 'Milestone Years', 'Midnight Reveals'],
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 2,
      min: 1,
      max: 6,
      tip: 'Upload 1–3 smiling photos of the birthday person for the animated birthday card frame & celebration shower.'
    },
    detailsNeeded: ["Birthday Person Name", "Heartfelt Birthday Wish", "Age / Milestone (Optional)", "1–3 Party Photos"],
    prompts: [
      "Wishing you the happiest birthday! May all your secret dreams come true this year 🎉🎂",
      "Blow out the candles and make a big wish! So lucky to have you in my life ✨",
      "Another year wiser, cooler, and even more amazing! Happy Birthday cutie 🎈"
    ],
    tips: "Send this link at exactly 12:00 AM midnight for the ultimate red curtain & candle surprise!"
  },
  {
    id: 'love-letter',
    title: 'Love Letter',
    icon: '💌',
    description: '4 stationery designs, wax seal unsealing tap, pen-on-paper typewriter animation, drifting rose petals & glowing lanterns.',
    time: '≈ 3 min',
    bestFor: ['Anniversary', 'Apology', 'Quiet Moments'],
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 2,
      min: 1,
      max: 6,
      tip: 'Upload 1–3 romantic photos that will be framed inside the vintage wax-sealed envelope.'
    },
    detailsNeeded: ["Partner's Name / Nickname", "Romantic Love Letter Text", "Special Date / Anniversary", "1–3 Couple Photos"],
    prompts: [
      "Every single day with you feels like a beautiful dream I never want to wake up from ❤️",
      "You are my favorite place to go when my mind searches for peace...",
      "Happy Anniversary my love! Here's to countless more memories together 💕"
    ],
    tips: "Write a letter with 3-4 short paragraphs — it looks stunning in the pen-on-paper typewriter mode!"
  },
  {
    id: 'letter-for-mom',
    title: 'A Letter for Mom',
    icon: '💐',
    description: 'Cozy pastel tribute featuring shared childhood memories, heartfelt gratitude, and a secret note with blooming flower unfurl.',
    time: '≈ 3 min',
    bestFor: ["Mother's Day", 'For Mom', 'Long-Distance Kids'],
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 3,
      min: 1,
      max: 6,
      tip: 'Upload 2–4 throwback childhood photos or warm memories with Mom.'
    },
    detailsNeeded: ["Mom's Name / 'Ma'", "Thank You & Memory Message", "One thing you never told her", "2–4 Nostalgic Photos"],
    prompts: [
      "Thank you for every warm meal, endless hugs, and always believing in me Ma 💐",
      "One thing I never told you: your strength inspires me every single day ❤️",
      "Remember this picture from when I was little? Thank you for being the best Mom in the world!"
    ],
    tips: "Mention a specific childhood memory or favorite dish she cooks to bring a joyful tear to her eyes!"
  },
  {
    id: 'be-my-valentine',
    title: 'Will You Be My Valentine?',
    icon: '💕',
    description: 'A playful proposal card where the "NO" button comically dodges away, unlocking a heart explosion on "YES".',
    time: '≈ 2 min',
    bestFor: ["Valentine's Day", 'Proposals', 'Crushes'],
    price: 199,
    recommended: false,
    photoRequirement: {
      recommended: 2,
      min: 0,
      max: 6,
      tip: 'Upload 1–2 cute photos to display when they finally click YES!'
    },
    detailsNeeded: ["Crush / Partner Name", "Playful Valentine Question & Message", "Date idea / Surprise details", "1–2 Cute Photos"],
    prompts: [
      "You make my heart skip a beat every time you smile. Will you be my Valentine? 🌹💕",
      "I promise unlimited coffee, endless laughter, and your favorite snacks if you say YES! ☕✨",
      "There's only one acceptable answer here... try clicking NO if you dare! 😉"
    ],
    tips: "Keep the message playful! The dodging NO button guarantees a big laugh."
  },
  {
    id: 'wedding-invitation',
    title: 'Wedding Invitation',
    icon: '💒',
    description: 'Regal red & gold save-the-date with live countdown clock, Mehndi/Sangeet/Vivah timeline, venue map link, and instant RSVP form.',
    time: '≈ 4 min',
    bestFor: ['Indian Weddings', 'Save-The-Date', 'Destination Weddings'],
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
