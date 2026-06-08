import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import 'iconify-icon';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  ConfirmProductItem,
  RegisterConfirmStepComponent,
} from './components/register-confirm-step/register-confirm-step.component';
import {
  ContactFieldKey,
  ContactFormValue,
  RegisterContactStepComponent,
} from './components/register-contact-step/register-contact-step.component';
import { RegisterProductsStepComponent } from './components/register-products-step/register-products-step.component';
import {
  RegisterScheduleStepComponent,
  TransactionPoint,
} from './components/register-schedule-step/register-schedule-step.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import type { IconName } from '@icons';
import { REGISTER_PRODUCTS, REGISTER_STEPS } from './mock/mock-register';
import type { RegisterStepKey } from './types/register-types';



@Component({
  selector: 'app-register-page',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    RegisterProductsStepComponent,
    RegisterContactStepComponent,
    RegisterScheduleStepComponent,
    RegisterConfirmStepComponent,
    IconComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterPage {
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);

  protected readonly steps = REGISTER_STEPS;
  protected readonly products = REGISTER_PRODUCTS;
  protected readonly currentStepIndex = signal(0);
  protected readonly selectedProductKeys = signal<string[]>([]);
  protected readonly contactForm = signal<ContactFormValue>({
    fullName: '',
    phone: '',
    email: '',
    monthlyIncome: '',
    creditLimit: '',
    cardReceiveMethod: '',
    loanAmount: '',
    loanTerm: '',
    loanPurpose: '',
  });
  protected readonly selectedConsultMethod = signal('');
  protected readonly selectedTransactionPoint = signal<TransactionPoint | null>(null);
  protected readonly selectedDay = signal('');
  protected readonly selectedSlot = signal('');
  protected readonly acceptedTerms = signal(false);
  protected readonly acceptedPolicy = signal(false);
  protected readonly isUploadDoc = signal(false);
  protected readonly stepSubmitted = signal<Record<RegisterStepKey, boolean>>({
    products: false,
    contact: false,
    schedule: false,
    confirm: false,
  });
  protected readonly isSubmitting = signal(false);
  protected readonly completed = signal(false);

  protected readonly activeStep = computed(() => this.steps[this.currentStepIndex()]);
  protected readonly isLastStep = computed(() => this.currentStepIndex() === this.steps.length - 1);
  protected readonly selectedProductLabels = computed(() => {
    const selected = this.selectedProductKeys();
    return this.products.filter((product) => selected.includes(product.key)).map((product) => product.label);
  });
  protected readonly selectedProductsForConfirm = computed<ReadonlyArray<ConfirmProductItem>>(() => {
    const selected = this.selectedProductKeys();
    return this.products
      .filter((product) => selected.includes(product.key))
      .map((product) => ({ key: product.key, label: product.label }));
  });
  protected readonly canContinue = computed(() => {
    return this.isCurrentStepValid();
  });

  protected toggleProduct(key: string): void {
    this.selectedProductKeys.update((keys) =>
      keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key],
    );
  }

  protected updateContactField(event: { field: ContactFieldKey; value: string }): void {
    this.contactForm.update((form) => ({ ...form, [event.field]: event.value }));
  }

  protected updateSelectedDay(value: string): void {
    this.selectedDay.set(value);
  }

  protected updateSelectedTransactionPoint(value: TransactionPoint | null): void {
    this.selectedTransactionPoint.set(value);
  }

  protected updateSelectedConsultMethod(value: string): void {
    this.selectedConsultMethod.set(value);
  }

  protected updateSelectedSlot(value: string): void {
    this.selectedSlot.set(value);
  }

  protected updateAcceptedTerms(value: boolean): void {
    this.acceptedTerms.set(value);
  }

  protected updateAcceptedPolicy(value: boolean): void {
    this.acceptedPolicy.set(value);
  }

  protected updateIsUploadDoc(value: boolean): void {
    this.isUploadDoc.set(value);
  }

  protected previousStep(): void {
    if (this.currentStepIndex() === 0) {
      return;
    }

    this.currentStepIndex.update((index) => index - 1);
  }

  protected async nextStep(): Promise<void> {
    const currentKey = this.activeStep().key;
    this.markStepSubmitted(currentKey);

    if (!this.isCurrentStepValid()) {
      return;
    }

    if (this.isLastStep()) {
      await this.submitRegistration();
      return;
    }

    this.currentStepIndex.update((index) => index + 1);
  }

  protected goToStep(index: number): void {
    if (index < 0 || index > this.currentStepIndex()) {
      return;
    }

    this.currentStepIndex.set(index);
  }

  protected isStepDone(index: number): boolean {
    return index < this.currentStepIndex();
  }

  protected isStepActive(index: number): boolean {
    return index === this.currentStepIndex();
  }

  protected isStepReachable(index: number): boolean {
    return index <= this.currentStepIndex();
  }

  protected isStepSubmitted(step: RegisterStepKey): boolean {
    return this.stepSubmitted()[step];
  }

  private markStepSubmitted(step: RegisterStepKey): void {
    this.stepSubmitted.update((state) => ({ ...state, [step]: true }));
  }

  private isCurrentStepValid(): boolean {
    const stepKey = this.activeStep().key;

    if (stepKey === 'products') {
      return this.selectedProductKeys().length > 0;
    }

    if (stepKey === 'contact') {
      return this.isContactValid();
    }

    if (stepKey === 'schedule') {
      return (
        Boolean(this.selectedTransactionPoint()) &&
        Boolean(this.selectedConsultMethod().trim()) &&
        Boolean(this.selectedDay().trim()) &&
        Boolean(this.selectedSlot().trim())
      );
    }

    if (stepKey === 'confirm') {
      return this.acceptedTerms() && this.acceptedPolicy();
    }

    return false;
  }

  private isContactValid(): boolean {
    const value = this.contactForm();
    const hasBaseInfo =
      value.fullName.trim().length > 0 &&
      value.phone.trim().length > 0 &&
      value.email.trim().length > 0 &&
      value.monthlyIncome.trim().length > 0;

    if (!hasBaseInfo) {
      return false;
    }

    const hasCreditProduct = this.selectedProductKeys().includes('credit');
    const hasLoanProduct = this.selectedProductKeys().includes('loan');

    if (hasCreditProduct) {
      const hasCreditInfo = value.creditLimit.trim().length > 0 && value.cardReceiveMethod.trim().length > 0;

      if (!hasCreditInfo) {
        return false;
      }
    }

    if (hasLoanProduct) {
      const hasLoanInfo =
        value.loanAmount.trim().length > 0 &&
        value.loanTerm.trim().length > 0 &&
        value.loanPurpose.trim().length > 0;

      if (!hasLoanInfo) {
        return false;
      }
    }

    return true;
  }

  private async submitRegistration(): Promise<void> {
    const payload = {
      products: this.selectedProductKeys(),
      contact: this.contactForm(),
      schedule: {
        transactionPoint: this.selectedTransactionPoint(),
        method: this.selectedConsultMethod(),
        day: this.selectedDay(),
        slot: this.selectedSlot(),
      },
      isUploadDoc: this.isUploadDoc(),
      submittedAt: new Date().toISOString(),
    };

    this.isSubmitting.set(true);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('register_submission_payload', JSON.stringify(payload));
      }
      this.authState.login();
      this.completed.set(true);
      await this.router.navigateByUrl('/register/register-list');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}