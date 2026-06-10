import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { HOME_TAB_COMPONENTS, ProductTabKey } from './home-tab-content.components';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/api/auth.service';
import { RegisterService } from '../../core/services/api/register.service';
import { AuthStateService } from '../../core/services/auth-state.service';

interface TabContent {
  key: ProductTabKey;
  label: string;
  description: string;
}

const TAB_CONTENT: TabContent[] = [
  {
    key: 'credit',
    label: 'Thẻ tín dụng',
    description: 'Các yêu cầu phát hành, nâng hạn mức và tra soát giao dịch thẻ tín dụng.',
  },
  {
    key: 'debit',
    label: 'Thẻ ghi nợ',
    description: 'Theo dõi các yêu cầu mở mới, khóa/mở thẻ và phát hành lại thẻ ghi nợ.',
  },
  {
    key: 'loan',
    label: 'Vay',
    description: 'Danh sách hồ sơ vay tiêu dùng, vay mua nhà và vay kinh doanh.',
  },
  {
    key: 'insurance',
    label: 'Bảo hiểm',
    description: 'Tổng hợp yêu cầu mua mới, tái tục và cập nhật quyền lợi bảo hiểm.',
  },
  {
    key: 'investment',
    label: 'Đầu tư',
    description: 'Các yêu cầu liên quan chứng chỉ quỹ, trái phiếu và sản phẩm đầu tư định kỳ.',
  },
];

@Component({
  selector: 'app-home-page',
  imports: [TextInputComponent, CommonModule, FooterComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly authService = inject(AuthService);
  private readonly registerService = inject(RegisterService);
  private readonly authState = inject(AuthStateService);

  protected readonly tabs = TAB_CONTENT;
  protected readonly activeTab = signal<ProductTabKey>('credit');
  protected readonly searchValue = signal('');
  protected readonly customerProfile = signal<unknown | null>(null);
  protected readonly isLoadingProfile = signal(false);
  protected readonly profileError = signal('');
  protected readonly districts = signal<unknown[]>([]);
  protected readonly isLoadingDistricts = signal(false);
  protected readonly districtsError = signal('');

  protected readonly activeTabContent = computed(() => {
    return this.tabs.find((tab) => tab.key === this.activeTab()) ?? this.tabs[0];
  });

  protected readonly activeTabComponent = computed(() => HOME_TAB_COMPONENTS[this.activeTab()]);
  protected readonly activeTabInputs = computed(() => ({ searchValue: this.searchValue() }));

  ngOnInit(): void {
    this.loadCustomerProfileIfNeeded();
  }

  protected loadCustomerProfileIfNeeded(): void {
    const cachedProfile = this.authState.customerProfile();

    if (cachedProfile) {
      this.customerProfile.set(cachedProfile);
      return;
    }

    this.loadCustomerProfile();
  }

  protected loadCustomerProfile(): void {
    this.isLoadingProfile.set(true);
    this.profileError.set('');

    this.authService.inquiryCustomerProfile().subscribe({
      next: (response) => {
        this.customerProfile.set(response.data);
        this.authState.setCustomerProfile(response.data);
        this.isLoadingProfile.set(false);
      },
      error: () => {
        this.profileError.set('Không gọi được API inquiryCustomerProfile');
        this.isLoadingProfile.set(false);
      },
    });
  }

  protected loadDistricts(): void {
    this.isLoadingDistricts.set(true);
    this.districtsError.set('');

    this.registerService.fetchDistricts(467, 'success').subscribe({
      next: (response) => {
        this.districts.set(response.data);
        this.isLoadingDistricts.set(false);
      },
      error: () => {
        this.districtsError.set('Không gọi được API fetchDistricts');
        this.isLoadingDistricts.set(false);
      },
    });
  }

  protected loadDistrictsError(): void {
    this.isLoadingDistricts.set(true);
    this.districtsError.set('');

    this.registerService.fetchDistricts(467, 'error').subscribe({
      next: (response) => {
        this.districts.set(response.data);
        this.isLoadingDistricts.set(false);
      },
      error: () => {
        this.districtsError.set('Không gọi được API fetchDistricts (case lỗi)');
        this.isLoadingDistricts.set(false);
      },
    });
  }

  protected setActiveTab(tab: ProductTabKey): void {
    this.activeTab.set(tab);
    this.searchValue.set('');
  }

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
  }
}
