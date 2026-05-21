import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageComponent } from '../../shared/components/image/image.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent, ImageComponent, TextInputComponent, FooterComponent],
})
export class LoginPage {
  private readonly authState = inject(AuthStateService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  protected readonly documentId = signal('');
  protected readonly phoneNumber = signal('');
  protected readonly canSubmit = computed(() => {
    return this.documentId().trim().length > 0 && this.phoneNumber().trim().length > 0;
  });

  protected goBack(): void {
    this.location.back();
  }

  protected onLogin(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.authState.login();
    this.router.navigateByUrl('/home');
  }

  protected onDocumentIdChange(value: string): void {
    this.documentId.set(value);
  }

  protected onPhoneNumberChange(value: string): void {
    this.phoneNumber.set(value);
  }
}
