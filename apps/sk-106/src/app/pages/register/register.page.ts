import { Location, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageComponent } from '../../shared/components/image/image.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { PHONE_PATTERN_SOURCE } from '../../shared/validation/phone.validation';
import { LOGIN_VALIDATION_MESSAGES } from '../../shared/validation/validation-messages';

type CaptchaGenerateResponse = {
  captchaId: string;
  imageData: string;
};

type CaptchaVerifyResponse = {
  success: boolean;
};

@Component({
  selector: 'app-register-page',
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent, ImageComponent, TextInputComponent, FooterComponent],
})
export class RegisterPage {
  private readonly authState = inject(AuthStateService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly captchaBaseUrl = signal('');

  protected readonly phonePattern = PHONE_PATTERN_SOURCE;
  protected readonly validationMessages = LOGIN_VALIDATION_MESSAGES;
  protected readonly submitAttempted = signal(false);
  protected readonly fullName = signal('');
  protected readonly documentId = signal('');
  protected readonly phoneNumber = signal('');
  protected readonly captchaId = signal('');
  protected readonly captchaCode = signal('');
  protected readonly captchaImageData = signal('');
  protected readonly captchaLoading = signal(false);
  protected readonly captchaInvalidMessage = signal('');
  protected readonly captchaLoadError = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.captchaBaseUrl.set(`${window.location.origin}/api/captcha`);
      void this.refreshCaptcha();
    }
  }

  readonly canRegister = computed(() => {
    const fullName = this.fullName().trim();
    const documentId = this.documentId().trim();
    const phoneNumber = this.phoneNumber().trim();
    const captchaCode = this.captchaCode().trim();

    return fullName.length > 0 && documentId.length > 0 && phoneNumber.length > 0 && captchaCode.length > 0;
  });

  protected goBack(): void {
    this.location.back();
  }

  protected goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  protected async onRegister(): Promise<void> {
    this.submitAttempted.set(true);
    this.captchaInvalidMessage.set('');

    if (!this.canRegister()) {
      return;
    }

    if (!this.captchaCode().trim()) {
      return;
    }

    if (!this.captchaId()) {
      this.captchaInvalidMessage.set(this.validationMessages.captchaLoadFailed);
      return;
    }

    const verified = await this.verifyCaptcha();
    if (!verified) {
      if (this.captchaInvalidMessage() === this.validationMessages.captchaInvalid) {
        await this.refreshCaptcha(false);
      }
      return;
    }

    console.log('Full Name:', this.fullName());
    console.log('Document ID:', this.documentId());
    console.log('Phone Number:', this.phoneNumber());
    this.authState.login();
    this.router.navigateByUrl('/home');
  }

  protected onFullNameChange(value: string): void {
    this.fullName.set(value);
  }

  protected onDocumentIdChange(value: string): void {
    this.documentId.set(value);
  }

  protected onPhoneNumberChange(value: string): void {
    this.phoneNumber.set(value);
  }

  protected onCaptchaCodeChange(value: string): void {
    this.captchaCode.set(value);
    this.captchaInvalidMessage.set('');
  }

  protected async refreshCaptcha(clearInvalidMessage = true): Promise<void> {
    if (!this.captchaBaseUrl()) {
      return;
    }

    this.captchaLoading.set(true);
    this.captchaLoadError.set(false);
    if (clearInvalidMessage) {
      this.captchaInvalidMessage.set('');
    }

    try {
      const response = await firstValueFrom(
        this.http.get<CaptchaGenerateResponse>(`${this.captchaBaseUrl()}/generate`),
      );
      this.captchaId.set(response.captchaId);
      this.captchaImageData.set(response.imageData);
    } catch {
      this.captchaLoadError.set(true);
    } finally {
      this.captchaLoading.set(false);
    }
  }

  private async verifyCaptcha(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<CaptchaVerifyResponse>(`${this.captchaBaseUrl()}/verify`, {
          captchaId: this.captchaId(),
          input: this.captchaCode(),
        }),
      );
      if (!response.success) {
        this.captchaInvalidMessage.set(this.validationMessages.captchaInvalid);
      }
      return response.success;
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 400 || error.status === 401)) {
        this.captchaInvalidMessage.set(this.validationMessages.captchaInvalid);
      } else {
        this.captchaInvalidMessage.set(this.validationMessages.captchaLoadFailed);
      }
      return false;
    }
  }
}