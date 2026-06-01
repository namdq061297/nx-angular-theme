import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shell-layout',
  imports: [RouterOutlet, RouterLink, IconComponent, ButtonComponent],
  templateUrl: './app-shell.layout.html',
  styleUrl: './app-shell.layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellLayout {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  readonly background = input<string | null>(null);

  protected readonly isAuthenticated = this.authState.isAuthenticated;
  protected readonly greetingName = 'Vũ Thanh Nga';
  protected readonly requestCount = 0;

  backgroundStyle = '';

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;

        if (url.includes('register')) {
          this.backgroundStyle =
            'var(--color-linear-header)';
        } else {
          this.backgroundStyle = '';
        }
      });
  }

  protected logout(): void {
    this.authState.logout();
    this.router.navigateByUrl('/login');
  }

  protected goHome(): void {
    this.router.navigateByUrl('/');
  }
}
