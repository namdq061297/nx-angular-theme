import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-register-schedule-step',
  standalone: true,
  templateUrl: './register-schedule-step.component.html',
  styleUrl: './register-schedule-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterScheduleStepComponent {
  readonly selectedProductKeys = input.required<ReadonlyArray<string>>();
  readonly selectedConsultMethod = input('');
  readonly selectedDay = input('');
  readonly selectedSlot = input('');
  readonly submitted = input(false);

  readonly consultMethodChanged = output<string>();
  readonly dayChanged = output<string>();
  readonly slotChanged = output<string>();

  protected readonly availableConsultMethods = [
    { label: 'Tại quầy', value: 'counter' },
    { label: 'Qua hotline', value: 'hotline' },
  ] as const;
  protected readonly availableSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  protected selectConsultMethod(value: string): void {
    this.consultMethodChanged.emit(value);
  }

  protected selectDay(value: string): void {
    this.dayChanged.emit(value);
  }

  protected selectSlot(value: string): void {
    this.slotChanged.emit(value);
  }
}
