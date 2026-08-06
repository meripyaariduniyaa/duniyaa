import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { templateId, recipientName, tone = 'romantic', keywords = '', mode = 'generate', currentMessage = '' } = await request.json();

    const name = recipientName || 'my special someone';
    const hfToken = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    const model = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.2-3B-Instruct';

    let generatedOptions = [];

    // Attempt Hugging Face API call if HF_TOKEN is present
    if (hfToken) {
      try {
        const prompt = mode === 'enhance'
          ? `Rewrite and enhance this greeting message for ${name} to be more ${tone} and emotionally touching. Message: "${currentMessage}". Keywords: ${keywords}. Return only the enhanced message.`
          : `Write a beautiful, personalized ${tone} message for ${name} for a ${templateId} greeting note. Keywords/memories: ${keywords}. Keep it heartfelt, under 120 words with sweet emojis.`;

        const hfRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 250, temperature: 0.7, return_full_text: false }
          })
        });

        if (hfRes.ok) {
          const hfData = await hfRes.json();
          let text = '';
          if (Array.isArray(hfData) && hfData[0]?.generated_text) {
            text = hfData[0].generated_text.trim();
          } else if (typeof hfData === 'object' && hfData.generated_text) {
            text = hfData.generated_text.trim();
          }

          if (text) {
            generatedOptions.push(text);
          }
        }
      } catch (err) {
        console.warn('Hugging Face API call fallback trigger:', err?.message);
      }
    }

    // High quality template-aware generative engine fallback / generator
    const fallbackEngine = {
      sorry: {
        romantic: [
          `Dearest ${name}, I know I messed up and said things out of anger. You mean everything to me, and my heart breaks knowing I hurt you. I promise to listen better, cherish you more, and make things right. Please forgive me? 💕`,
          `To my favorite person ${name}, I'm truly sorry from the bottom of my heart. ${keywords ? `Remembering ${keywords} reminds me of how precious we are. ` : ''}I never want to see you upset. Let's start fresh and make new happy memories together. 💖`,
          `Hey ${name}, I'm so deeply sorry for my mistake. You bring so much joy into my life, and losing your smile is the worst feeling. I promise to do better every single day. Forgive me? 🥺`
        ],
        funny: [
          `Dear ${name}, I am 100% guilty, 0% innocent, and 1000% sorry! I promise to buy your favorite food and obey all your orders for a whole week if you forgive me! 🍕🎁`,
          `Warning: Extra cute apology incoming for ${name}! I messed up big time, but I promise to be on my best behavior forever. Please release me from the doghouse? 🐶❤️`,
          `Hey ${name}, I'm so sorry! I'll do 100 pushups, give you endless hugs, and never argue again. Can we be sweet again? 🥺💕`
        ],
        sincere: [
          `Dear ${name}, I am taking full responsibility for what happened. You deserve so much patience, love, and respect. ${keywords ? `Thinking about ${keywords}, ` : ''}I value our bond more than anything else. Thank you for your grace. 🙏`,
          `To ${name}, I am truly sorry. I've spent time reflecting on my actions and I want to apologize sincerely. I will work hard to rebuild your trust step by step. ❤️`,
          `Dearest ${name}, my apology comes from a very deep and honest place. You are essential to my happiness, and I promise to handle your heart with absolute care. 💕`
        ]
      },
      'birthday-surprise': {
        romantic: [
          `Happy Birthday to the love of my life, ${name}! 🎉🎂 You make every single day feel like a magical celebration. ${keywords ? `Celebrating ${keywords} with you is my ultimate joy. ` : ''}May this year bring you endless happiness, health, and all your heart's desires! ❤️✨`,
          `Wishing the happiest birthday to my favorite person, ${name}! 🎂✨ Blow out the candles and know that I'll be right here making every single one of your wishes come true. Yours always 💕`,
          `To my darling ${name}, happy birthday! You grow more gorgeous and incredible with every passing year. Here's to another year of shared dreams, long talks, and infinite love! 🎁🥂`
        ],
        funny: [
          `Happy Birthday ${name}! 🎂🎉 Don't worry about getting older — you're like fine wine, or sharp cheese, or a classic video game! Let's eat way too much cake today! 🍰🥂`,
          `Happy Birthday to my partner-in-crime ${name}! 🎈 Another year of surviving my jokes and stealing my food. You deserve a trophy! Have the most awesome day! 🎉`,
          `To ${name}: Happy Birthday! You're officially old enough to know better, but still young enough to do it anyway! Let's party! 🥳🎂`
        ],
        sincere: [
          `Dearest ${name}, wishing you a joyful and blessed birthday. Thank you for bringing light, wisdom, and warmth into the lives of everyone around you. Have a wonderful year ahead! 💐✨`,
          `Happy Birthday ${name}! ${keywords ? `Reflecting on ${keywords}, ` : ''}I am so grateful for your presence in my life. Wishing you boundless success, peace, and love today and always. 🎉`,
          `Warmest birthday wishes to you, ${name}! May your day be filled with warm laughter, sweet moments, and surrounded by everyone who loves you. 🎂🎁`
        ]
      },
      'love-letter': {
        romantic: [
          `My love ${name}, every single day with you feels like a dream I never want to wake up from. ${keywords ? `Whenever I think of ${keywords}, ` : ''}my heart overflows with gratitude. You are my home, my joy, and my forever. ❤️`,
          `Dearest ${name}, writing this letter is easy because my heart is so full of you. Your smile brightens my darkest days and your kindness inspires me. I love you more than words can express. 💌🌹`,
          `To ${name}, you are the missing piece I never knew I was looking for. Thank you for loving me, holding me, and making life extraordinary. Always yours. 💕`
        ],
        poetic: [
          `Like stars that navigate the night, your love guides me home ${name}. ${keywords ? `In the quiet beauty of ${keywords}, ` : ''}I see forever in your eyes. Yours, yesterday, today, and for eternity. 🌹✨`,
          `My dearest ${name}, if I had a flower for every time I thought of you, I could walk through my garden forever. You are the heart of my world. 🌿💖`,
          `To ${name}: In a world of fleeting moments, my love for you is timeless and constant. Thank you for being my sanctuary and my light. 🕯️✨`
        ]
      },
      'letter-for-mom': {
        sincere: [
          `Dearest Ma (${name}), thank you for every meal cooked with love, every warm hug, every sacrifice, and your endless patience. ${keywords ? `Remembering ${keywords} fills my heart with joy. ` : ''}You are the strongest, sweetest person in the world! 💐❤️`,
          `To the best Mom ever, ${name}! Thank you for believing in me even when I doubted myself. Your unconditional love is the greatest gift of my life. I love you so much, Ma! 🌸💕`,
          `Dear Mom (${name}), one thing I never tell you often enough is how much I admire you. Thank you for making our home a sanctuary of love. Wishing you peace and happiness always! 🌷✨`
        ]
      },
      'be-my-valentine': {
        romantic: [
          `Hey ${name}! You bring magic, smiles, and butterflies into my life every single day. ${keywords ? `Thinking about ${keywords} makes me grin like crazy! ` : ''}Will you do me the honor of being my Valentine? 💕🌹`,
          `To the cutest person I know (${name}), my heart skips a beat whenever you walk into the room. Let me make this Valentine's Day unforgettable for you! Say YES? 💖✨`
        ],
        funny: [
          `Hey ${name}! I promise unlimited snacks, your favorite boba/coffee, and control of the TV remote if you say YES! Will you be my Valentine? 🍕☕💕`,
          `Dear ${name}, the "NO" button on this card is totally broken anyway, so you have no choice! Will you be my Valentine? 😉💖`
        ]
      },
      'wedding-invitation': {
        sincere: [
          `We cordially invite you ${name} to join us as we celebrate our sacred union of love, laughter, and togetherness. ${keywords ? `Event details: ${keywords}. ` : ''}Your presence will make our big day truly blessed! 💒🪔`,
          `Save the date ${name}! Join us as we take our wedding vows under the stars. We cannot wait to celebrate this new beginning with you! ✨💍`
        ]
      },
      'surprise-reveal-box': {
        funny: [
          `Surprise ${name}! Unbox each layer to reveal what's waiting inside just for you! ${keywords ? `Hint: ${keywords}. ` : ''}Tap the box and untie the ribbon! 🎁✨`,
          `Hey ${name}, behind every bow lies a special secret memory. Get ready for a major explosion of love and surprises! 🎉🎁`
        ]
      },
      'a-rose-for-someone-special': {
        poetic: [
          `Like a rose blooming under moonlight, my feelings for you ${name} grow deeper with every passing moment. ${keywords ? `Dedicated with love for ${keywords}. ` : ''}Dedicated to you with all my heart. 🌹✨`,
          `This virtual rose will never wither, just like my love and admiration for you ${name}. Dedicated to the person who fills my world with warmth and light. ❤️🌹`
        ]
      }
    };

    const templateEngine = fallbackEngine[templateId] || fallbackEngine['sorry'];
    const toneList = templateEngine[tone] || templateEngine['romantic'] || templateEngine['sincere'] || Object.values(templateEngine)[0];

    // Ensure we provide 3 options
    while (generatedOptions.length < 3) {
      const idx = generatedOptions.length % toneList.length;
      generatedOptions.push(toneList[idx]);
    }

    return NextResponse.json({
      success: true,
      options: generatedOptions.slice(0, 3),
      source: hfToken ? 'huggingface_hybrid' : 'ai_template_engine'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'AI message generation failed.' }, { status: 500 });
  }
}
