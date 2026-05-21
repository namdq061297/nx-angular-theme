import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

let nextInputId = 0;

@Component({
  selector: 'app-text-input',
  template: `
    <label class="text-input" [attr.for]="resolvedId()">
      <span class="text-input__label">
        {{ label() }}
        @if (required()) {
          <span class="text-input__required" aria-hidden="true">*</span>
        }
      </span>

      <input
        class="text-input__control"
        [id]="resolvedId()"
        [type]="type()"
        [value]="value()"
        [placeholder]="placeholder()"
        [attr.autocomplete]="autocomplete()"
        [attr.inputmode]="inputmode()"
        [disabled]="disabled()"
        [required]="required()"
        [attr.aria-required]="required()"
        (input)="onInput($event)"
      />
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .text-input {
        display: grid;
        gap: 6px;
      }

      .text-input__label {
        color: var(--color-text-primary, #181d27);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        font-style: normal;
        font-weight: 500;
        // line-height: 1.42857;
        // letter-spacing: -0.2px;
      }

      .text-input__required {
        color: var(--color-text-error, #d92d20);
      }

      .text-input__control {
        width: 100%;
        border-radius: 8px;
        border: 1px solid var(--color-border-primary-brand, #d5d7da);
        background: var(--color-bg-surface-primary, #ffffff);
        padding: 10px 14px;
        color: var(--color-text-primary, #181d27);
        font-family: var(--font-family-base, sans-serif);
        font-size: var(--font-size-14, 0.875rem);
        font-style: normal;
        font-weight: 400;
        // line-height: 1.42857;
        // letter-spacing: -0.2px;
      }

      .text-input__control::placeholder,
      .text-input__control::-webkit-input-placeholder,
      .text-input__control::-moz-placeholder,
      .text-input__control:-ms-input-placeholder,
      .text-input__control::-ms-input-placeholder {
        color: var(--color-text-placeholder, #717680) !important;
        -webkit-text-fill-color: var(--color-text-placeholder, #717680);
        opacity: 1;
        font-weight: 400;

      }

      .text-input__control:focus-visible {
        outline: 2px solid var(--color-border-brand-primary-subtle, #55aa84);
        outline-offset: 2px;
      }

      .text-input__control:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent {
  private readonly generatedId = `app-text-input-${nextInputId++}`;

  label = input.required<string>();
  type = input('text');
  value = input('');
  placeholder = input('');
  autocomplete = input<string | undefined>(undefined);
  inputmode = input<string | undefined>(undefined);
  disabled = input(false);
  required = input(false);
  inputId = input<string | undefined>(undefined);

  readonly valueChange = output<string>();

  readonly resolvedId = computed(() => this.inputId() ?? this.generatedId);

  protected onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.valueChange.emit(element.value);
  }
}