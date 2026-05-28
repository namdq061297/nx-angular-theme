import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-register-confirm-step',
  standalone: true,
  templateUrl: './register-confirm-step.component.html',
  styleUrl: './register-confirm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterConfirmStepComponent {
  readonly selectedProductLabels = input.required<ReadonlyArray<string>>();
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
}
