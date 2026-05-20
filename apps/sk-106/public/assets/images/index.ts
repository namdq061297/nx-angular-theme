export const IMAGES = {
  multi_card: '/assets/images/multi_card.jpg',
} as const;

export type ImageName = keyof typeof IMAGES;
