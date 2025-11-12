import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Header Component
 * 
 * Entspricht: header.js und getHeaderTemplate() aus Vanilla
 * Zeigt Logo + Logout Button für eingeloggte User
 */
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    /**
     * Logout User
     * Entspricht: logOut() aus header.js Line 10-32
     */
    logout(): void {
        this.authService.logout().subscribe({
            next: () => {
                this.toastService.showSuccess(['Successfully logged out!']);
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 1500);
            },
            error: () => {
                this.toastService.showError(['Logout error, redirecting...']);
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 1500);
            }
        });
    }
}