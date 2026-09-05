/**
 * Mock data generator for live interactive template previews.
 * Provides realistic, rich mock data for all 18+ templates.
 */
export function getMockPreviewNote(templateId) {
  const baseMockNotes = {
    birthday: {
      id: 'preview-birthday',
      template: 'birthday',
      recipient_name: 'Ananya',
      custom_message: 'Happy Birthday to the most incredible person in my world! Every memory with you is a gift, and I hope this year brings you all the magic, laughter, and joy you bring to everyone around you! 🎂✨',
      image_urls: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Rahul',
        birthday_relation: 'Best Friend',
        balloon_word_1: 'Joy',
        balloon_word_2: 'Love',
        balloon_word_3: 'Magic',
        balloon_word_4: 'Dreams',
        bouquet_msg_1: 'Keep shining bright ✨',
        bouquet_msg_2: 'Bestie forever 💕',
        bouquet_msg_3: 'Make a big wish! 🎂',
        bouquet_msg_4: 'Lucky to have you 🤗',
        bouquet_msg_5: 'Cheers to another year 🥂',
        bouquet_msg_6: 'Sending warm hugs ❤️',
        age_milestone: 'Turning 25! 🥳',
        vibe: 'soft',
        audio_preset: 'birthday-joy',
      }
    },
    'birthday-surprise': {
      id: 'preview-birthday-surprise',
      template: 'birthday-surprise',
      recipient_name: 'Ananya',
      custom_message: 'Happy Birthday! Blow out your candles and open your birthday surprise! 🎂✨',
      image_urls: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Rahul',
        birthday_relation: 'Girlfriend',
        vibe: 'soft',
      }
    },
    proposal: {
      id: 'preview-proposal',
      template: 'proposal',
      recipient_name: 'Meera',
      custom_message: 'From our late night chai talks to exploring the world together, every single moment with you feels like home. Will you be my partner forever? ❤️💍',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Aman',
        date_idea: 'A romantic candle-light dinner by the sea 🌅🥂',
        vibe: 'romantic',
        audio_preset: 'romantic-piano',
      }
    },
    'surprise-reveal-box': {
      id: 'preview-reveal-box',
      template: 'surprise-reveal-box',
      recipient_name: 'Rohan',
      custom_message: 'Unwrapping something special just for you! You mean the absolute world to me. 🎁✨',
      image_urls: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        hint_1: 'Layer 1: A memory of late night chai & endless laughs ☕',
        hint_2: 'Layer 2: Pack your bags for a surprise weekend trip! ✈️',
        hint_3: 'Layer 3: You are the best thing that ever happened to me ❤️',
        final_surprise: 'Pack your bags for Goa! 🏖️🎉',
        vibe: 'playful',
        audio_preset: 'upbeat-acoustic',
      }
    },
    'things-i-never-said': {
      id: 'preview-things-unsaid',
      template: 'things-i-never-said',
      recipient_name: 'Kabir',
      custom_message: 'Here are the words I held quietly in my heart for so long...',
      image_urls: [
        'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        unsaid: [
          'I notice how you make life feel lighter.',
          'I am deeply grateful for your quiet kindness.',
          'You matter to me far more than I usually say.'
        ],
        memory: 'That rainy evening at the cafe when we talked for hours.',
        vibe: 'deep',
        audio_preset: 'lofi-nostalgia',
      }
    },
    anniversary: {
      id: 'preview-anniversary',
      template: 'anniversary',
      recipient_name: 'Sanya',
      custom_message: '3 years of laughter, growth, and unconditional love. I choose you yesterday, today, and for all my tomorrows. ❤️🥂',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        special_date: '14th February 2023',
        promise_1: 'I promise to always choose you every single day',
        promise_2: 'I promise to be your safe place & your biggest cheerleader',
        promise_3: 'I promise to make you laugh even on hard days',
        promise_4: 'I promise to grow with you through every season',
        promise_5: 'I promise to love you more each passing year',
        vibe: 'romantic',
        audio_preset: 'romantic-piano',
      }
    },
    'mothers-day': {
      id: 'preview-mom',
      template: 'mothers-day',
      recipient_name: 'Maa',
      custom_message: 'Thank you for your warm hugs, infinite patience, and endless love. You make home feel like heaven. 💕🌸',
      image_urls: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        mom_title: 'Maa',
        relation: 'Your loving child',
        secret_note: 'One thing I rarely say: Thank you for putting us first every single day.',
        sticky_note_1: 'Late night warm milk & comforting talks',
        sticky_note_2: 'Your delicious home cooking',
        sticky_note_3: 'Always believing in my dreams',
        vibe: 'soft',
        audio_preset: 'peaceful-orchestral',
      }
    },
    puzzle: {
      id: 'preview-puzzle',
      template: 'puzzle',
      recipient_name: 'Aria',
      custom_message: 'Solve the photo puzzle to decode a secret message! 🧩✨',
      image_urls: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        hidden_message: 'You unlocked my heart! Thank you for being my favorite memory. ❤️',
        vibe: 'playful',
      }
    },
    'just-because': {
      id: 'preview-just-because',
      template: 'just-because',
      recipient_name: 'Ananya',
      custom_message: 'No big occasion, no hidden reason. Just woke up today and wanted to remind you how deeply special you are to me! ✨',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Kabir',
        small_detail: 'The world is a lot brighter with you in it.',
        vibe: 'soft',
        audio_preset: 'gentle-acoustic',
      }
    },
    'i-miss-you': {
      id: 'preview-miss-you',
      template: 'i-miss-you',
      recipient_name: 'Tara',
      custom_message: 'Distance is just geography. Every single day without you feels like a page missing from my favorite book.',
      image_urls: [
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Arjun',
        from_location: 'Mumbai 🏙️',
        to_location: 'London ✈️',
        missed_things: [
          'Our random 2 AM conversations',
          'The way you laugh before finishing your jokes',
          'Drinking hot chai together in the rain',
          'Your warm hugs when I have had a long day',
          'Just sitting together in comfortable silence'
        ],
        favorite_memory: 'Walking together along Marine Drive talking about our wildest dreams.',
        final_message: 'Counting down every second until I get to hold you again! ❤️',
        vibe: 'soft',
        audio_preset: 'peaceful-orchestral',
      }
    },
    'open-when': {
      id: 'preview-open-when',
      template: 'open-when',
      recipient_name: 'Pooja',
      custom_message: 'A private drawer of letters created just for you. Open each one whenever your heart needs it most.',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Dev',
        envelopes: [
          { title: 'you need a smile 😊', message: 'Remember that you are capable of extraordinary things, and your smile lights up every room!' },
          { title: 'you miss me 🫂', message: 'Close your eyes. Take a slow breath. I am cheering for you from across the miles.' },
          { title: 'you had a hard day ☕', message: 'Wrap yourself in a blanket and put your feet up. Today was tough, but you handled it like a hero.' },
          { title: 'you need courage 🦁', message: 'You have conquered 100% of your hardest days so far. This storm will pass too!' }
        ],
        vibe: 'soft',
        audio_preset: 'peaceful-orchestral',
      }
    },
    'emotional-apology': {
      id: 'preview-emotional-apology',
      template: 'emotional-apology',
      recipient_name: 'Riya',
      custom_message: 'I let my pride get in the way and I spoke without thinking. You mean far too much to me to ever let misunderstanding stay between us.',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Sameer',
        what_happened: 'I was careless with my words, and I deeply regret hurting you.',
        regrets: [
          'Letting my frustration overshadow your feelings.',
          'Not listening when you needed me to understand.',
          'Taking your patience for granted.'
        ],
        promise: 'I promise to listen with an open heart and earn back your smile.',
        final_message: 'Can we start fresh with a warm hug and coffee? ☕❤️',
        vibe: 'soft',
        audio_preset: 'gentle-acoustic',
      }
    },
    'youre-my-person': {
      id: 'preview-my-person',
      template: 'youre-my-person',
      recipient_name: 'Sneha',
      custom_message: 'In a world full of noise, you are my home. Out of 8 billion people, you will always be my person.',
      image_urls: [
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Kunal',
        reasons: [
          'You know what I am thinking without me saying a word.',
          'You make ordinary car rides feel like grand adventures.',
          'You celebrate my small wins like they are world victories.',
          'You are the very first person I want to text good news to.',
          'You love me on days I struggle to love myself.'
        ],
        inside_joke: 'Only we know why order #42 was the greatest night ever 😂',
        vibe: 'soft',
        audio_preset: 'romantic-piano',
      }
    },
    sorry: {
      id: 'preview-sorry',
      template: 'sorry',
      recipient_name: 'Cutie',
      custom_message: 'I know I messed up and said things out of frustration. I am truly sorry from the bottom of my heart. You mean everything to me, and I promise to do so much better for us. Please forgive me? 💕',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
      ],
      custom_details: {
        promise_1: 'I promise to always listen with calm patience and never let anger win.',
        promise_2: 'I promise to bring you your favorite treats whenever you are down.',
        promise_3: 'I promise to protect our bond and never take you for granted.',
        vibe: 'cute',
      }
    },
    'wedding-invitation': {
      id: 'preview-wedding',
      template: 'wedding-invitation',
      recipient_name: 'Dear Friends & Family',
      custom_message: 'Together with their families, we invite you to share in our joy and celebrate our sacred wedding union.',
      image_urls: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        bride_name: 'Aanya',
        groom_name: 'Vivaan',
        wedding_date: 'December 18, 2026',
        venue: 'The Leela Palace, Udaipur 🏰',
      }
    },
    'a-rose-for-someone-special': {
      id: 'preview-rose',
      template: 'a-rose-for-someone-special',
      recipient_name: 'Nandini',
      custom_message: 'A digital rose that will never wither, just like my admiration for you. Tap the petal to bloom our memories! 🌹✨',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sender_name: 'Kabir',
        rose_color: 'Crimson Red',
        petal_msg_1: 'For your infectious laughter 🌹',
        petal_msg_2: 'For your gentle heart 🌸',
        petal_msg_3: 'For always being there 💕',
        vibe: 'romantic',
      }
    },
    rakshabandhan: {
      id: 'preview-rakshabandhan',
      template: 'rakshabandhan',
      recipient_name: 'Bhai',
      custom_message: 'From stealing each other’s chocolates to being each other’s lifelong protector. Happy Raksha Bandhan to my forever partner-in-crime! 🧵✨',
      image_urls: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        sibling_relation: 'Sister',
        promise: 'To always have your back, no matter where life takes us.',
        gift_hint: 'Your favorite box of sweets is on its way! 🍬',
        vibe: 'playful',
      }
    },
    friendship: {
      id: 'preview-friendship',
      template: 'friendship',
      recipient_name: 'Partner in Crime',
      custom_message: 'Through every triumph and every chaotic blunder, there is nobody else I would rather have in my corner. Cheers to our unbreakable bond! 🥂✨',
      image_urls: [
        'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        nickname: 'Bestie',
        memory_highlight: 'That unforgettable midnight road trip!',
        vibe: 'playful',
      }
    },
    'fathers-day': {
      id: 'preview-dad',
      template: 'fathers-day',
      recipient_name: 'Papa',
      custom_message: 'Thank you for your quiet strength, your selfless guidance, and always being the rock our family leans on. Happy Father’s Day! 👔🌟',
      image_urls: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        dad_title: 'Papa',
        relation: 'Your proud child',
        secret_note: 'Everything I achieve in life is built on the foundation you created.',
        vibe: 'soft',
      }
    },
    'get-well-soon': {
      id: 'preview-get-well',
      template: 'get-well-soon',
      recipient_name: 'Dear Friend',
      custom_message: 'Sending you healing energy, warm soup, and all the love in the world. Rest up and bounce back stronger! 🍵💐',
      image_urls: [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
      ],
      custom_details: {
        care_tip: 'Take all the rest you need today!',
        vibe: 'soft',
      }
    },
  };

  // Support aliases
  const aliasMap = {
    'love-letter': 'anniversary',
    'be-my-valentine': 'proposal',
    'letter-for-mom': 'mothers-day',
    'letter-for-dad': 'fathers-day',
    'warm-hug': 'get-well-soon',
    apology: 'sorry',
  };

  const resolvedId = aliasMap[templateId] || templateId;

  const selected = baseMockNotes[resolvedId] || {
    id: `preview-${templateId}`,
    template: templateId,
    recipient_name: 'Special Someone',
    custom_message: 'This is a live interactive preview of this digital experience! Every message, photo, and music track is fully customizable.',
    image_urls: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
    ],
    custom_details: {
      vibe: 'soft',
      audio_preset: 'romantic-piano',
      small_detail: 'Sample personal memory note.',
      unsaid: ['Sample truth 1', 'Sample truth 2', 'Sample truth 3'],
      missed_things: ['Your laugh', 'Chai talks', 'Routines', 'Hugs', 'Smiles'],
      regrets: ['Not listening enough', 'Taking time for granted', 'Being late'],
      promise: 'To always show up for you with care.',
    }
  };

  return selected;
}
