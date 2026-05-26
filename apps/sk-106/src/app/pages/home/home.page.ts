import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HOME_TAB_COMPONENTS, ProductTabKey } from './home-tab-content.components';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

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
  imports: [TextInputComponent, CommonModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly tabs = TAB_CONTENT;
  protected readonly activeTab = signal<ProductTabKey>('credit');
  protected readonly searchValue = signal('');

  protected readonly activeTabContent = computed(() => {
    return this.tabs.find((tab) => tab.key === this.activeTab()) ?? this.tabs[0];
  });

  protected readonly activeTabComponent = computed(() => HOME_TAB_COMPONENTS[this.activeTab()]);
  protected readonly activeTabInputs = computed(() => ({ searchValue: this.searchValue() }));

  protected setActiveTab(tab: ProductTabKey): void {
    this.activeTab.set(tab);
    this.searchValue.set('');
  }

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
  }
}
