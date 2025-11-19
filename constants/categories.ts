import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  'dining',
  'dorms',
  'majors',
  'professors',
  'greek',
  'dating',
  'overheard',
  'roommates',
  'chaos',
];

export const CATEGORY_LABELS: Record<Category, string> = {
  dining: 'Dining Hall',
  dorms: 'Dorms',
  majors: 'Majors',
  professors: 'Professors',
  greek: 'Greek Life',
  dating: 'Dating',
  overheard: 'Overheard',
  roommates: 'Roommates',
  chaos: 'Chaos',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  dining: '#FF6B35',
  dorms: '#FF8C42',
  majors: '#FFB84D',
  professors: '#FF4D1C',
  greek: '#FF2E2E',
  dating: '#FF6B9D',
  overheard: '#FFB84D',
  roommates: '#FF8C42',
  chaos: '#FF2E2E',
};

