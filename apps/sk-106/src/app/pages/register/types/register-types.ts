import type { IconName } from "@icons";

export type RegisterStepKey = 'products' | 'contact' | 'schedule' | 'confirm';

export interface RegisterStep {
  key: RegisterStepKey;
  label: string;
  icon: IconName;
}

export interface RegisterProduct {
  key: string;
  label: string;
  description?: string;
}


export type CategoryKey = 'all' | 'credit' | 'debit' | 'loan' | 'insurance' | 'investment';

export type RegisterStatus =
  | 'Đã tiếp nhận'
  | 'Từ chối giao dịch'
  | 'Đang khai báo'
  | 'Đồng ý giao dịch'
  | 'Đã huỷ'
  | 'Hết hạn đăng ký';

export interface CategoryItem {
  key: CategoryKey;
  label: string;
  id: number;
}

export interface RegisterRecord {
  id: string;
  branch: string;
  timeSlot: string;
  registerTime: string;
  status: RegisterStatus;
  products: CategoryKey[];
}
