import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';

export type ContactFieldKey =
  | 'fullName'
  | 'phone'
  | 'email'
  | 'birthDate'
  | 'income'
  | 'occupation'
  | 'incomeSource'
  | 'loanPurpose';

export interface ContactFormValue {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;
  income: string;
  occupation: string;
  incomeSource: string;
  loanPurpose: string;
}

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

  readonly contactFieldChanged = output<{ field: ContactFieldKey; value: string }>();

  protected readonly needsFinancialInfo = computed(() => {
    const keys = this.selectedProductKeys();
    return keys.includes('loan') || keys.includes('credit');
  });

  protected updateField(field: ContactFieldKey, value: string): void {
    this.contactFieldChanged.emit({ field, value });
  }
}
