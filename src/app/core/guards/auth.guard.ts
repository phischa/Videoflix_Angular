import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { map } from 'rxjs/operators';

/**
 * Auth Guard - Schützt Routes vor unauthentifizierten Usern
 * 
 * Verwendung in Routes:
 * { path: 'videos', component: VideoListComponent, canActivate: [authGuard] }
 */
export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        map(user => {
            if (user) {
                // User ist eingeloggt → Zugriff erlaubt
                return true;
            }

            // User ist NICHT eingeloggt → Redirect zu Login
            router.navigate(['/login']);
            return false;
        })
    );
};