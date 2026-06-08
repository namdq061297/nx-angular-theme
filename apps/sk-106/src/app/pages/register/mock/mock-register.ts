import type { CategoryItem, RegisterProduct, RegisterRecord, RegisterStep } from "../types/register-types";

export const REGISTER_STEPS: RegisterStep[] = [
  { key: 'products', label: 'Sản phẩm dịch vụ', icon: 'ic_select_service' },
  { key: 'contact', label: 'Thông tin', icon: 'ic_user_info' },
  { key: 'schedule', label: 'Lịch hẹn', icon: 'ic_calendar' },
  { key: 'confirm', label: 'Xác nhận', icon: 'ic_verify' },
];

export const REGISTER_PRODUCTS: RegisterProduct[] = [
  {
    key: 'credit',
    label: 'Thẻ tín dụng',
    description: 'Thẻ tín dụng là công cụ cho phép bạn chi tiêu trước, thanh toán sau trong hạn mức được cấp',
  },
  {
    key: 'debit',
    label: 'Thẻ ghi nợ',
    description: 'Thẻ ghi nợ cho phép bạn chi tiêu trực tiếp từ số tiền có sẵn trong tài khoản',
  },
  {
    key: 'loan',
    label: 'Vay',
    description: '',
    // description: 'Giải pháp vay tiêu dùng hoặc vay phục vụ kế hoạch tài chính cá nhân.',
  },
  {
    key: 'insurance',
    label: 'Bảo hiểm',
    description: '',
    // description: 'Bảo vệ tài chính với các gói bảo hiểm sức khỏe và nhân thọ.',
  },
  {
    key: 'investment',
    label: 'Đầu tư',
    description: '',
    // description: 'Đầu tư tích lũy với các sản phẩm quỹ và kênh đầu tư linh hoạt.',
  },
];

export const CATEGORIES: CategoryItem[] = [
  { key: 'all', label: 'Tất cả dịch vụ' },
  { key: 'credit', label: 'Thẻ tín dụng' },
  { key: 'debit', label: 'Thẻ ghi nợ' },
  { key: 'loan', label: 'Vay' },
  { key: 'insurance', label: 'Bảo hiểm' },
  { key: 'investment', label: 'Đầu tư' },
];

export const RECORDS: RegisterRecord[] = [
  {
    id: '241015JEQD7X',
    branch: 'Ba Dinh - Trụ sở chi nhánh',
    timeSlot: '19:30 - 20:00, 21:00 - 22:00  Ngày: 20/11/2024',
    registerTime: '04/11/2022 16:33',
    status: 'Đã tiếp nhận',
    products: ['credit', 'debit', 'loan', 'insurance'],
  },
  {
    id: '241015JEQD7Y',
    branch: 'Ba Dinh - Trụ sở chi nhánh',
    timeSlot: '19:30 - 20:00, 21:00 - 22:00  Ngày: 20/11/2024',
    registerTime: '03/11/2022 16:33',
    status: 'Từ chối giao dịch',
    products: ['credit', 'debit', 'loan', 'insurance'],
  },
  {
    id: '241015JEQD7Z',
    branch: 'Ba Dinh - Trụ sở chi nhánh',
    timeSlot: '19:30 - 20:00, 21:00 - 22:00  Ngày: 20/11/2024',
    registerTime: '01/11/2022 16:33',
    status: 'Đang khai báo',
    products: ['credit', 'debit', 'loan', 'insurance'],
  },
  {
    id: '241015JEQD7P',
    branch: 'Ba Dinh - Trụ sở chi nhánh',
    timeSlot: '19:30 - 20:00, 21:00 - 22:00  Ngày: 20/11/2024',
    registerTime: '30/10/2022 16:33',
    status: 'Đồng ý giao dịch',
    products: ['credit', 'debit', 'loan'],
  },
  {
    id: '241015JEQD7M',
    branch: 'Ba Dinh - Trụ sở chi nhánh',
    timeSlot: '19:30 - 20:00, 21:00 - 22:00  Ngày: 20/11/2024',
    registerTime: '04/11/2021 16:33',
    status: 'Đã huỷ',
    products: ['debit', 'loan', 'insurance'],
  },
  {
    id: '241015JEQD7N',
    branch: 'Ba Dinh - Trụ sở chi nhánh',
    timeSlot: '19:30 - 20:00, 21:00 - 22:00  Ngày: 20/11/2024',
    registerTime: '03/11/2020 16:33',
    status: 'Hết hạn đăng ký',
    products: ['insurance', 'investment'],
  },
];