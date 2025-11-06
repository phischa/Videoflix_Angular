import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Forgot Password Component
 * 
 * Entspricht: forgot_password.html und forgotEmailSubmit() aus auth.js
 * Ermöglicht Benutzern das Anfordern eines Password-Reset-Links per E-Mail
 */
@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent implements OnInit {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    forgotPasswordForm!: FormGroup;
    isSubmitting = false;

    ngOnInit(): void {
        this.initForm();
    }

    /**
     * Initialisiert das Formular mit Email-Validierung
     * Entspricht: validateEmail() aus auth.js Line 147-152
     */
    private initForm(): void {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [
                Validators.required,
                // EXAKT wie Vanilla JS: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            ]]
        });
    }

    /**
     * Getter für Email Control (für Template-Zugriff)
     */
    get emailControl() {
        return this.forgotPasswordForm.get('email')!;
    }

    /**
     * Validierung bei Blur (wie onblur="validateEmail(this)" im Vanilla)
     * Entspricht: validateEmail(element) aus auth.js Line 147-152
     */
    onEmailBlur(): void {
        this.emailControl.markAsTouched();
        this.emailControl.updateValueAndValidity();
    }

    /**
     * Form Submission Handler
     * Entspricht: forgotEmailSubmit(event) aus auth.js Line 51-56
     * und forgetEmail(data) aus auth.js Line 63-72
     */
    onSubmit(): void {
        // Entspricht: setError(false, "forgot_email_group");
        this.emailControl.markAsUntouched();

        if (this.forgotPasswordForm.invalid) {
            this.emailControl.markAsTouched();
            return;
        }

        this.isSubmitting = true;
        const email = this.emailControl.value.trim();

        // Entspricht: let response = await postData(FORGET_PASSWORD_URL, data);
        this.authService.requestPasswordReset(email).subscribe({
            next: () => {
                // Entspricht: showToastAndRedirect(false, ["Password reset email sent!..."], "../auth/login.html", TOAST_DURATION);
                this.toastService.showSuccess([
                    'Password reset email sent! Please check your inbox.'
                ]);

                // Redirect nach 3000ms (TOAST_DURATION aus config.js)
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);

                this.isSubmitting = false;
            },
            error: (error: any) => {
                // Entspricht: setError(true, "forgot_email_group"); + showToastMessage(true, errorArr);
                this.emailControl.setErrors({ 'serverError': true });
                const errorMessages = this.extractErrorMessages(error.error);
                this.toastService.showError(errorMessages);
                this.isSubmitting = false;
            }
        });
    }

    /**
     * Extrahiert Fehlermeldungen aus Server-Response
     * Entspricht: extractErrorMessages(errorObject) aus ui_helper.js Line 36-56
     * 
     * @param errorObject - Das Error-Objekt vom Server
     * @returns Array von Fehlermeldungen
     */
    private extractErrorMessages(errorObject: any): string[] {
        let errorMessages: string[] = [];

        for (let key in errorObject) {
            if (errorObject.hasOwnProperty(key)) {
                const value = errorObject[key];

                if (typeof value === 'object' && value !== null) {
                    // Rekursiv in verschachtelte Objekte eintauchen
                    errorMessages = errorMessages.concat(
                        this.extractErrorMessages(value)
                    );
                } else if (Array.isArray(value)) {
                    // Arrays direkt hinzufügen
                    errorMessages = errorMessages.concat(value);
                } else {
                    // Einzelne Werte hinzufügen
                    errorMessages.push(value);
                }
            }
        }

        return errorMessages;
    }
}