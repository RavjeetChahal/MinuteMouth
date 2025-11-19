#!/usr/bin/env node
/**
 * Seed prompts into Supabase database
 * 
 * Usage:
 *   node scripts/seed-prompts.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import prompts from the constants file
const PROMPTS_BY_CATEGORY = {
  'dining-halls': [
    { text: "What's the most creative thing you've made from dining hall ingredients?", chaos_level: 'mild' },
    { text: "Rank the dining halls by how likely you'd survive a zombie apocalypse there", chaos_level: 'hot' },
    { text: "What dining hall food combo would you feed to your worst enemy?", chaos_level: 'chaotic' },
    { text: "Write a horror story in 3 words about Worcester dining hall", chaos_level: 'hot' },
    { text: "What's your most unhinged 2am cravings from the dining halls?", chaos_level: 'spicy' },
  ],
  'dorms': [
    { text: "What's the weirdest thing you've seen in a dorm hallway at 3am?", chaos_level: 'spicy' },
    { text: "Which dorm is most likely to be haunted and why?", chaos_level: 'hot' },
    { text: "What's your worst dorm roommate horror story?", chaos_level: 'inferno' },
    { text: "Describe your dorm's smell in 3 words", chaos_level: 'mild' },
    { text: "What's the most cursed dorm on campus?", chaos_level: 'chaotic' },
  ],
  'social-life': [
    { text: "What's the most embarrassing thing that happened to you at a party?", chaos_level: 'inferno' },
    { text: "Rate your social life on campus: 1-10", chaos_level: 'mild' },
    { text: "What's your go-to excuse for getting out of plans?", chaos_level: 'hot' },
    { text: "Best place on campus for a first date?", chaos_level: 'mild' },
    { text: "Most awkward run-in with someone you ghosted?", chaos_level: 'spicy' },
  ],
  'classes': [
    { text: "What's the easiest A you've ever gotten?", chaos_level: 'hot' },
    { text: "Which professor should have their own reality TV show?", chaos_level: 'spicy' },
    { text: "Most creative excuse for missing an exam?", chaos_level: 'chaotic' },
    { text: "What class do you sleep through every time?", chaos_level: 'mild' },
    { text: "Worst group project experience ever?", chaos_level: 'inferno' },
  ],
  'campus-events': [
    { text: "What campus event is the most overrated?", chaos_level: 'hot' },
    { text: "Best free food event you've been to?", chaos_level: 'mild' },
    { text: "Most chaotic campus event you've witnessed?", chaos_level: 'chaotic' },
    { text: "Should UMass bring back [insert defunct event]?", chaos_level: 'mild' },
    { text: "What event do you wish UMass would create?", chaos_level: 'hot' },
  ],
  'party-scene': [
    { text: "Frats, off-campus, or staying in?", chaos_level: 'mild' },
    { text: "Most legendary party story you've heard?", chaos_level: 'inferno' },
    { text: "What's your party outfit go-to?", chaos_level: 'mild' },
    { text: "Worst party you've ever been to?", chaos_level: 'chaotic' },
    { text: "Best excuse for leaving a party early?", chaos_level: 'hot' },
  ],
  'campus-opinions': [
    { text: "Hot take: UMass is underrated/overrated?", chaos_level: 'hot' },
    { text: "Should the ILC be renamed? To what?", chaos_level: 'mild' },
    { text: "What's one thing UMass needs to change immediately?", chaos_level: 'spicy' },
    { text: "Best building on campus and why?", chaos_level: 'mild' },
    { text: "Most controversial opinion about UMass you have?", chaos_level: 'chaotic' },
  ],
  'random-chaos': [
    { text: "If you could only eat one campus food for the rest of the semester?", chaos_level: 'hot' },
    { text: "Would you rather fight 100 duck-sized horses or 1 horse-sized duck on campus?", chaos_level: 'chaotic' },
    { text: "What's your most unhinged UMass hot take?", chaos_level: 'inferno' },
    { text: "If UMass was a person, what would their personality be?", chaos_level: 'spicy' },
    { text: "Describe your UMass experience using only emojis", chaos_level: 'mild' },
  ],
  'confessions': [
    { text: "Admit something you've never told anyone about UMass", chaos_level: 'inferno' },
    { text: "What's your secret study spot that you'll never reveal?", chaos_level: 'hot' },
    { text: "Worst decision you made freshman year?", chaos_level: 'chaotic' },
    { text: "Something you did that you still cringe about?", chaos_level: 'spicy' },
    { text: "Confession: I've never been to [insert popular spot]", chaos_level: 'mild' },
  ],
};

async function seedPrompts() {
  console.log('🌱 Starting prompt seeding...\n');

  let totalSeeded = 0;

  for (const [category, prompts] of Object.entries(PROMPTS_BY_CATEGORY)) {
    console.log(`📝 Seeding ${prompts.length} prompts for category: ${category}`);

    const promptsToInsert = prompts.map(prompt => ({
      text: prompt.text,
      category: category,
      chaos_level: prompt.chaos_level === 'mild' ? 1 : 
                   prompt.chaos_level === 'hot' ? 2 :
                   prompt.chaos_level === 'spicy' ? 3 :
                   prompt.chaos_level === 'chaotic' ? 4 : 5,
      dynamic_tags: { category: category, level: prompt.chaos_level },
    }));

    const { data, error } = await supabase
      .from('prompts')
      .insert(promptsToInsert);

    if (error) {
      console.error(`❌ Error seeding ${category}:`, error.message);
    } else {
      console.log(`✅ Seeded ${prompts.length} prompts for ${category}`);
      totalSeeded += prompts.length;
    }
  }

  console.log(`\n🎉 Seeding complete! Total prompts seeded: ${totalSeeded}`);
  process.exit(0);
}

seedPrompts().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
