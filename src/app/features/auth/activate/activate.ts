import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Account Activation Component
 * 
 * Entspricht: activate.html und activateAccount() aus auth.js
 * Aktiviert einen Benutzer-Account über den Link aus der Registrierungs-Email
 */
@Component({
    selector: 'app-activate',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './activate.html',
    styleUrl: './activate.scss'
})
export class ActivateComponent implements OnInit {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    // Activation States: 'processing' | 'success' | 'error'
    activationStatus: 'processing' | 'success' | 'error' = 'processing';
    activationMessage = 'Activating your account...';

    // URL Parameters (uidb64, token) aus dem Aktivierungs-Link
    private uidb64: string = '';
    private token: string = '';

    ngOnInit(): void {
        // Entspricht: initActivation() aus auth.js Line 222-225
        this.initActivation();
    }

    /**
     * Initialisiert die Account-Aktivierung
     * Entspricht: initActivation() und activateAccount() aus auth.js
     */
    private initActivation(): void {
        // Extrahiert Parameter aus URL
        this.route.queryParams.subscribe(params => {
            this.uidb64 = params['uid'];
            this.token = params['token'];

            // Entspricht: extractActivationParams() aus auth.js Line 248-255
            if (!this.uidb64 || !this.token) {
                this.handleActivationError('Invalid activation link');
                return;
            }

            // Starte Aktivierung automatisch
            this.activateAccount();
        });
    }

    /**
     * Führt die Account-Aktivierung durch
     * Entspricht: activateAccount() und processActivation() aus auth.js Line 230-271
     */
    private activateAccount(): void {
        // Status: Processing (Spinner anzeigen)
        this.activationStatus = 'processing';
        this.activationMessage = 'Activating your account...';

        // Entspricht: processActivation() - GET request to activate/{uid}/{token}/
        this.authService.activateAccount(this.uidb64, this.token).subscribe({
            next: (response: any) => {
                // Entspricht: handleActivationSuccess() aus auth.js Line 278-282
                this.handleActivationSuccess(response);
            },
            error: (error: any) => {
                // Entspricht: handleActivationError() aus auth.js Line 289-293
                this.handleActivationError(error.error?.message || 'Activation failed');
            }
        });
    }

    /**
     * Behandelt erfolgreiche Aktivierung
     * Entspricht: handleActivationSuccess() aus auth.js Line 278-282
     */
    private handleActivationSuccess(response: any): void {
        const message = response.message || 'Account successfully activated!';

        // Update UI
        this.activationStatus = 'success';
        this.activationMessage = message;

        // Entspricht: showToastAndRedirect(false, [message], "./login.html", ACTIVATION_CONFIG.successDelay);
        this.toastService.showSuccess([message]);

        // Redirect zu Login nach 3 Sekunden
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 3000);
    }

    /**
     * Behandelt Aktivierungs-Fehler
     * Entspricht: handleActivationError() aus auth.js Line 289-293
     */
    private handleActivationError(errorMessage: string): void {
        // Update UI
        this.activationStatus = 'error';
        this.activationMessage = errorMessage;

        // Entspricht: showToastAndRedirect(true, [message], "./login.html", ACTIVATION_CONFIG.errorDelay);
        this.toastService.showError([errorMessage]);

        // Redirect zu Login nach 5 Sekunden (mehr Zeit bei Error)
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 5000);
    }

    /**
     * Manueller Retry (falls User nochmal versuchen will)
     */
    retry(): void {
        this.activateAccount();
    }
}