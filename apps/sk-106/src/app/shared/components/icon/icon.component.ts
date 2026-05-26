import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICONS, type IconName } from '@icons';

@Component({
  selector: 'app-icon',
  template: `
    <img
      [src]="src()"
      [alt]="alt()"
      [style.width.px]="resolvedWidth()"
      [style.height.px]="resolvedHeight()"
      class="app-icon"
    />
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .app-icon {
        display: block;
        object-fit: contain;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<number>(24);
  width = input<number | undefined>(undefined);
  height = input<number | undefined>(undefined);
  alt = input<string>('');

  src = computed(() => ICONS[this.name()]);
  resolvedWidth = computed(() => this.width() ?? this.size());
  resolvedHeight = computed(() => this.height() ?? this.size());
}
