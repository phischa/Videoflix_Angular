import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

export const routes: Routes = [
    // Landing Page (öffentlich)
    {
        path: '',
        loadComponent: () => import('./features/landing/landing.component')
            .then(m => m.LandingComponent),
        title: 'Videoflix - Stream die besten Filme'
    },

    // Auth Routes (nur für nicht-eingeloggte User)
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component')
            .then(m => m.LoginComponent),
        canActivate: [guestGuard],
        title: 'Login - Videoflix'
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component')
            .then(m => m.RegisterComponent),
        canActivate: [guestGuard],
        title: 'Registrieren - Videoflix'
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component')
            .then(m => m.ForgotPasswordComponent),
        title: 'Passwort vergessen - Videoflix'
    },

    // Email Activation (öffentlich, aber mit Token)
    {
        path: 'activate/:uidb64/:token',
        loadComponent: () => import('./features/auth/activate/activate.component')
            .then(m => m.ActivateComponent),
        title: 'Account aktivieren - Videoflix'
    },

    // Video Routes (nur für eingeloggte User)
    {
        path: 'videos',
        loadComponent: () => import('./features/videos/video-list/video-list.component')
            .then(m => m.VideoListComponent),
        canActivate: [authGuard],
        title: 'Videos - Videoflix'
    },

    // Static Pages (öffentlich)
    {
        path: 'privacy',
        loadComponent: () => import('./features/static-pages/privacy/privacy.component')
            .then(m => m.PrivacyComponent),
        title: 'Datenschutz - Videoflix'
    },
    {
        path: 'imprint',
        loadComponent: () => import('./features/static-pages/imprint/imprint.component')
            .then(m => m.ImprintComponent),
        title: 'Impressum - Videoflix'
    },

    // Fallback - 404 Not Found
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];