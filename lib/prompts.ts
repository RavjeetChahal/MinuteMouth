import { supabase } from './supabase';
import { Prompt } from '@/types';

// Prompt categories for weighted selection
const PROMPT_CATEGORIES = [
  'down-bad',
  'roommate',
  'overheard',
  'dining',
  'dorms',
  'majors',
  'dating',
  'pain',
];

// Weighted category selection (down-bad prioritized)
const CATEGORY_WEIGHTS: Record<string, number> = {
  'down-bad': 0.3,
  'roommate': 0.15,
  'overheard': 0.15,
  'dining': 0.1,
  'dorms': 0.1,
  'majors': 0.05,
  'dating': 0.1,
  'pain': 0.05,
};

export function selectWeightedCategory(): string {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    cumulative += weight;
    if (random <= cumulative) {
      return category;
    }
  }
  
  return 'down-bad'; // fallback
}

export async function generateDailyPrompt(): Promise<number | null> {
  // Select weighted category
  const selectedCategory = selectWeightedCategory();
  
  // 70% chance of chaos_level 4-5, 30% chance of 1-3
  const chaosLevel = Math.random() < 0.7 
    ? Math.floor(Math.random() * 2) + 4 // 4 or 5
    : Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
  
  // Fetch prompts matching criteria
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('category', selectedCategory)
    .eq('chaos_level', chaosLevel)
    .limit(100);
  
  if (error || !prompts || prompts.length === 0) {
    // Fallback: get any prompt with high chaos level
    const { data: fallbackPrompts } = await supabase
      .from('prompts')
      .select('*')
      .gte('chaos_level', 4)
      .limit(100);
    
    if (!fallbackPrompts || fallbackPrompts.length === 0) {
      return null;
    }
    
    const selectedPrompt = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
    return selectedPrompt.id;
  }
  
  const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return selectedPrompt.id;
}

export async function getTodayPrompt(): Promise<Prompt | null> {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if prompt exists for today
  const { data: dailyPrompt } = await supabase
    .from('daily_prompt')
    .select('prompt_id')
    .eq('date', today)
    .single();
  
  if (dailyPrompt) {
    const { data: prompt } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', dailyPrompt.prompt_id)
      .single();
    
    return prompt;
  }
  
  // Generate new prompt for today
  const promptId = await generateDailyPrompt();
  
  if (!promptId) {
    return null;
  }
  
  // Save to daily_prompt table
  await supabase
    .from('daily_prompt')
    .insert({
      date: today,
      prompt_id: promptId,
    });
  
  // Fetch and return the prompt
  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .single();
  
  return prompt;
}

export function applyDynamicTags(promptText: string, tags: Record<string, string>): string {
  let result = promptText;
  
  for (const [key, value] of Object.entries(tags)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  
  return result;
}

