// Funny adjectives
const ADJECTIVES = [
  'Chubby', 'Sleepy', 'Grumpy', 'Silly', 'Stinky', 'Goofy', 'Wacky', 'Spicy',
  'Crispy', 'Fluffy', 'Squishy', 'Bouncy', 'Sneaky', 'Lazy', 'Dizzy', 'Clumsy',
  'Quirky', 'Zesty', 'Funky', 'Wonky', 'Rowdy', 'Frisky', 'Jolly', 'Perky',
  'Sassy', 'Feisty', 'Salty', 'Crusty', 'Rusty', 'Dusty', 'Musty', 'Frosty',
  'Toasty', 'Roasty', 'Boujee', 'Fancy', 'Basic', 'Chaotic', 'Cringe', 'Based',
  'Toxic', 'Legendary', 'Epic', 'Certified', 'Professional', 'Discount', 'Bootleg'
];

// Funny nouns
const NOUNS = [
  'Bunny', 'Pickle', 'Nugget', 'Muffin', 'Burrito', 'Taco', 'Waffle', 'Pancake',
  'Biscuit', 'Dumpling', 'Potato', 'Noodle', 'Pretzel', 'Bagel', 'Donut', 'Cookie',
  'Goblin', 'Gremlin', 'Gremlin', 'Cryptid', 'Menace', 'Chaos', 'Disaster', 'Rat',
  'Possum', 'Raccoon', 'Hamster', 'Shrimp', 'Walrus', 'Penguin', 'Llama', 'Capybara',
  'Frog', 'Moth', 'Goose', 'Duck', 'Pigeon', 'Seagull', 'Crow', 'Raven',
  'Blob', 'Bean', 'Soup', 'Meme', 'King', 'Queen', 'Lord', 'Wizard',
  'Goblin', 'Deity', 'Entity', 'Demon', 'Angel', 'Ghost', 'Spirit', 'Soul'
];

// Generate random funny username
export function generateRandomAlias(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}

// Pre-generated list for backwards compatibility
export const ALIASES = Array.from({ length: 100 }, () => generateRandomAlias());

