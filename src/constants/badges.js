import * as badgeAssets from '../assets/badges';

export const BADGE_TYPES = {
  STREAK_3: 'three_days_streak',
  STREAK_10: 'ten_days_streak',
  STREAK_30: 'thirty_days_streak',
  FIRST_MODULE: 'first_module',
};

export const BADGE_IMAGES = {
  [BADGE_TYPES.STREAK_3]: badgeAssets.streak3,
  [BADGE_TYPES.STREAK_10]: badgeAssets.streak10,
  [BADGE_TYPES.STREAK_30]: badgeAssets.streak30,
  [BADGE_TYPES.FIRST_MODULE]: badgeAssets.firstModule,
};

export const BADGE_LABELS = {
  [BADGE_TYPES.STREAK_3]: '3 Dias Consecutivos',
  [BADGE_TYPES.STREAK_10]: '10 Dias Consecutivos',
  [BADGE_TYPES.STREAK_30]: '30 Dias Consecutivos',
  [BADGE_TYPES.FIRST_MODULE]: 'Primeiro Módulo Concluído',
};
