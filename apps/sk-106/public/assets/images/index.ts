export const IMAGES = {
  credit_card_bg: '/assets/images/credit_card_bg.png',
  debit_card_bg: '/assets/images/debit_card_bg.png',
  insurance_bg: '/assets/images/insurance_bg.png',
  loan_bg: '/assets/images/loan_bg.png',
  invest_bg: '/assets/images/invest_bg.png',
  login_bg: '/assets/images/login_bg.png',
} as const;

export type ImageName = keyof typeof IMAGES;
