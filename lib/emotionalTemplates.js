export const emotionalTemplateIds = [
  'emotional-apology'
];

export const emotionalTemplates = [
  { id: 'emotional-apology', title: "I'm Sorry", icon: '🥺', price: 219, description: 'A sincere apology that gives them room to feel.', emotions: ['forgiven'], relationships: ['partner', 'friend', 'family'], photoLimit: 3 },
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
  return matches.length ? matches : emotionalTemplates;
}
