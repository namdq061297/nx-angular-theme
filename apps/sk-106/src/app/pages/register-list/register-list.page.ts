import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import 'iconify-icon';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

type CategoryKey = 'all' | 'credit' | 'debit' | 'loan' | 'insurance' | 'investment';

type RegisterStatus =
  | 'Đã tiếp nhận'
  | 'Từ chối giao dịch'
  | 'Đang khai báo'
  | 'Đồng ý giao dịch'
  | 'Đã huỷ'
  | 'Hết hạn đăng ký';

interface CategoryItem {
  key: CategoryKey;
  label: string;
}

interface RegisterRecord {
  id: string;
  branch: string;
  timeSlot: string;
  registerTime: string;
  status: RegisterStatus;
  products: CategoryKey[];
}

const CATEGORIES: CategoryItem[] = [
  { key: 'all', label: 'Tất cả dịch vụ' },
  { key: 'credit', label: 'Thẻ tín dụng' },
  { key: 'debit', label: 'Thẻ ghi nợ' },
  { key: 'loan', label: 'Vay' },
  { key: 'insurance', label: 'Bảo hiểm' },
  { key: 'investment', label: 'Đầu tư' },
];

const RECORDS: RegisterRecord[] = [
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

@Component({
  selector: 'app-register-list-page',
  standalone: true,
  imports: [TextInputComponent, ButtonComponent],
  templateUrl: './register-list.page.html',
  styleUrl: './register-list.page.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterListPage {
  protected readonly categories = CATEGORIES;
  protected readonly selectedCategory = signal<CategoryKey>('all');
  protected readonly keyword = signal('');

  protected readonly totalFilteredCount = computed(() => this.filteredRecords().length);

  protected readonly filteredRecords = computed(() => {
    const selected = this.selectedCategory();
    const normalizedKeyword = this.keyword().trim().toLowerCase();

    return RECORDS.filter((record) => {
      const byCategory = selected === 'all' || record.products.includes(selected);
      if (!byCategory) {
        return false;
      }

      if (!normalizedKeyword) {
        return true;
      }

      return (
        record.id.toLowerCase().includes(normalizedKeyword) ||
        record.branch.toLowerCase().includes(normalizedKeyword)
      );
    });
  });

  protected setCategory(category: CategoryKey): void {
    this.selectedCategory.set(category);
  }

  protected onSearchChange(value: string): void {
    this.keyword.set(value);
  }

  protected getStatusClass(status: RegisterStatus): string {
    switch (status) {
      case 'Đã tiếp nhận':
        return 'status--received';
      case 'Từ chối giao dịch':
        return 'status--rejected';
      case 'Đang khai báo':
        return 'status--draft';
      case 'Đồng ý giao dịch':
        return 'status--approved';
      case 'Đã huỷ':
        return 'status--cancelled';
      case 'Hết hạn đăng ký':
        return 'status--expired';
      default:
        return '';
    }
  }
}
