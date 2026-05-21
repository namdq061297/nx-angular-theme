import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      type="button"
      class="app-button"
      [class.linear]="isLinear()"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      {{ label() }}
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .app-button {
        width: 100%;
        border: none;
        border-radius: 10px;
        padding: 10px 16px;
        background: linear-gradient(
          90deg,
          var(--gradient-bg-solid-leading, #84bd00) 0%,
          var(--gradient-bg-solid-trailing, #008047) 100%
        );
        color: var(--color-text-inverse, #ffffff);
        font: inherit;
        font-size: var(--font-size-16);
        font-weight: 600;
        line-height: 1.5;
        cursor: pointer;
        transition:
          filter 120ms ease,
          transform 120ms ease;
      }

      .app-button.linear {
        color: var(--color-text-default, #262626);
        font-weight: 400;
        border-radius: 999px;
        font-size: var(--font-size-12);
        background: var(--gradient-button, linear-gradient(246deg, #F6FFE5 15.23%, #B6E99C 46.88%, #91D9BA 84.77%));
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  label = input.required<string>();
  disabled = input(false);
  isLinear = input(false);

  readonly pressed = output<void>();
}
