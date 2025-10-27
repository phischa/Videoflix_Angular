import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

export const routes: Routes = [
    // Landing Page (✅ EXISTS)
    {
        path: '',
        loadComponent: () => import('./features/landing/landing')
            .then(m => m.LandingComponent),
        title: 'Videoflix - Stream die besten Filme'
    },

    // TODO: Auth Routes (will create later)
    // {
    //   path: 'login',
    //   loadComponent: () => import('./features/auth/login/login')
    //     .then(m => m.LoginComponent),
    //   canActivate: [guestGuard],
    //   title: 'Login - Videoflix'
    // },

    // Fallback - 404
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];