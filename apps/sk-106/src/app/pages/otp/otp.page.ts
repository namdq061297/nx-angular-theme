import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageComponent } from '../../shared/components/image/image.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PHONE_PATTERN_SOURCE } from '../../shared/validation/phone.validation';
import { LOGIN_VALIDATION_MESSAGES } from '../../shared/validation/validation-messages';
import { NgxOtpInputComponent, type OtpStatus } from 'ngx-otp-input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    IconComponent,
    ImageComponent,
    NgxOtpInputComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
})
export class OtpPage {
  private readonly authState = inject(AuthStateService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  status: OtpStatus = 'idle';

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  verifyOtp(code: string): void {
    console.log('Verifying OTP code:', code);
    // Verify the code, then set status to 'success' or 'error'
  }

  protected goBack(): void {
    this.location.back();
  }
}
