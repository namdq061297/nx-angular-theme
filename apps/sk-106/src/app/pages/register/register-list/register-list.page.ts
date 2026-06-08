import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import 'iconify-icon';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CATEGORIES, RECORDS } from '../mock/mock-register';
import type { CategoryKey, RegisterStatus } from '../types/register-types';

@Component({
  selector: 'app-register-list-page',
  standalone: true,
  imports: [TextInputComponent, ButtonComponent, IconComponent],
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
