export type Category = 
  | 'dining' 
  | 'dorms' 
  | 'majors' 
  | 'professors' 
  | 'greek' 
  | 'dating' 
  | 'overheard' 
  | 'roommates' 
  | 'chaos';

export type HeatLevel = 'mild' | 'hot' | 'spicy' | 'chaotic' | 'inferno';

export interface User {
  uuid: string;
  alias: string;
  created_at: string;
  badges: string[];
}

export interface Post {
  id: number;
  user_uuid: string;
  text: string;
  category: Category;
  flames: number;
  super_flames: number;
  heat_level: HeatLevel;
  created_at: string;
}

export interface Prompt {
  id: number;
  text: string;
  category: string;
  chaos_level: number;
  dynamic_tags: Record<string, string>;
}

export interface DailyPrompt {
  date: string;
  prompt_id: number;
}

export interface WeeklyAward {
  week_number: number;
  category: string;
  winner_uuid: string;
  post_id: number;
}

export type FeedTab = 'hot-now' | 'most-unhinged' | 'top-week' | 'rising-stars';

