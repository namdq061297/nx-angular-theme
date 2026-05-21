import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button type="button" class="app-button" [disabled]="disabled()" (click)="pressed.emit()">
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
        transition: filter 120ms ease, transform 120ms ease;
      }

      .app-button:hover {
        filter: brightness(1.03);
      }

      .app-button:active {
        transform: translateY(1px);
      }

      .app-button:focus-visible {
        outline: 2px solid var(--color-text-inverse, #ffffff);
        outline-offset: 2px;
      }

      .app-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        filter: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  label = input.required<string>();
  disabled = input(false);

  readonly pressed = output<void>();
}