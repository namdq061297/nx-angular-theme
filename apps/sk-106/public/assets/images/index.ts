export const IMAGES = {
  multi_card: '/assets/images/multi_card.jpg',
  login_bg: '/assets/images/login_bg.png',
} as const;

export type ImageName = keyof typeof IMAGES;
