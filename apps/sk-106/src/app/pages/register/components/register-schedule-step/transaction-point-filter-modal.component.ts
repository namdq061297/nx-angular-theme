import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { MODAL_CLOSE_FN, MODAL_DATA } from '../../../../shared/components/modal/modal.tokens';
import type { Office } from '../../../../core/models/register.model';

interface TransactionPointFilterModalData {
  offices: Office[];
  selectedTransactionPoint: Office | null;
}

@Component({
  selector: 'app-transaction-point-filter-modal',
  standalone: true,
  imports: [CommonModule, TextInputComponent],
  template: `
    <div class="filter-modal">
      <div class="filter-grid">
        <label class="field">
          <span class="body_medium_medium panel-title">Chọn Tỉnh/Thành phố <span class="required">*</span></span>
          <select class="field__control" [value]="selectedProvince()" (change)="onProvinceChange($any($event.target).value)">
            <option value="">- Chọn Tỉnh/Thành phố -</option>
            @for (province of provinceOptions(); track province) {
              <option [value]="province">{{ province }}</option>
            }
          </select>
        </label>

        <label class="field">
          <span class="body_medium_medium panel-title">Chọn Quận/Huyện <span class="required">*</span></span>
          <select
            class="field__control"
            [disabled]="!selectedProvince()"
            [value]="selectedDistrict()"
            (change)="onDistrictChange($any($event.target).value)"
          >
            <option value="">- Chọn Quận/Huyện -</option>
            @for (district of districtOptions(); track district) {
              <option [value]="district">{{ district }}</option>
            }
          </select>
        </label>
      </div>

      <app-text-input
        [isSearch]="true"
        [label]="''"
        [value]="searchKeyword()"
        [placeholder]="'Tìm kiếm điểm giao dịch'"
        (valueChange)="updateSearchKeyword($event)"
      />

      <div class="office-list">
        @for (office of filteredOffices(); track office.office_ID) {
          <button
            type="button"
            class="office-item"
            [class.office-item--selected]="isSelectedOffice(office)"
            (click)="selectOffice(office)"
          >
            <span class="office-item__name">{{ office.office_NAME }}</span>
            <span class="office-item__address">{{ office.address }}</span>
          </button>
        }

        @if (filteredOffices().length === 0) {
          <p class="empty-state">Không tìm thấy điểm giao dịch phù hợp.</p>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .filter-modal {
        display: grid;
        gap: 12px;
      }

      .filter-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .field {
        display: grid;
        gap: 6px;
      }

      .field__label {
        color: var(--color-text-subtle);
        font-size: var(--font-size-14);
      }

      .required {
        color: var(--color-text-error);
      }

      .field__control {
        width: 100%;
        height: 40px;
        border-radius: 8px;
        border: 1px solid var(--color-border-primary-brand);
        background: var(--color-bg-surface-primary);
        color: var(--color-text-default);
        font-size: var(--font-size-14);
        padding: 0 12px;
      }

      .field__control:disabled {
        background: var(--color-bg-disable, #f5f5f5);
        border-color: var(--color-border-disable, #d5d7da);
        color: var(--color-text-placeholder, #717680);
      }

      .office-list {
        max-height: 320px;
        overflow-y: auto;
        border: 1px solid var(--color-border-disable-subtle);
        border-radius: 8px;
        background: var(--color-bg-surface-primary);
      }

      .office-item {
        width: 100%;
        text-align: left;
        border: 0;
        border-bottom: 1px solid var(--color-border-disable-subtle);
        background: transparent;
        display: grid;
        gap: 4px;
        padding: 10px 12px;
        cursor: pointer;
      }

      .office-item:last-child {
        border-bottom: 0;
      }

      .office-item:hover {
        background: var(--color-gray-200);
      }

      .office-item--selected {
        background: var(--color-bg-app-default);
      }

      .office-item__name {
        color: var(--color-text-default);
        font-size: var(--font-size-14);
        font-weight: 600;
      }

      .office-item__address {
        color: var(--color-text-subtle);
        font-size: var(--font-size-12);
      }

      .empty-state {
        margin: 0;
        padding: 16px;
        color: var(--color-text-subtle);
        font-size: var(--font-size-14);
        text-align: center;
      }

      @media (max-width: 900px) {
        .filter-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionPointFilterModalComponent {
  private readonly modalData = inject<TransactionPointFilterModalData>(MODAL_DATA);
  private readonly closeFn = inject<(result?: Office) => void>(MODAL_CLOSE_FN);

  private readonly selectedProvinceSignal = signal('');
  private readonly selectedDistrictSignal = signal('');
  private readonly searchKeywordSignal = signal('');

  protected readonly selectedProvince = this.selectedProvinceSignal.asReadonly();
  protected readonly selectedDistrict = this.selectedDistrictSignal.asReadonly();
  protected readonly searchKeyword = this.searchKeywordSignal.asReadonly();

  protected readonly provinceOptions = computed(() => {
    return Array.from(
      new Set(this.modalData.offices.map((office) => this.extractProvince(office.address)))
    ).sort((a, b) => a.localeCompare(b, 'vi'));
  });

  protected readonly districtOptions = computed(() => {
    const province = this.selectedProvince();
    const source = province
      ? this.modalData.offices.filter((office) => this.extractProvince(office.address) === province)
      : [];

    return Array.from(
      new Set(source.map((office) => this.extractDistrict(office.address)))
    ).sort((a, b) => a.localeCompare(b, 'vi'));
  });

  protected readonly filteredOffices = computed(() => {
    const province = this.selectedProvince();
    const district = this.selectedDistrict();
    const query = this.searchKeyword().trim().toLowerCase();

    return this.modalData.offices.filter((office) => {
      const officeProvince = this.extractProvince(office.address);
      const officeDistrict = this.extractDistrict(office.address);
      const matchesProvince = !province || officeProvince === province;
      const matchesDistrict = !district || officeDistrict === district;
      const matchesQuery =
        !query ||
        office.office_NAME.toLowerCase().includes(query) ||
        office.address.toLowerCase().includes(query);

      return matchesProvince && matchesDistrict && matchesQuery;
    });
  });

  protected onProvinceChange(value: string): void {
    this.selectedProvinceSignal.set(value);
    this.selectedDistrictSignal.set('');
  }

  protected onDistrictChange(value: string): void {
    this.selectedDistrictSignal.set(value);
  }

  protected updateSearchKeyword(value: string): void {
    this.searchKeywordSignal.set(value);
  }

  protected isSelectedOffice(office: Office): boolean {
    return this.modalData.selectedTransactionPoint?.office_ID === office.office_ID;
  }

  protected selectOffice(office: Office): void {
    this.closeFn(office);
  }

  private extractProvince(address: string): string {
    const segments = address
      .split(',')
      .map((segment) => segment.trim())
      .filter(Boolean);

    for (let index = segments.length - 1; index >= 0; index -= 1) {
      if (/(thanh pho|thành phố|tinh|tỉnh)/i.test(segments[index])) {
        return segments[index];
      }
    }

    return 'Khác';
  }

  private extractDistrict(address: string): string {
    const segments = address
      .split(',')
      .map((segment) => segment.trim())
      .filter(Boolean);

    for (let index = segments.length - 1; index >= 0; index -= 1) {
      if (/(quan|quận|huyen|huyện|thi xa|thị xã|thanh pho|thành phố)/i.test(segments[index])) {
        return segments[index];
      }
    }

    return 'Khác';
  }
}
