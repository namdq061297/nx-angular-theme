import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import 'iconify-icon';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CATEGORIES, RECORDS } from '../mock/mock-register';
import type { CategoryKey, RegisterStatus } from '../types/register-types';
import { AuthService, RegisterService } from '../../../core/services/api';
import { DOCUMENT_PROCESS_STATUS, type Document } from '../../../core/models/register.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-register-list-page',
  standalone: true,
  imports: [TextInputComponent, ButtonComponent, IconComponent, DatePipe],
  templateUrl: './register-list.page.html',
  styleUrl: './register-list.page.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterListPage {
  protected readonly categories = CATEGORIES;
  protected readonly selectedCategory = signal<CategoryKey>('all');
  protected readonly listDocuments = signal<Document[]>([]);
  protected readonly keyword = signal('');
  protected readonly isLoadingProfile = signal(false);
  private readonly registerService = inject(RegisterService);

  ngOnInit(): void {
    this.loadDocuments();
  }

  protected loadDocuments(): void {
    this.isLoadingProfile.set(true);

    this.registerService
      .getListDocument({ serviceId: 1, custId: '', phoneNumber: '' }, 'success')
      .subscribe({
        next: (response) => {
          console.log('res', response);
          if (response.data?.length) {
            this.listDocuments.set(response.data);
          }
          this.isLoadingProfile.set(false);
        },
        error: () => {
          this.isLoadingProfile.set(false);
        },
      });
  }

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

  protected getStatusClass(status: DOCUMENT_PROCESS_STATUS): string {
    switch (status) {
      case DOCUMENT_PROCESS_STATUS.PENDING:
        return 'status--received';
      case DOCUMENT_PROCESS_STATUS.REJECT:
        return 'status--rejected';
      case DOCUMENT_PROCESS_STATUS.PROCESS:
        return 'status--draft';
      case DOCUMENT_PROCESS_STATUS.SUCCESS:
        return 'status--approved';
      case DOCUMENT_PROCESS_STATUS.CANCELLATION:
        return 'status--cancelled';
      case DOCUMENT_PROCESS_STATUS.NOT_APPLICABLE:
        return 'status--expired';
      default:
        return '';
    }
  }

  protected getStatusLabel(status: DOCUMENT_PROCESS_STATUS): string {
    switch (status) {
      case DOCUMENT_PROCESS_STATUS.PENDING:
        return 'Đã tiếp nhận';
      case DOCUMENT_PROCESS_STATUS.REJECT:
        return 'Từ chối giao dịch';
      case DOCUMENT_PROCESS_STATUS.PROCESS:
        return 'Đang khai báo';
      case DOCUMENT_PROCESS_STATUS.SUCCESS:
        return 'Đồng ý giao dịch';
      case DOCUMENT_PROCESS_STATUS.CANCELLATION:
        return 'Đã huỷ';
      case DOCUMENT_PROCESS_STATUS.NOT_APPLICABLE:
        return 'Hết hạn đăng ký';
      default:
        return '';
    }
  }
}
