import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ProductTabKey = 'credit' | 'debit' | 'loan' | 'insurance' | 'investment';

@Component({
  selector: 'app-credit-tab-content',
  standalone: true,
  template: `
    <article class="tab-content">
      <h3>Thẻ tín dụng</h3>
      <p>Đây là vùng nội dung riêng cho tab Thẻ tín dụng. Bạn có thể thay bằng danh sách API thực tế sau.</p>
      @if (searchValue()) {
        <p class="tab-content__hint">Từ khóa đang lọc: {{ searchValue() }}</p>
      }
    </article>
  `,
  styles: [
    `
      .tab-content {
        border: 1px solid #e7eaef;
        border-radius: 12px;
        padding: 16px;
        background: #fcfdfb;
      }

      .tab-content h3 {
        margin: 0;
        color: #1f2937;
        font-size: 1rem;
      }

      .tab-content p {
        margin: 8px 0 0;
        color: #667085;
      }

      .tab-content__hint {
        color: #22693a;
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditTabContentComponent {
  readonly searchValue = input('');
}

@Component({
  selector: 'app-debit-tab-content',
  standalone: true,
  template: `
    <article class="tab-content">
      <h3>Thẻ ghi nợ</h3>
      <p>Đây là vùng nội dung riêng cho tab Thẻ ghi nợ. Bạn có thể cấu hình widget hoặc bảng dữ liệu riêng.</p>
      @if (searchValue()) {
        <p class="tab-content__hint">Từ khóa đang lọc: {{ searchValue() }}</p>
      }
    </article>
  `,
  styles: [
    `
      .tab-content {
        border: 1px solid #e7eaef;
        border-radius: 12px;
        padding: 16px;
        background: #fcfdfb;
      }

      .tab-content h3 {
        margin: 0;
        color: #1f2937;
        font-size: 1rem;
      }

      .tab-content p {
        margin: 8px 0 0;
        color: #667085;
      }

      .tab-content__hint {
        color: #22693a;
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebitTabContentComponent {
  readonly searchValue = input('');
}

@Component({
  selector: 'app-loan-tab-content',
  standalone: true,
  template: `
    <article class="tab-content">
      <h3>Vay</h3>
      <p>Đây là vùng nội dung riêng cho tab Vay. Có thể thay bằng card tiến độ hồ sơ và timeline.</p>
      @if (searchValue()) {
        <p class="tab-content__hint">Từ khóa đang lọc: {{ searchValue() }}</p>
      }
    </article>
  `,
  styles: [
    `
      .tab-content {
        border: 1px solid #e7eaef;
        border-radius: 12px;
        padding: 16px;
        background: #fcfdfb;
      }

      .tab-content h3 {
        margin: 0;
        color: #1f2937;
        font-size: 1rem;
      }

      .tab-content p {
        margin: 8px 0 0;
        color: #667085;
      }

      .tab-content__hint {
        color: #22693a;
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanTabContentComponent {
  readonly searchValue = input('');
}

@Component({
  selector: 'app-insurance-tab-content',
  standalone: true,
  template: `
    <article class="tab-content">
      <h3>Bảo hiểm</h3>
      <p>Đây là vùng nội dung riêng cho tab Bảo hiểm. Bạn có thể cắm form tái tục hoặc trạng thái hợp đồng.</p>
      @if (searchValue()) {
        <p class="tab-content__hint">Từ khóa đang lọc: {{ searchValue() }}</p>
      }
    </article>
  `,
  styles: [
    `
      .tab-content {
        border: 1px solid #e7eaef;
        border-radius: 12px;
        padding: 16px;
        background: #fcfdfb;
      }

      .tab-content h3 {
        margin: 0;
        color: #1f2937;
        font-size: 1rem;
      }

      .tab-content p {
        margin: 8px 0 0;
        color: #667085;
      }

      .tab-content__hint {
        color: #22693a;
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceTabContentComponent {
  readonly searchValue = input('');
}

@Component({
  selector: 'app-investment-tab-content',
  standalone: true,
  template: `
    <article class="tab-content">
      <h3>Đầu tư</h3>
      <p>Đây là vùng nội dung riêng cho tab Đầu tư. Bạn có thể thay bằng biểu đồ danh mục hoặc lịch sử lệnh.</p>
      @if (searchValue()) {
        <p class="tab-content__hint">Từ khóa đang lọc: {{ searchValue() }}</p>
      }
    </article>
  `,
  styles: [
    `
      .tab-content {
        border: 1px solid #e7eaef;
        border-radius: 12px;
        padding: 16px;
        background: #fcfdfb;
      }

      .tab-content h3 {
        margin: 0;
        color: #1f2937;
        font-size: 1rem;
      }

      .tab-content p {
        margin: 8px 0 0;
        color: #667085;
      }

      .tab-content__hint {
        color: #22693a;
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentTabContentComponent {
  readonly searchValue = input('');
}

export const HOME_TAB_COMPONENTS = {
  credit: CreditTabContentComponent,
  debit: DebitTabContentComponent,
  loan: LoanTabContentComponent,
  insurance: InsuranceTabContentComponent,
  investment: InvestmentTabContentComponent,
};
