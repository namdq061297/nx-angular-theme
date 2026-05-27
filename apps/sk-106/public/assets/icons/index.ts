export const ICONS = {
  ic_back: '/assets/icons/ic_back.svg',
  ic_vcb: '/assets/icons/logo_vcb.svg',
  ic_refresh: '/assets/icons/ic_refresh.svg',
  ic_logo_full: '/assets/icons/logo_full.svg',
  ic_verify: '/assets/icons/ic_verify.svg',
  ic_loan: '/assets/icons/ic_loan.svg',
  ic_healthcare: '/assets/icons/ic_healthcare.svg',
  ic_credit_card: '/assets/icons/ic_credit_card.svg',
  ic_debit_card: '/assets/icons/ic_debit_card.svg',
  ic_check_circle_fill: '/assets/icons/ic_check_circle_fill.svg',
  ic_check_fill_success: '/assets/icons/ic_check_fill_success.svg',
  ic_connector: '/assets/icons/ic_connector.svg',
  ic_empty_list: '/assets/icons/ic_empty_list.svg',
  ic_select_service: '/assets/icons/ic_select_service.svg',
  ic_user_info: '/assets/icons/ic_user_info.svg',
  ic_calendar: '/assets/icons/ic_calendar.svg',
} as const;

export type IconName = keyof typeof ICONS;
