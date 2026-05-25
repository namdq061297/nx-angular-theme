import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageComponent } from '../../shared/components/image/image.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
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
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  protected readonly phoneNumber = signal('');
  protected readonly otp = signal('');

  constructor() {
    const phone = this.router.getCurrentNavigation()?.extras.state?.['phone'] ?? history.state?.phone ?? '';
    this.phoneNumber.set(phone);
  }

  status: OtpStatus = 'idle';

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  verifyOtp(code: string): void {
    console.log('Verifying OTP code:', code);
    if (code?.length === 6) {
      this.otp.set(code);
    }
    // Verify the code, then set status to 'success' or 'error'
  }

  protected goBack(): void {
    this.location.back();
  }
}
