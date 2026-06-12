import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Office } from '../../../../../core/models/register.model';
import { MODAL_CLOSE_FN, MODAL_DATA } from '../../../../../shared/components/modal';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

interface TransactionPointFilterModalData {
  offices: Office[];
  selectedTransactionPoint: Office | null;
}

@Component({
  selector: 'app-transaction-point-filter-modal',
  standalone: true,
  imports: [CommonModule, TextInputComponent],
  templateUrl: './transaction-point-filter-modal.component.html',
  styleUrls: ['./transaction-point-filter-modal.component.scss'],
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
      new Set(this.modalData.offices.map((office) => this.extractProvince(office.address))),
    ).sort((a, b) => a.localeCompare(b, 'vi'));
  });

  protected readonly districtOptions = computed(() => {
    const province = this.selectedProvince();
    const source = province
      ? this.modalData.offices.filter((office) => this.extractProvince(office.address) === province)
      : [];

    return Array.from(new Set(source.map((office) => this.extractDistrict(office.address)))).sort(
      (a, b) => a.localeCompare(b, 'vi'),
    );
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
