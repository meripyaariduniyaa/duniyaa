export const emotionalTemplateIds = [
  'just-because', 'things-i-never-said', 'i-miss-you', 'open-when', 'emotional-apology', 'youre-my-person'
];

export const emotionalTemplates = [
  { id: 'just-because', title: 'Just Because', icon: '✨', price: 99, description: 'A small, beautiful reminder that they matter.', emotions: ['special', 'loved'], relationships: ['partner', 'friend', 'family', 'someone-special'], photoLimit: 3 },
  { id: 'things-i-never-said', title: 'Things I Never Said', icon: '💌', price: 149, description: 'Turn the words you held back into a gentle reveal.', emotions: ['loved', 'remembered'], relationships: ['partner', 'friend', 'family'], photoLimit: 3 },
  { id: 'i-miss-you', title: 'I Miss You', icon: '🫂', price: 149, description: 'A long-distance memory journey made for one person.', emotions: ['missed', 'remembered'], relationships: ['partner', 'friend', 'family'], photoLimit: 3 },
  { id: 'open-when', title: 'Open When…', icon: '✉️', price: 199, description: 'A collection of letters for every version of them.', emotions: ['loved', 'special'], relationships: ['partner', 'friend', 'family'], photoLimit: 6 },
  { id: 'emotional-apology', title: "I'm Sorry", icon: '🥺', price: 149, description: 'A sincere apology that gives them room to feel.', emotions: ['forgiven'], relationships: ['partner', 'friend', 'family'], photoLimit: 3 },
  { id: 'youre-my-person', title: "You're My Person", icon: '❤️', price: 99, description: 'Celebrate the one person who feels like home.', emotions: ['loved', 'special', 'remembered'], relationships: ['partner', 'friend', 'family'], photoLimit: 5 },
];

export const emotionChoices = [
  { id: 'loved', label: 'Loved', icon: '❤️' }, { id: 'missed', label: 'Missed', icon: '🫂' },
  { id: 'forgiven', label: 'Forgiven', icon: '🥺' }, { id: 'appreciated', label: 'Appreciated', icon: '🙏' },
  { id: 'proud', label: 'Proud', icon: '🌟' }, { id: 'remembered', label: 'Remembered', icon: '💌' },
  { id: 'special', label: 'Special', icon: '✨' }, { id: 'laugh', label: 'Make them laugh', icon: '😂' },
];

export function isEmotionalTemplate(id) { return emotionalTemplateIds.includes(id); }
export function recommendEmotionalTemplates(emotion) {
  const matches = emotionalTemplates.filter((template) => template.emotions.includes(emotion));
  return matches.length ? matches : emotionalTemplates.filter((template) => ['just-because', 'youre-my-person'].includes(template.id));
}
