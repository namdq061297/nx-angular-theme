export const ICONS = {
  ic_back: '/assets/icons/ic_back.svg',
  ic_vcb: '/assets/icons/logo_vcb.svg',
  ic_refresh: '/assets/icons/ic_refresh.svg',
} as const;

export type IconName = keyof typeof ICONS;
