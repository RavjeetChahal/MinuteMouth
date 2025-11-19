import { HeatLevel } from '@/types';

export const HEAT_LEVELS: HeatLevel[] = ['mild', 'hot', 'spicy', 'chaotic', 'inferno'];

export const HEAT_THRESHOLDS: Record<HeatLevel, number> = {
  mild: 0,
  hot: 6,
  spicy: 16,
  chaotic: 31,
  inferno: 60,
};

export const HEAT_COLORS: Record<HeatLevel, string> = {
  mild: '#FFB84D',
  hot: '#FF8C42',
  spicy: '#FF6B35',
  chaotic: '#FF4D1C',
  inferno: '#FF2E2E',
};

export function calculateHeatLevel(flames: number, superFlames: number): HeatLevel {
  const score = flames + (superFlames * 3);
  
  if (score >= 60) return 'inferno';
  if (score >= 31) return 'chaotic';
  if (score >= 16) return 'spicy';
  if (score >= 6) return 'hot';
  return 'mild';
}

