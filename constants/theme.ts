import { HeatLevel, Category } from '@/types';
import { HEAT_COLORS } from './heatLevels';
import { CATEGORY_COLORS } from './categories';

export const THEME = {
  colors: {
    background: '#000000',
    surface: '#1A1A1A',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      muted: '#888888',
    },
    flame: HEAT_COLORS,
    category: CATEGORY_COLORS,
    umass: {
      maroon: '#881C1C',
      gray: '#75787B',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
      xxxl: 48,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export function getHeatGradient(heatLevel: HeatLevel): string[] {
  const gradients: Record<HeatLevel, string[]> = {
    mild: ['#FFB84D', '#FFA84D'],
    hot: ['#FF8C42', '#FF7C32'],
    spicy: ['#FF6B35', '#FF5B25'],
    chaotic: ['#FF4D1C', '#FF3D0C'],
    inferno: ['#FF2E2E', '#FF0000', '#FF2E2E'],
  };
  return gradients[heatLevel];
}

export function getCategoryGradient(category: Category): string[] {
  const color = CATEGORY_COLORS[category];
  return [color, `${color}CC`];
}

