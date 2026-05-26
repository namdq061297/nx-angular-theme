import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-shell-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, ButtonComponent],
  templateUrl: './app-shell.layout.html',
  styleUrl: './app-shell.layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellLayout {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.authState.isAuthenticated;
  protected readonly greetingName = 'Vũ Thanh Nga';
  protected readonly requestCount = 0;

  protected logout(): void {
    this.authState.logout();
    this.router.navigateByUrl('/login');
  }
}
