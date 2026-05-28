import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface ProductOption {
  key: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-register-products-step',
  standalone: true,
  templateUrl: './register-products-step.component.html',
  styleUrl: './register-products-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class RegisterProductsStepComponent {
  readonly products = input.required<ReadonlyArray<ProductOption>>();
  readonly selectedProductKeys = input.required<ReadonlyArray<string>>();

  readonly productToggled = output<string>();

  protected isSelected(key: string): boolean {
    return this.selectedProductKeys().includes(key);
  }

  protected toggle(key: string): void {
    this.productToggled.emit(key);
  }
}
