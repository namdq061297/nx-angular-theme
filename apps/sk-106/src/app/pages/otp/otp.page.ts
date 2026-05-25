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

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent, ImageComponent, TextInputComponent, FooterComponent],
})
export class OtpPage {
  private readonly authState = inject(AuthStateService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected readonly phonePattern = PHONE_PATTERN_SOURCE;
  protected readonly validationMessages = LOGIN_VALIDATION_MESSAGES;
  protected readonly submitAttempted = signal(false);
  protected readonly documentId = signal('');
  protected readonly phoneNumber = signal('');


  protected goBack(): void {
    this.location.back();
  }

 
}
