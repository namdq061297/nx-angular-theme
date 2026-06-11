import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { AuthStateService } from '../../../../core/services/auth-state.service';

export type ContactFieldKey =
  | 'fullName'
  | 'phone'
  | 'email'
  | 'monthlyIncome'
  | 'creditLimit'
  | 'cardReceiveMethod'
  | 'loanAmount'
  | 'loanTerm'
  | 'loanPurpose';

export interface ContactFormValue {
  fullName: string;
  phone: string;
  email: string;
  monthlyIncome: string;
  creditLimit: string;
  cardReceiveMethod: string;
  loanAmount: string;
  loanTerm: string;
  loanPurpose: string;
}

const MONTHLY_INCOME_OPTIONS = [
  { label: '5 - 10 triệu', value: '5-10tr' },
  { label: '10 - 20 triệu', value: '10-20tr' },
  { label: '20 - 30 triệu', value: '20-30tr' },
  { label: '30 - 50 triệu', value: '30-50tr' },
  { label: 'Trên 50 triệu', value: '50tr+' },
] as const;

const CARD_RECEIVE_METHOD_OPTIONS = [
  { label: 'Nhận tại nhà', value: 'home' },
  { label: 'Nhận tại quầy', value: 'counter' },
  { label: 'Nhận tại chi nhánh', value: 'branch' },
] as const;

const LOAN_PURPOSE_OPTIONS = [
  { label: 'Mua sắm tiêu dùng', value: 'consumption' },
  { label: 'Thanh toán học phí', value: 'education' },
  { label: 'Sửa chữa nhà cửa', value: 'home-repair' },
  { label: 'Kinh doanh cá nhân', value: 'business' },
] as const;

@Component({
  selector: 'app-register-contact-step',
  standalone: true,
  imports: [TextInputComponent],
  templateUrl: './register-contact-step.component.html',
  styleUrl: './register-contact-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterContactStepComponent {
  readonly selectedProductKeys = input.required<ReadonlyArray<string>>();
  readonly contactValue = input.required<ContactFormValue>();
  readonly submitted = input(false);
  readonly isPriority = input(false);

  readonly monthlyIncomeOptions = MONTHLY_INCOME_OPTIONS;
  readonly cardReceiveMethodOptions = CARD_RECEIVE_METHOD_OPTIONS;
  readonly loanPurposeOptions = LOAN_PURPOSE_OPTIONS;

  readonly contactFieldChanged = output<{ field: ContactFieldKey; value: string }>();

  protected readonly hasCreditProduct = computed(() => {
    return this.selectedProductKeys().includes('credit');
  });

  protected readonly hasLoanProduct = computed(() => {
    return this.selectedProductKeys().includes('loan');
  });

  protected updateField(field: ContactFieldKey, value: string): void {
    this.contactFieldChanged.emit({ field, value });
  }
}
