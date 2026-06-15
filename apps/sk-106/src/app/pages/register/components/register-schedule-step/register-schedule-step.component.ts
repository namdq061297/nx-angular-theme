import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
} from '@angular/core';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import 'iconify-icon';
import type { Office, Province } from '../../../../core/models/register.model';
import { TransactionPointFilterModalComponent } from './transaction-point-filter-modal/transaction-point-filter-modal.component';

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
  readonly selectedTransactionPoint = input<Office | null>(null);
  readonly selectedConsultMethod = input('');
  readonly selectedDay = input('');
  readonly selectedSlot = input('');
  readonly submitted = input(false);
  readonly offices = input<Office[]>([]);
  readonly provinces = input<Province[]>([]);

  readonly transactionPointChanged = output<Office | null>();
  readonly consultMethodChanged = output<string>();
  readonly dayChanged = output<string>();
  readonly slotChanged = output<string>();

  private readonly isTransactionPointDropdownOpen = signal(false);
  private readonly transactionPointSearch = signal('');
  private readonly modalService = inject(ModalService);

  protected readonly transactionPointDropdownOpen =
    this.isTransactionPointDropdownOpen.asReadonly();
  protected readonly transactionPointSearchValue = this.transactionPointSearch.asReadonly();

  readonly availableConsultMethods = [
    { label: 'Tại quầy', value: 'counter' },
    { label: 'Qua hotline', value: 'hotline' },
  ] as const;
  readonly availableSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  constructor() {
    effect(() => {
      console.log('Selected Office:', this.offices());
    });
  }

  protected readonly filteredTransactionPoints = computed(() => {
    const query = this.transactionPointSearch().trim().toLowerCase();

    if (!query) {
      return this.offices();
    }

    return this.offices().filter((office) => {
      return (
        office.address.toLowerCase().includes(query) ||
        office.office_NAME.toLowerCase().includes(query) 
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

  protected selectTransactionPoint(point: Office): void {
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

  protected onOpenTransactionPointFilterModal(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    void this.openTransactionPointFilterModal();
  }

  private async openTransactionPointFilterModal(): Promise<void> {
    const ref = this.modalService.open<
      { offices: Office[]; provinces: Province[]; selectedTransactionPoint: Office | null },
      Office
    >({
      title: 'Chọn điểm giao dịch',
      component: TransactionPointFilterModalComponent,
      data: {
        offices: this.offices(),
        provinces: this.provinces(),
        selectedTransactionPoint: this.selectedTransactionPoint(),
      },
      width: '860px',
    });

    const selectedOffice = await ref.afterClosed$;

    if (selectedOffice) {
      this.selectTransactionPoint(selectedOffice);
    }
  }
}
