import { NextResponse } from 'next/server';

const TEMPLATE_ALIAS = {
  'birthday-surprise': 'birthday',
  'love-letter': 'anniversary',
  'letter-for-mom': 'mothers-day',
  'letter-for-dad': 'fathers-day',
  'be-my-valentine': 'proposal',
  'warm-hug': 'get-well-soon',
  apology: 'sorry',
};

// ─── Template Context Map ──────────────────────────────────────────────────
// Describes each template's occasion/goal/style so the AI crafts relevant messages.
const TEMPLATE_CONTEXT = {
  sorry: {
    occasion: 'heartfelt apology',
    goal: 'express genuine remorse, ask for forgiveness, and promise to do better',
    style: 'emotionally sincere, vulnerable, warm',
    avoid: 'excuses or blame-shifting',
  },
  apology: {
    occasion: 'heartfelt apology',
    goal: 'express genuine remorse, ask for forgiveness, and promise to do better',
    style: 'emotionally sincere, vulnerable, warm',
    avoid: 'excuses or blame-shifting',
  },
  birthday: {
    occasion: 'birthday celebration',
    goal: 'make the birthday person feel loved, special, and celebrated',
    style: 'joyful, celebratory, heartwarming',
    avoid: 'generic wishes — make it feel personal and alive',
  },
  'birthday-surprise': {
    occasion: 'birthday surprise reveal',
    goal: 'build excitement and feel like an unforgettable birthday moment',
    style: 'joyful, dramatic, celebratory',
    avoid: 'being too plain or predictable',
  },
  anniversary: {
    occasion: 'romantic anniversary',
    goal: 'celebrate love, shared memories, and promises for the future',
    style: 'deeply romantic, nostalgic, tender',
    avoid: 'clichés — use specific emotional imagery',
  },
  'love-letter': {
    occasion: 'romantic love letter',
    goal: 'express deep love, longing, and devotion',
    style: 'poetic, romantic, intimate',
    avoid: 'being generic — evoke emotions and vivid feelings',
  },
  'mothers-day': {
    occasion: "Mother's Day tribute",
    goal: 'express deep gratitude, admiration, and love for mom',
    style: 'heartfelt, tender, grateful',
    avoid: 'surface-level compliments — go deep into appreciation',
  },
  'letter-for-mom': {
    occasion: 'letter of gratitude to mom',
    goal: 'express deep gratitude, admiration, and unconditional love for mom',
    style: 'heartfelt, tender, grateful',
    avoid: 'surface-level compliments — go deep into appreciation',
  },
  proposal: {
    occasion: 'romantic confession or proposal',
    goal: 'ask someone special to be a partner in a charming, playful-yet-sincere way',
    style: 'sweet, playful, romantic',
    avoid: 'being too serious or stiff — keep butterflies and warmth alive',
  },
  'be-my-valentine': {
    occasion: "Valentine's Day / romantic confession",
    goal: 'ask someone to be a Valentine in a way that melts their heart',
    style: 'sweet, romantic, lightly playful',
    avoid: 'being too shy — be charming and confident',
  },
  friendship: {
    occasion: 'Friendship Day celebration / tribute to a best friend',
    goal: 'celebrate the bond, shared memories, and jokes of a best friendship',
    style: 'fun, warm, genuine, nostalgic',
    avoid: 'being too formal — speak like a best friend would',
  },
  puzzle: {
    occasion: 'surprise reveal puzzle card',
    goal: 'build curiosity and excitement as the recipient solves the puzzle',
    style: 'mysterious, playful, exciting',
    avoid: 'giving away the surprise too early',
  },
  'wedding-invitation': {
    occasion: 'wedding invitation / save-the-date',
    goal: 'invite guests warmly to witness a sacred union of love',
    style: 'elegant, warm, celebratory',
    avoid: 'being too formal or stiff — keep the warmth of family and joy',
  },
  'surprise-reveal-box': {
    occasion: 'gift box surprise reveal',
    goal: 'build layer-by-layer excitement and anticipation for the final surprise',
    style: 'exciting, playful, mysterious',
    avoid: 'being plain — create a sense of wonder with every word',
  },
  'a-rose-for-someone-special': {
    occasion: 'romantic rose dedication',
    goal: 'dedicate a virtual rose with deep affection and poetic feeling',
    style: 'poetic, romantic, cinematic',
    avoid: 'being too literal — use imagery, metaphors, and emotion',
  },
  rakshabandhan: {
    occasion: 'Raksha Bandhan sibling celebration',
    goal: 'honor the sibling bond with warmth, nostalgia, and festive joy',
    style: 'warm, nostalgic, festive, sibling-specific',
    avoid: 'generic religious content — focus on the personal sibling bond',
  },
  'just-because': {
    occasion: 'just-because appreciation note', goal: 'make the recipient feel seen and special without relying on an occasion', style: 'warm, effortless, personal', avoid: 'mentioning an apology, forgiveness, or a special event',
  },
  'things-i-never-said': {
    occasion: 'deep unsaid-feelings reveal', goal: 'gently express truths the sender has held back', style: 'honest, intimate, tender', avoid: 'apology language or melodrama',
  },
  'i-miss-you': {
    occasion: 'long-distance miss-you message', goal: 'make distance feel emotional but hopeful through specific everyday moments', style: 'nostalgic, affectionate, reassuring', avoid: 'guilt, blame, or an apology tone',
  },
  'open-when': {
    occasion: 'open-when letter collection', goal: 'write short comforting messages for different moments in the recipient’s life', style: 'supportive, caring, concise', avoid: 'repeating the same message across envelopes',
  },
  'emotional-apology': {
    occasion: 'accountable apology experience', goal: 'own the harm, name regret, and promise concrete change while respecting their space', style: 'calm, sincere, accountable', avoid: 'excuses, pressure to forgive, or romantic clichés',
  },
  'youre-my-person': {
    occasion: 'you are my person tribute', goal: 'celebrate a uniquely close bond through reasons, memories, and an inside joke', style: 'affectionate, natural, deeply personal', avoid: 'generic apology or occasion-based language',
  },
};

// ─── High-Quality Fallback Message Engine ─────────────────────────────────
const FALLBACK_ENGINE = {
  'just-because': { sincere: [`{name}, there is no occasion today. I just wanted to remind you that you make life warmer, lighter, and better. {keywords}You are so special to me. ✨`, `{name}, this is a small note for an important person. Thank you for being exactly who you are. {keywords}💛` ] },
  'things-i-never-said': { sincere: [`{name}, some feelings deserve more than a passing message. {keywords}I notice you, I value you, and I hope you always know how much you mean to me. 💌`, `{name}, I have held these words quietly for too long: you make a real difference in my life. {keywords}✨`] },
  'i-miss-you': { sincere: [`{name}, distance has a way of making the smallest things feel precious. {keywords}I miss you, and I am holding our next moment together close. 🫂`, `{name}, even from far away, you are part of my everyday thoughts. {keywords}Until we meet again, I am only a message away. 💛`] },
  'open-when': { sincere: [`{name}, whenever you need this, please remember: you are loved, capable, and never as alone as you think. {keywords} 💌`, `{name}, save this for a hard day: I believe in you completely, even when you are struggling to believe in yourself. ✨`] },
  'emotional-apology': { sincere: [`{name}, I am sorry for the hurt I caused. {keywords}I take responsibility without asking you to make this easier for me. I will do better through my actions.`, `{name}, I understand that an apology does not erase what happened. I am sorry, and I will respect whatever time and space you need. 💛`] },
  'youre-my-person': { sincere: [`{name}, you are the person I want to tell everything to — the good, the messy, and the ordinary. {keywords}Life feels more like home with you in it. ❤️`, `{name}, some people become part of your world so naturally that you cannot imagine it without them. You are that person for me. ✨`] },
  sorry: {
    romantic: [
      `Dearest {name}, I know I messed up and said things out of anger. You mean everything to me, and my heart breaks knowing I hurt you. I promise to listen better, cherish you more, and make things right. Please forgive me? 💕`,
      `To my favorite person {name}, I'm truly sorry from the bottom of my heart. {keywords}I never want to see you upset. Let's start fresh and make new happy memories together. 💖`,
      `Hey {name}, I'm so deeply sorry for my mistake. You bring so much joy into my life, and losing your smile is the worst feeling. I promise to do better every single day. Forgive me? 🥺`,
    ],
    funny: [
      `Dear {name}, I am 100% guilty, 0% innocent, and 1000% sorry! I promise to buy your favorite food and obey all your orders for a whole week if you forgive me! 🍕🎁`,
      `Warning: Extra cute apology incoming for {name}! I messed up big time, but I promise to be on my best behavior forever. Please release me from the doghouse? 🐶❤️`,
      `Hey {name}, I'm so sorry! I'll do 100 pushups, give you endless hugs, and never argue again. Can we be sweet again? 🥺💕`,
    ],
    sincere: [
      `Dear {name}, I am taking full responsibility for what happened. You deserve so much patience, love, and respect. {keywords}I value our bond more than anything else. Thank you for your grace. 🙏`,
      `To {name}, I am truly sorry. I've spent time reflecting on my actions and I want to apologize sincerely. I will work hard to rebuild your trust step by step. ❤️`,
      `Dearest {name}, my apology comes from a very deep and honest place. You are essential to my happiness, and I promise to handle your heart with absolute care. 💕`,
    ],
  },
  birthday: {
    romantic: [
      `Happy Birthday to the love of my life, {name}! 🎉🎂 You make every single day feel like a magical celebration. {keywords}May this year bring you endless happiness, health, and all your heart's desires! ❤️✨`,
      `Wishing the happiest birthday to my favorite person, {name}! 🎂✨ Blow out the candles and know that I'll be right here making every single one of your wishes come true. Yours always 💕`,
      `To my darling {name}, happy birthday! You grow more gorgeous and incredible with every passing year. Here's to another year of shared dreams, long talks, and infinite love! 🎁🥂`,
    ],
    funny: [
      `Happy Birthday {name}! 🎂🎉 Don't worry about getting older — you're like fine wine, or sharp cheese, or a classic video game! Let's eat way too much cake today! 🍰🥂`,
      `Happy Birthday to my partner-in-crime {name}! 🎈 Another year of surviving my jokes and stealing my food. You deserve a trophy! Have the most awesome day! 🎉`,
      `To {name}: Happy Birthday! You're officially old enough to know better, but still young enough to do it anyway! Let's party! 🥳🎂`,
    ],
    sincere: [
      `Dearest {name}, wishing you a joyful and blessed birthday. Thank you for bringing light, wisdom, and warmth into the lives of everyone around you. Have a wonderful year ahead! 💐✨`,
      `Happy Birthday {name}! {keywords}I am so grateful for your presence in my life. Wishing you boundless success, peace, and love today and always. 🎉`,
      `Warmest birthday wishes to you, {name}! May your day be filled with warm laughter, sweet moments, and surrounded by everyone who loves you. 🎂🎁`,
    ],
  },
  'birthday-surprise': {
    romantic: [
      `Happy Birthday to the love of my life, {name}! 🎉🎂 You make every single day feel like a magical celebration. {keywords}May this year bring you endless happiness! ❤️✨`,
      `Wishing the happiest birthday to my favorite person, {name}! Blow out the candles and know that I'll be right here making every wish come true. Yours always 💕`,
      `To my darling {name}, happy birthday! Here's to another year of shared dreams, long talks, and infinite love! 🎁🥂`,
    ],
    funny: [
      `Happy Birthday {name}! 🎂🎉 Another year wiser, which means absolutely nothing — let's eat cake and act like kids! 🍰🥂`,
      `To {name}: Warning — this birthday card may cause excessive smiling, happy tears, and a sudden urge to eat cake! 🥳`,
      `Happy Birthday {name}! 🎈 Another year of surviving me. You deserve an award. Have the most awesome day! 🎉`,
    ],
    sincere: [
      `Dearest {name}, wishing you a joyful and blessed birthday. Thank you for bringing light and warmth into so many lives. Have a wonderful year ahead! 💐✨`,
      `Happy Birthday {name}! {keywords}I am so grateful for your presence in my life. Wishing you boundless success and love today and always. 🎉`,
      `Warmest birthday wishes, {name}! May your day be filled with laughter, sweet moments, and love! 🎂🎁`,
    ],
  },
  anniversary: {
    romantic: [
      `My love {name}, every single day with you feels like a dream I never want to wake up from. {keywords}My heart overflows with gratitude for you. You are my home, my joy, and my forever. ❤️`,
      `Dearest {name}, another year with you is the greatest gift life has given me. Your smile brightens my darkest days. I love you more than words can express. 💌🌹`,
      `To {name}, you are the missing piece I never knew I was looking for. Thank you for loving me and making every ordinary day extraordinary. Always yours. 💕`,
    ],
    poetic: [
      `Like stars that navigate the night, your love guides me home {name}. {keywords}I see forever in your eyes. Yours, yesterday, today, and for eternity. 🌹✨`,
      `My dearest {name}, if I had a flower for every time I thought of you, I could walk through my garden forever. You are the heart of my world. 🌿💖`,
      `To {name}: In a world of fleeting moments, my love for you is timeless and constant. Thank you for being my sanctuary and my light. 🕯️✨`,
    ],
    sincere: [
      `{name}, I am so grateful we chose each other. This anniversary reminds me of every reason I fell in love with you and every reason I choose you again. ❤️`,
      `To my dearest {name}, thank you for every shared laugh, every comforting hug, and every moment of patience. Happy Anniversary! 🥂💕`,
      `{name}, with every year that passes, my love for you only grows deeper. Here's to forever. 🥂✨`,
    ],
  },
  'love-letter': {
    romantic: [
      `My love {name}, every single day with you feels like a dream I never want to wake up from. {keywords}My heart overflows with gratitude. You are my home, my joy, and my forever. ❤️`,
      `Dearest {name}, writing this letter is easy because my heart is so full of you. Your smile brightens my darkest days. I love you more than words can express. 💌🌹`,
      `To {name}, you are the missing piece I never knew I was looking for. Thank you for loving me and making life extraordinary. Always yours. 💕`,
    ],
    poetic: [
      `Like stars that navigate the night, your love guides me home {name}. {keywords}I see forever in your eyes. Yours, yesterday, today, and for eternity. 🌹✨`,
      `My dearest {name}, if I had a flower for every time I thought of you, I could walk through my garden forever. You are the heart of my world. 🌿💖`,
      `To {name}: In a world of fleeting moments, my love for you is timeless and constant. Thank you for being my sanctuary and my light. 🕯️✨`,
    ],
  },
  'mothers-day': {
    sincere: [
      `Dearest {name}, thank you for every meal cooked with love, every warm hug, every sacrifice, and your endless patience. {keywords}You are the strongest, sweetest person in the world! 💐❤️`,
      `To the best Mom ever, {name}! Thank you for believing in me even when I doubted myself. Your unconditional love is the greatest gift of my life. I love you so much, Ma! 🌸💕`,
      `Dear {name}, one thing I never tell you often enough is how much I admire you. Thank you for making our home a sanctuary of love. Wishing you peace and happiness always! 🌷✨`,
    ],
  },
  'letter-for-mom': {
    sincere: [
      `Dearest {name}, thank you for every meal cooked with love, every warm hug, and your endless patience. {keywords}You are the strongest, sweetest person in the world! 💐❤️`,
      `To the best Mom ever, {name}! Thank you for believing in me even when I doubted myself. Your unconditional love is the greatest gift of my life. I love you so much! 🌸💕`,
      `Dear {name}, one thing I never say often enough — I admire you so deeply. Thank you for making our home a sanctuary of love. Wishing you peace and happiness always! 🌷✨`,
    ],
  },
  proposal: {
    romantic: [
      `Hey {name}! You bring magic, smiles, and butterflies into my life every single day. {keywords}Will you do me the honor of being mine? 💕🌹`,
      `To the most beautiful person I know, {name} — my heart skips a beat whenever you're near. Let me make this the most memorable moment of our story. Will you be mine? 💖✨`,
      `{name}, I've been looking for the right words, but all I know is — life is so much better with you in it. Will you say yes? 🥺💕`,
    ],
    funny: [
      `Hey {name}! I promise unlimited snacks, your favorite boba/coffee, and control of the TV remote if you say YES! Will you be mine? 🍕☕💕`,
      `Dear {name}, the "NO" button on this card is totally broken anyway — so you have no choice! Will you be mine? 😉💖`,
      `Warning to {name}: This card is scientifically designed to make you say YES. Side effects include butterflies, blushing, and lots of happy feelings! 🥳💕`,
    ],
  },
  'be-my-valentine': {
    romantic: [
      `Hey {name}! You bring magic, smiles, and butterflies into my life every single day. {keywords}Will you do me the honor of being my Valentine? 💕🌹`,
      `To the cutest person I know, {name} — my heart skips a beat whenever you walk into the room. Let me make this Valentine's Day unforgettable for you! Say YES? 💖✨`,
      `{name}, every time I see you, my day gets so much brighter. Will you be my Valentine and let me show you just how special you are? 🥺💕`,
    ],
    funny: [
      `Hey {name}! I promise unlimited snacks, your favorite boba/coffee, and control of the TV remote if you say YES! Will you be my Valentine? 🍕☕💕`,
      `Dear {name}, the "NO" button on this card is totally broken anyway, so you have no choice! Will you be my Valentine? 😉💖`,
      `To {name}: Roses are red, violets are blue, I ran out of good ideas, but I really like you! 🌹 Be my Valentine? 😅💕`,
    ],
  },
  friendship: {
    funny: [
      `To my partner in absolute chaos, {name}! 🎉 Happy Friendship Day to the only person who truly understands my unhinged energy! Here's to more adventures, late nights, and terrible decisions together! 👯💖`,
      `{name}! Thank you for putting up with me for this long — that alone deserves an award! 🏆 You're my favorite weirdo and I wouldn't trade our friendship for anything! 🤣❤️`,
      `Hey {name}, I was going to write you a beautiful poem, but then I remembered neither of us is that serious. Happy Friendship Day you absolute legend! 🥳`,
    ],
    sincere: [
      `To my dearest {name}, true friendship is rare and ours is one of the greatest treasures in my life. {keywords}Thank you for every laugh, every late-night talk, and every moment of kindness. Happy Friendship Day! 💛`,
      `{name}, having you as a friend is one of the best things that ever happened to me. You make every ordinary day feel special. Wishing you a wonderful Friendship Day! 🌟💕`,
      `Dearest {name}, you've been my anchor, my cheerleader, and my confidant. I am beyond grateful for your friendship. Happy Friendship Day! 🫂💛`,
    ],
    romantic: [
      `To {name}, you started as my friend and became someone I treasure more than words can say. {keywords}Happy Friendship Day to someone who means the whole world to me! 💖`,
      `{name}, every memory we share is a gift I hold close to my heart. You are irreplaceable. Wishing you the happiest Friendship Day! 🌟💕`,
      `Dearest {name}, in a world full of people, I'm so glad I found you. Happy Friendship Day! ❤️`,
    ],
  },
  puzzle: {
    funny: [
      `Surprise {name}! 🧩 Can you piece this together? A special surprise is waiting inside for you! Don't peek — solve every piece and see what's revealed! 🎁✨`,
      `Hey {name}, this puzzle holds a secret only you deserve to know! Take your time... or don't — I know how impatient you are! 😄🧩`,
      `{name}! I hid something really special for you inside this puzzle! Solve it and see what all the fuss is about! 🎉🧩`,
    ],
    sincere: [
      `For {name}, every piece of this puzzle represents a memory, a feeling, and a piece of my heart. Put it all together to find what I want to say! 🧩💕`,
      `Dearest {name}, I wanted this moment to be special — so I hid my surprise inside this puzzle just for you. Solve it and discover what you mean to me! ✨`,
      `{name}, this puzzle is more than a game. Each piece brings you closer to something I've been wanting to share. {keywords}Ready to see? 🧩💖`,
    ],
  },
  'wedding-invitation': {
    sincere: [
      `We cordially invite you, {name}, to join us as we celebrate our sacred union of love, laughter, and togetherness. {keywords}Your presence will make our big day truly blessed! 💒🪔`,
      `Save the date, {name}! Join us as we take our wedding vows under the stars. We cannot wait to celebrate this new beginning with you by our side! ✨💍`,
      `Dearest {name}, we are overjoyed to invite you to witness the beginning of our forever. Your love and blessings mean the world to us. Please do join us! 🌸💒`,
    ],
    romantic: [
      `{name}, we would be so honored to have you with us as we say "I do" and begin our greatest adventure together. {keywords}Please join us to celebrate our love! 💒💕`,
      `To {name} — two hearts are becoming one, and we want yours there with us. Save the date! We can't wait to share this magical day with you. 💍✨`,
      `Dearest {name}, our love story is heading into its most beautiful chapter — and you are part of it. Please grace us with your presence on our wedding day! 🌸💒`,
    ],
  },
  'surprise-reveal-box': {
    funny: [
      `Surprise {name}! 🎁 Unbox each layer to reveal what's waiting inside just for you! {keywords}Tap the box and untie the ribbon — don't be too slow! 🎉✨`,
      `Hey {name}, behind every bow lies a special secret memory! Get ready for a major explosion of love and surprises! 🎉🎁`,
      `{name}! I packed so much love into this box, I had to add extra layers just to fit it all! Start unboxing and see what's inside! 🥳🎁`,
    ],
    romantic: [
      `{name}, every layer you unwrap holds a piece of my heart and a memory I cherish. {keywords}Take your time and enjoy every surprise! 💕🎁`,
      `For you, {name} — I've wrapped up my feelings layer by layer. Each ribbon you untie brings you closer to what I truly want to say. 🌹🎁`,
      `Dearest {name}, this box holds more than gifts — it holds every moment, every laugh, and every reason why you mean the world to me. Enjoy unwrapping! 💖✨`,
    ],
  },
  'a-rose-for-someone-special': {
    poetic: [
      `Like a rose blooming under moonlight, my feelings for you {name} grow deeper with every passing moment. {keywords}Dedicated to you with all my heart. 🌹✨`,
      `This virtual rose will never wither, just like my love and admiration for you {name}. Dedicated to the person who fills my world with warmth and light. ❤️🌹`,
      `For you {name} — a rose that blooms eternal, just like my devotion. May it remind you forever how deeply you are cherished. 🌹💖`,
    ],
    romantic: [
      `{name}, just as a rose needs sunlight to bloom, I need you to feel alive. You are the most beautiful part of my world. {keywords}This rose is for you. 🌹❤️`,
      `To my dearest {name} — every petal of this rose carries a feeling I have for you. Endless, unwavering, and forever yours. 💕🌹`,
      `{name}, I searched the whole world for something beautiful enough to give you — and settled on a rose. But even that pales next to you. 🌹💖`,
    ],
  },
  rakshabandhan: {
    sincere: [
      `Dearest {name}, this rakhi ties more than a thread — it binds my heart to yours, forever. {keywords}Happy Raksha Bandhan to my dearest sibling! 🪢❤️`,
      `{name}, no matter how far life takes us, you are always my first best friend and my forever protector. Dua hai tujhe sab kuch mile! 💛🪢`,
      `To {name} — I wouldn't trade a single memory, argument, or laugh we've shared. You are my whole world, and this Rakhi is a promise of my love. ❤️🪢`,
    ],
    funny: [
      `Hey {name}! Happy Raksha Bandhan to the sibling who is legally obligated to protect me! Now pay up in sweets and gifts! 😄🪢🍬`,
      `To {name} — the only person who fought with me every day growing up and is still my favorite human being! Happy Raksha Bandhan! 🥳🪢`,
      `{name}! I tied this rakhi on your wrist so you can never escape your duty to buy me whatever I want. Happy Rakshabandhan! 😂💛🪢`,
    ],
    romantic: [
      `{name}, the bond between us is the most precious thread in the fabric of my life. {keywords}Happy Raksha Bandhan, my dearest sibling! 🪢💛`,
      `To {name} — you are my safe place, my cheerleader, and my forever friend. Wishing you endless happiness this Raksha Bandhan! ❤️🪢`,
      `Dearest {name}, the love between siblings is unlike any other. You have my heart, always. Happy Raksha Bandhan! 🌸🪢`,
    ],
  },
};

// ─── Build a context-rich HuggingFace prompt ──────────────────────────────
function buildHFPrompt(templateId, name, tone, keywords, mode, currentMessage, relationship = '') {
  const resolvedId = TEMPLATE_ALIAS[templateId] || templateId;
  const ctx = TEMPLATE_CONTEXT[resolvedId] || TEMPLATE_CONTEXT['sorry'];
  const relStr = relationship ? `The recipient is the sender's ${relationship}. ` : '';

  if (mode === 'enhance') {
    return [
      `You are an expert editor specializing in ${ctx.occasion} messages.`,
      relStr ? `Relationship context: ${relStr}` : '',
      `Your task is to polish and enhance the spelling, grammar, flow, and emotional expressiveness of the original message for ${name} to be more ${tone}.`,
      `CRITICAL REQUIREMENT: You MUST preserve the exact core meaning, key details, specific memories, facts, and the personal essence of the original message. Do NOT change its meaning, do NOT write a generic message, and do NOT remove or replace their personal details/references.`,
      `Occasion: ${ctx.occasion}. Tone: ${tone}. Style direction: ${ctx.style}.`,
      keywords ? `Weave in these additional details or memories naturally if they fit: ${keywords}.` : '',
      `Original message to polish: "${currentMessage}"`,
      `Return ONLY the polished message. No introductory text, no conversational fillers, no labels, and no quotation marks. Keep it under 130 words with appropriate emojis.`,
    ].filter(Boolean).join(' ');
  }

  return [
    `You are an expert writer specializing in ${ctx.occasion} messages.`,
    `Write a beautiful, personalized ${tone} ${ctx.occasion} message for ${name}${relationship ? ` who is the sender's ${relationship}` : ''}.`,
    `Goal: ${ctx.goal}. Style: ${ctx.style}. Avoid: ${ctx.avoid}.`,
    relStr ? `Make sure the emotion, tone, intimacy, and vocabulary perfectly match a message written for one's ${relationship}.` : '',
    keywords ? `Naturally weave in these personal details or memories: ${keywords}.` : '',
    `Return ONLY the message. No explanations, no labels, no quotation marks. Keep it under 130 words with sweet emojis.`,
  ].filter(Boolean).join(' ');
}

// ─── Interpolate {name} and {keywords} placeholders ───────────────────────
function interpolate(template, name, keywords) {
  const kw = keywords ? `Remembering ${keywords}, ` : '';
  return template
    .replace(/\{name\}/g, name)
    .replace(/\{keywords\}/g, kw);
}

// ─── Get fallback messages for a given template + tone + relationship ─────
function getFallbackMessages(templateId, tone, name, keywords, relationship = '') {
  const resolvedId = TEMPLATE_ALIAS[templateId] || templateId;

  // Relationship-specific fallback messages for Birthday
  if ((resolvedId === 'birthday' || resolvedId === 'birthday-surprise') && relationship) {
    const rel = relationship.toLowerCase();
    if (rel.includes('mom')) {
      return [
        `Happy Birthday to the most loving Mom in the world, ${name}! 🌸 Thank you for your warmth, endless support, and unconditional love. May your day be filled with peace, joy, and all the sweetness you bring into our lives! 💕💐`,
        `Dearest Mom (${name}), wishing you the happiest of birthdays! 🎂✨ You are the heart of our family, and I am so blessed to be your child. Love you endlessly! ❤️🌸`,
        `Happy Birthday Mom! 💐 Thank you for every quiet sacrifice, every warm meal, and always believing in me. Hope your special day is full of smiles! 🎂💖`
      ];
    }
    if (rel.includes('dad')) {
      return [
        `Happy Birthday to my hero and Dad, ${name}! 👔 Thank you for your quiet strength, wisdom, and always guiding me forward. Wishing you health, happiness, and an awesome year ahead! 🌟🎂`,
        `To the best Dad ever (${name}) — Happy Birthday! 🎉 Thank you for always having my back and teaching me how to stand strong. Enjoy your special day! 👔✨`,
        `Wishing a fantastic Birthday to my Dad, ${name}! 🥳 May this year bring you great health, relaxation, and everything you love most! 👔🎁`
      ];
    }
    if (rel.includes('girlfriend') || rel.includes('wife')) {
      return [
        `Happy Birthday to the love of my life, ${name}! 💖 You make every single day brighter, sweeter, and full of magic. I'm so grateful for you. Here's to making all your dreams come true! 🎂✨`,
        `To my beautiful ${relationship}, ${name} — Happy Birthday! 🌸 You grow more gorgeous and amazing every year. I love you more than words can say. Yours forever 💕🥂`,
        `Wishing the happiest birthday to my favorite person, ${name}! 🎁 Blow out the candles knowing I'll be right beside you for all of them! 💖✨`
      ];
    }
    if (rel.includes('boyfriend') || rel.includes('husband')) {
      return [
        `Happy Birthday to my favourite person, ${name}! 💙 Thank you for being my rock, my biggest smile, and my safe place. Wishing you a year as incredible as you are! 🥂✨`,
        `To my handsome ${relationship}, ${name} — Happy Birthday! 🥳 You bring so much joy and adventure into my world. So proud to walk beside you! ❤️🎈`,
        `Wishing the happiest birthday to my love, ${name}! 🎂 May this new age bring you boundless success, happiness, and all the love in the world! 💙✨`
      ];
    }
    if (rel.includes('brother')) {
      return [
        `Happy Birthday to the best brother ever, ${name}! 💪 From chaotic memories to always having each other's back, I'm so lucky to have you. Hope this year brings you massive success! 🎉🔥`,
        `Hey Bro (${name}), Happy Birthday! 🚀 Another year older, but let's be honest — still not wiser! Have an absolute blast today! 😂🎂`,
        `To my brother ${name} — Happy Birthday! 🥳 Thanks for being my partner-in-crime through thick and thin. Keep crushing it! 💪🎉`
      ];
    }
    if (rel.includes('sister')) {
      return [
        `Happy Birthday to my sweet sister, ${name}! 💝 Thank you for being my confidante, my laugh-partner, and my built-in best friend. Shine bright today and always! 🎂✨`,
        `To my amazing sister ${name} — Happy Birthday! 🌸 May your day be filled with sparkles, sweet treats, and everything that makes you happy! 💖🎁`,
        `Happy Birthday Sister! 👯‍♀️ Life is so much sweeter and funnier with you in it. Keep being your wonderful self! 🎉💝`
      ];
    }
    if (rel.includes('friend')) {
      return [
        `Happy Birthday to my bestie, ${name}! 🤗 Life is so much more fun with you in it. Here's to another year of unforgettable memories, inside jokes, and endless adventures! 🎉🎈`,
        `Wishing the happiest birthday to my ride-or-die, ${name}! 🥂 Keep shining, keep laughing, and let's eat way too much cake today! 🍰✨`,
        `To my favourite human ${name} — Happy Birthday! 🥳 So grateful for our friendship and all the chaotic fun we share! 🎁💛`
      ];
    }
  }

  const engine = FALLBACK_ENGINE[resolvedId] || FALLBACK_ENGINE['sorry'];

  // Try exact tone first, then sensible defaults
  const toneFallbacks = [tone, 'romantic', 'sincere', 'funny', 'poetic'];
  let toneList = null;
  for (const t of toneFallbacks) {
    if (engine[t]) { toneList = engine[t]; break; }
  }
  if (!toneList) toneList = Object.values(engine)[0];

  return toneList.map(msg => interpolate(msg, name, keywords));
}

// Structured template autofill. This intentionally returns fields, not HTML or
// prose to parse, so the creator can safely review and edit every value.
function buildTemplateFill(templateId, name, tone, keywords, relationship = '') {
  const context = keywords || `the little moments you share as ${relationship || 'people who care about each other'}`;
  const message = getFallbackMessages(templateId, tone, name, context, relationship)[0];
  const short = (prefix, index) => `${prefix} ${context}${index ? ` — memory ${index}` : ''}.`;

  // Default birthday fields
  let balloonWords = ['Joy', 'Love', 'Magic', 'Dreams'];
  let bouquetMsgs = [
    'Keep shining.',
    'You are deeply loved.',
    'Make a wish.',
    'Celebrate yourself.',
    'Your best year awaits.',
    'Never stop being you.'
  ];

  if (relationship) {
    const rel = relationship.toLowerCase();
    if (rel.includes('mom')) {
      balloonWords = ['Maa', 'Love', 'Warmth', 'Blessings'];
      bouquetMsgs = ['Best Mom Ever 🌸', 'Thank you for everything 💕', 'Your warmth lights home 🏡', 'Always in my heart ❤️', 'Wishing you health & joy ✨', 'Love you endlessly Mom 💐'];
    } else if (rel.includes('dad')) {
      balloonWords = ['Dad', 'Strength', 'Wisdom', 'Hero'];
      bouquetMsgs = ['My guiding light 👔', 'Thank you for your wisdom 💡', 'Proud of you Dad ⭐', 'Always my hero 🦸‍♂️', 'Wishing you peace & health 🌟', 'Love you Dad! ❤️'];
    } else if (rel.includes('girlfriend') || rel.includes('wife')) {
      balloonWords = ['Love', 'Forever', 'Mine', 'Beauty'];
      bouquetMsgs = ['Forever yours 💕', 'You make my world beautiful 🌸', 'Lucky to have you 💖', 'Happy Birthday my love 🎂', 'My favourite person 🥰', 'Sending all my heart ❤️'];
    } else if (rel.includes('boyfriend') || rel.includes('husband')) {
      balloonWords = ['Love', 'Forever', 'Handsome', 'Joy'];
      bouquetMsgs = ['My whole heart 💙', 'You make every day brighter ☀️', 'Lucky to walk beside you 🥂', 'Happy Birthday my love 🎂', 'My safest place 🤗', 'Forever & always ❤️'];
    } else if (rel.includes('brother')) {
      balloonWords = ['Bro', 'Legend', 'Chaos', 'Champ'];
      bouquetMsgs = ['Best bro ever 💪', 'Partner in crime 🚀', 'Always have your back 🤝', 'Keep crushing it 🔥', 'Stop stealing my stuff 😂', 'Happy Birthday Bro! 🎉'];
    } else if (rel.includes('sister')) {
      balloonWords = ['Sister', 'Sparkle', 'Queen', 'Sweet'];
      bouquetMsgs = ['Best sister ever 💝', 'Keep shining bright ✨', 'Built-in best friend 👯‍♀️', 'Always cheering for you 📣', 'Sweetest memories 🌸', 'Happy Birthday! 🎂'];
    } else if (rel.includes('friend')) {
      balloonWords = ['Bestie', 'Laughs', 'Vibes', 'Memories'];
      bouquetMsgs = ['Ride or die 🤗', 'To wild memories 🥂', 'Unstoppable team 🚀', 'Stay awesome 🌟', 'Forever friends 💕', 'Happy Birthday Bestie! 🎉'];
    }
  }

  const fields = {
    'just-because': { small_detail: short('I keep thinking about', 0) },
    'things-i-never-said': { unsaid: [`I notice how you make life lighter.`, `I am grateful for your quiet kindness.`, `You matter to me more than I say.`], memory: short('I still smile when I remember', 1) },
    'i-miss-you': { from_location: 'my side of the world', to_location: 'yours', missed_things: ['your laugh', 'our easy conversations', 'the way you understand me', 'our little routines', 'being around you'], favorite_memory: short('My favourite memory is', 1) },
    'open-when': { envelopes: [{ title: 'you need a smile', message: `Remember ${context}. You always make the world brighter.` }, { title: 'you miss me', message: `Distance cannot change what you mean to me, ${name}.` }, { title: 'you feel alone', message: `You do not have to carry everything by yourself. I am here.` }, { title: 'you need courage', message: `You have handled hard things before. I believe in you completely.` }] },
    'emotional-apology': { what_happened: `I have been thinking about ${context} and the way I hurt you.`, regrets: ['I regret not listening with enough care.', 'I regret making you feel unseen.', 'I regret the pain my actions caused.'], promise: 'I will listen, take responsibility, and earn back your trust through my actions.' },
    'youre-my-person': { reasons: ['You make ordinary moments feel special.', 'You understand me without a long explanation.', 'You make me laugh when I need it most.', 'You show up with a kind heart.', 'Life feels more like home with you in it.'], memories: [short('I love remembering', 1), short('Another moment I hold close is', 2)], inside_joke: `Only we would understand ${context}.` },
    sorry: { promise_1: 'I will listen before I react.', promise_2: 'I will make space for your feelings.', promise_3: 'I will show you through my actions that I can do better.' },
    friendship: { sender_name: 'Your friend', vibe: tone === 'funny' ? 'funny' : 'emotional', years_known: '5', one_liner: `Built on ${context}.`, bond_traits: 'Loyal, Funny, Unforgettable' },
    birthday: {
      sender_name: relationship ? `Your ${relationship}` : 'Someone who loves you',
      balloon_word_1: balloonWords[0],
      balloon_word_2: balloonWords[1],
      balloon_word_3: balloonWords[2],
      balloon_word_4: balloonWords[3],
      bouquet_msg_1: bouquetMsgs[0],
      bouquet_msg_2: bouquetMsgs[1],
      bouquet_msg_3: bouquetMsgs[2],
      bouquet_msg_4: bouquetMsgs[3],
      bouquet_msg_5: bouquetMsgs[4],
      bouquet_msg_6: bouquetMsgs[5],
    },
    'birthday-surprise': {
      sender_name: relationship ? `Your ${relationship}` : 'Someone who loves you',
      balloon_word_1: balloonWords[0],
      balloon_word_2: balloonWords[1],
      balloon_word_3: balloonWords[2],
      balloon_word_4: balloonWords[3],
      bouquet_msg_1: bouquetMsgs[0],
      bouquet_msg_2: bouquetMsgs[1],
      bouquet_msg_3: bouquetMsgs[2],
      bouquet_msg_4: bouquetMsgs[3],
      bouquet_msg_5: bouquetMsgs[4],
      bouquet_msg_6: bouquetMsgs[5],
    },
    anniversary: { special_date: 'Our special day', promise_1: 'More laughter together.', promise_2: 'More patience and care.', promise_3: 'More beautiful memories.', promise_4: 'To choose you every day.', promise_5: 'To keep growing together.' },
    'mothers-day': { mom_title: 'Mom', relation: 'your child', secret_note: `Thank you for ${context}.`, sticky_note_1: 'Your hugs', sticky_note_2: 'Your strength', sticky_note_3: 'Your endless love' },
    proposal: { date_idea: `A little date inspired by ${context}.` },
    puzzle: { hidden_message: `The real surprise is how much you mean to me. ${context}.` },
    'wedding-invitation': { bride_name: 'Priya', groom_name: 'Arjun', venue: 'A place filled with love', venue_map_url: '', event_1_name: 'Mehndi', event_1_time: '6:00 PM', event_2_name: 'Sangeet', event_2_time: '7:00 PM', event_3_name: 'Wedding', event_3_time: '8:00 PM' },
  };
  const resolvedId = TEMPLATE_ALIAS[templateId] || templateId;
  return { message, details: fields[resolvedId] || fields[templateId] || {} };
}

// ─── Route Handler ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const {
      templateId,
      recipientName,
      tone = 'romantic',
      keywords = '',
      aiContext = '',
      mode = 'generate',
      currentMessage = '',
      relationship = '',
    } = await request.json();

    const name = recipientName?.trim() || 'my special someone';
    const finalKeywords = (keywords || aiContext || '').trim();

    if (mode === 'fill_template' || mode === 'emotional-template') {
      const fill = buildTemplateFill(templateId, name, tone, finalKeywords, relationship);
      return NextResponse.json({ success: true, ...fill, source: 'ai_template_engine' });
    }
    const hfToken =
      process.env.HUGGINGFACE_API_KEY ||
      process.env.HF_TOKEN ||
      process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    const model =
      process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.2-3B-Instruct';

    let generatedOptions = [];

    // ── Attempt HuggingFace API if token is present ──────────────────────
    if (hfToken) {
      try {
        const prompt = buildHFPrompt(templateId, name, tone, keywords, mode, currentMessage, relationship);

        const hfRes = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${hfToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_new_tokens: 300,
                temperature: 0.78,
                top_p: 0.92,
                repetition_penalty: 1.15,
                return_full_text: false,
              },
            }),
          }
        );

        if (hfRes.ok) {
          const hfData = await hfRes.json();
          let text = '';
          if (Array.isArray(hfData) && hfData[0]?.generated_text) {
            text = hfData[0].generated_text.trim();
          } else if (typeof hfData === 'object' && hfData.generated_text) {
            text = hfData.generated_text.trim();
          }
          // Strip leading labels like "Message:" / "Here is:"
          text = text.replace(/^(here is[^:]*:|message:|enhanced message:|response:)\s*/i, '').trim();
          if (text) generatedOptions.push(text);
        }
      } catch (err) {
        console.warn('HuggingFace API fallback triggered:', err?.message);
      }
    }

    // ── Fill remaining slots with template-aware fallback messages ────────
    const fallbackMessages = getFallbackMessages(templateId, tone, name, keywords, relationship);
    while (generatedOptions.length < 3) {
      const idx = generatedOptions.length % fallbackMessages.length;
      generatedOptions.push(fallbackMessages[idx]);
    }

    return NextResponse.json({
      success: true,
      options: generatedOptions.slice(0, 3),
      source: hfToken ? 'huggingface_hybrid' : 'ai_template_engine',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'AI message generation failed.' },
      { status: 500 }
    );
  }
}
