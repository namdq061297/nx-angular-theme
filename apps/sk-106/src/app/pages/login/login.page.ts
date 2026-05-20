import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  protected onLogin(): void {
    this.authState.login();
    this.router.navigateByUrl('/home');
  }
}
