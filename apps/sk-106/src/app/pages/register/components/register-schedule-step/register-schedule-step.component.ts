import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import 'iconify-icon';

export interface TransactionPoint {
  name: string;
  address: string;
}

@Component({
  selector: 'app-register-schedule-step',
  standalone: true,
  templateUrl: './register-schedule-step.component.html',
  styleUrl: './register-schedule-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextInputComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterScheduleStepComponent {
  readonly selectedProductKeys = input.required<ReadonlyArray<string>>();
  readonly selectedTransactionPoint = input<TransactionPoint | null>(null);
  readonly selectedConsultMethod = input('');
  readonly selectedDay = input('');
  readonly selectedSlot = input('');
  readonly submitted = input(false);

  readonly transactionPointChanged = output<TransactionPoint | null>();
  readonly consultMethodChanged = output<string>();
  readonly dayChanged = output<string>();
  readonly slotChanged = output<string>();

  private readonly isTransactionPointDropdownOpen = signal(false);
  private readonly transactionPointSearch = signal('');

  protected readonly transactionPointDropdownOpen =
    this.isTransactionPointDropdownOpen.asReadonly();
  protected readonly transactionPointSearchValue = this.transactionPointSearch.asReadonly();

  protected readonly transactionPoints: ReadonlyArray<TransactionPoint> = [
    {
      name: 'Chi nhánh Ba Đình - Trụ sở chi nhánh',
      address: 'Số 72 đường Trần Hưng Đạo, phường Trần Hưng Đạo, quận Hoàn Kiếm, thành phố Hà Nội',
    },
    {
      name: 'Chi nhánh Hà Nội - PDG Quang Trung',
      address: 'Số 2F Quang Trung, phường Tràng Tiền, quận Hoàn Kiếm, thành phố Hà Nội',
    },
    {
      name: 'Chi nhánh Đông Anh - PDG Hàng Bông',
      address: 'Số 40 Phùng Hưng, phường Hàng Bông, quận Hoàn Kiếm, thành phố Hà Nội',
    },
    {
      name: 'Chi nhánh Hoàn Kiếm - Trụ sở chi nhánh',
      address: '23 Phan Chu Trinh, phường Phan Chu Trinh, quận Hoàn Kiếm, thành phố Hà Nội',
    },
    {
      name: 'Chi nhánh Ba Đình - Trụ sở chi nhánh',
      address: 'Số 72 đường Trần Hưng Đạo, phường Trần Hưng Đạo, quận Hoàn Kiếm, thành phố Hà Nội',
    },
    {
      name: 'Chi nhánh Hà Nội - PDG Quang Trung',
      address: 'Số 2F Quang Trung, phường Tràng Tiền, quận Hoàn Kiếm, thành phố Hà Nội',
    },
    {
      name: 'Chi nhánh Đông Anh - PDG Hàng Bông',
      address: 'Số 40 Phùng Hưng, phường Hàng Bông, quận Hoàn Kiếm, thành phố Hà Nội',
    },
    {
      name: 'Chi nhánh Hoàn Kiếm - Trụ sở chi nhánh',
      address: '23 Phan Chu Trinh, phường Phan Chu Trinh, quận Hoàn Kiếm, thành phố Hà Nội',
    },
  ];

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

  protected readonly filteredTransactionPoints = computed(() => {
    const query = this.transactionPointSearch().trim().toLowerCase();

    if (!query) {
      return this.transactionPoints;
    }

    return this.transactionPoints.filter((point) => {
      return (
        point.name.toLowerCase().includes(query) || point.address.toLowerCase().includes(query)
      );
    });
  });

  protected toggleTransactionPointDropdown(): void {
    this.isTransactionPointDropdownOpen.update((isOpen) => !isOpen);
  }

  protected closeTransactionPointDropdown(): void {
    this.isTransactionPointDropdownOpen.set(false);
  }

  protected updateTransactionPointSearch(value: string): void {
    this.transactionPointSearch.set(value);
  }

  protected selectTransactionPoint(point: TransactionPoint): void {
    this.transactionPointChanged.emit(point);
    this.transactionPointSearch.set('');
    this.isTransactionPointDropdownOpen.set(false);
  }

  protected clearSelectedTransactionPoint(event: Event): void {
    event.stopPropagation();
    this.transactionPointChanged.emit(null);
  }

  protected selectConsultMethod(value: string): void {
    this.consultMethodChanged.emit(value);
  }

  protected selectDay(value: string): void {
    this.dayChanged.emit(value);
  }

  protected selectSlot(value: string): void {
    this.slotChanged.emit(value);
  }

  protected openDatePicker(input: HTMLInputElement): void {
    const dateInput = input as HTMLInputElement & { showPicker?: () => void };
    if (dateInput.showPicker) {
      dateInput.showPicker();
    }
  }
}
