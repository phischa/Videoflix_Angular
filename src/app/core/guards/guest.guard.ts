import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { map } from 'rxjs/operators';

/**
 * Guest Guard - Erlaubt nur nicht-eingeloggten Usern
 * 
 * Verwendung in Routes:
 * { path: 'login', component: LoginComponent, canActivate: [guestGuard] }
 * 
 * Verhindert dass eingeloggte User auf Login/Register zugreifen
 */
export const guestGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        map(user => {
            if (!user) {
                // User ist NICHT eingeloggt → Zugriff erlaubt
                return true;
            }

            // User ist bereits eingeloggt → Redirect zu Videos
            router.navigate(['/videos']);
            return false;
        })
    );
};