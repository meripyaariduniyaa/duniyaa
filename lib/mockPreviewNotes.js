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
  };

  const selected = baseMockNotes[templateId] || {
    id: `preview-${templateId}`,
    template: templateId,
    recipient_name: 'Special Someone',
    custom_message: 'This is a live interactive preview of this digital experience! Every message, photo, and music track is fully customizable.',
    image_urls: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
    ],
    custom_details: {
      vibe: 'romantic',
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
