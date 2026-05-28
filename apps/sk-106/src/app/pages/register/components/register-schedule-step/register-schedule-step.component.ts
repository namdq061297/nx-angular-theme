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
  readonly selectedDay = input('');
  readonly selectedSlot = input('');
  readonly submitted = input(false);

  readonly dayChanged = output<string>();
  readonly slotChanged = output<string>();

  protected readonly availableDays = ['Hôm nay', 'Ngày mai', 'Thứ 6', 'Thứ 7'];
  protected readonly availableSlots = ['09:00 - 09:30', '13:30 - 14:00', '15:30 - 16:00', '19:30 - 20:00'];

  protected selectDay(value: string): void {
    this.dayChanged.emit(value);
  }

  protected selectSlot(value: string): void {
    this.slotChanged.emit(value);
  }
}
