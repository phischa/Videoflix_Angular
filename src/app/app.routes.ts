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

    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login')
            .then(m => m.LoginComponent),
        canActivate: [guestGuard],
        title: 'Login - Videoflix'
    },

    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register')
            .then(m => m.RegisterComponent),
        canActivate: [guestGuard],
        title: 'Register- Videoflix'
    },

    {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password')
            .then(m => m.ForgotPasswordComponent),
        title: 'Passwort vergessen - Videoflix'
    },

    {
        path: 'confirm-password',
        loadComponent: () => import('./features/auth/confirm-password/confirm-password')
            .then(m => m.ConfirmPasswordComponent),
        title: 'Passwort zurücksetzen - Videoflix'
    },
    {
        path: 'activate',
        loadComponent: () => import('./features/auth/activate/activate')
            .then(m => m.ActivateComponent),
        title: 'Account aktivieren - Videoflix'
    },
    {
        path: 'privacy',
        loadComponent: () => import('./features/static-pages/privacy/privacy')
            .then(m => m.PrivacyComponent),
        title: 'Datenschutz - Videoflix'
    },
    {
        path: 'imprint',
        loadComponent: () => import('./features/static-pages/imprint/imprint')
            .then(m => m.ImprintComponent),
        title: 'Impressum - Videoflix'
    },
    {
        path: 'videos',
        loadComponent: () => import('./features/videos/video-list/video-list')
            .then(m => m.VideoListComponent),
        canActivate: [authGuard],  // Nur für eingeloggte User!
        title: 'Videos - Videoflix'
    },
    // Fallback - 404
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];