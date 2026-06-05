import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ContactFormValue } from '../register-contact-step/register-contact-step.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import type { IconName } from '@icons';

export interface ConfirmProductItem {
  key: string;
  label: string;
}

@Component({
  selector: 'app-register-confirm-step',
  standalone: true,
  templateUrl: './register-confirm-step.component.html',
  styleUrl: './register-confirm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class RegisterConfirmStepComponent {
  readonly selectedProducts = input.required<ReadonlyArray<ConfirmProductItem>>();
  readonly contactValue = input.required<ContactFormValue>();
  readonly selectedTransactionPointName = input('');
  readonly selectedTransactionPointAddress = input('');
  readonly selectedConsultMethod = input('');
  readonly selectedDay = input('');
  readonly selectedSlot = input('');
  readonly acceptedTerms = input(false);
  readonly acceptedPolicy = input(false);
  readonly submitted = input(false);

  readonly acceptedTermsChanged = output<boolean>();
  readonly acceptedPolicyChanged = output<boolean>();

  protected onTermsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.acceptedTermsChanged.emit(target.checked);
  }

  protected onPolicyChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.acceptedPolicyChanged.emit(target.checked);
  }

  protected formatCurrency(value: string): string {
    const digits = value.replace(/\D+/g, '');
    if (!digits) {
      return 'Chưa cung cấp';
    }

    return `${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`;
  }

  protected formatConsultMethod(value: string): string {
    if (value === 'counter') {
      return 'Tư vấn tại quầy';
    }

    if (value === 'hotline') {
      return 'Tư vấn qua hotline';
    }

    return 'Chưa chọn';
  }

  protected formatReceiveMethod(value: string): string {
    if (value === 'home') {
      return 'Nhận tại nhà';
    }

    if (value === 'counter') {
      return 'Nhận tại quầy';
    }

    if (value === 'branch') {
      return 'Nhận tại chi nhánh';
    }

    return 'Chưa chọn';
  }

  protected getProductIcon(key: string): IconName {
    if (key === 'credit') {
      return 'ic_credit_card';
    }

    if (key === 'debit') {
      return 'ic_debit_card';
    }

    if (key === 'loan') {
      return 'ic_loan';
    }

    if (key === 'insurance') {
      return 'ic_healthcare';
    }

    return 'ic_credit_card';
  }
}
