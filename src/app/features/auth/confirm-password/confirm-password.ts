import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Confirm Password Component (Password Reset)
 * 
 * Entspricht: confirm_password.html und confirmPasswordSubmit() aus auth.js
 * Ermöglicht Benutzern das Setzen eines neuen Passworts über den Reset-Link
 */
@Component({
    selector: 'app-confirm-password',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './confirm-password.html',
    styleUrl: './confirm-password.scss'
})

export class ConfirmPasswordComponent implements OnInit {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);

    confirmPasswordForm!: FormGroup;
    isSubmitting = false;
    showPassword = false;
    showConfirmedPassword = false;

    // URL Parameters (uidb64, token) aus dem Reset-Link
    private uidb64: string = '';
    private token: string = '';

    ngOnInit(): void {
        // Entspricht: initPasswordReset() aus auth.js Line 184-191
        this.initPasswordReset();
        this.initForm();
    }

    /**
   * Extrahiert uidb64 und token aus URL Query Parameters
   * Entspricht: initPasswordReset() und extractParams() aus auth.js
   */
    private initPasswordReset(): void {
        this.route.queryParams.subscribe(params => {
            this.uidb64 = params['uid'];
            this.token = params['token'];

            // Entspricht: if (!params) { showToastAndRedirect(...); }
            if (!this.uidb64 || !this.token) {
                this.toastService.showError(['Invalid reset link']);
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            }
        });
    }

    /**
   * Initialisiert Formular mit Custom Validator für Password Match
   * Entspricht: validatePW() und validateConfirmPW() aus auth.js
   */
    private initForm(): void {
        this.confirmPasswordForm = this.fb.group({
            password: ['', [
                Validators.required,
                Validators.minLength(8) // Entspricht: element.value.trim().length > 7
            ]],
            confirmedPassword: ['', [Validators.required]]
        }, {
            // Custom Validator für Password Match
            validators: this.passwordMatchValidator
        });
    }

    /**
   * Custom Validator: Prüft ob Passwörter übereinstimmen
   * Entspricht: validateConfirmPW(element) aus auth.js Line 127-133
   */
    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmedPassword = control.get('confirmedPassword');

        if (!password || !confirmedPassword) {
            return null;
        }

        // Entspricht: document.getElementById("password").value.trim() == element.value.trim()
        if (password.value.trim() !== confirmedPassword.value.trim()) {
            confirmedPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }

        // Clear mismatch error if passwords match
        if (confirmedPassword.hasError('passwordMismatch')) {
            confirmedPassword.setErrors(null);
        }

        return null;
    }

    get passwordControl() {
        return this.confirmPasswordForm.get('password')!;
    }

    get confirmedPasswordControl() {
        return this.confirmPasswordForm.get('confirmedPassword')!;
    }

    /**
     * Validierung bei Blur - Password
     * Entspricht: validatePW(this) aus auth.js Line 109-119
     */
    onPasswordBlur(): void {
        this.passwordControl.markAsTouched();
        this.passwordControl.updateValueAndValidity();

        // Re-validate confirmed password wenn es bereits ausgefüllt ist
        if (this.confirmedPasswordControl.value.trim().length > 0) {
            this.confirmPasswordForm.updateValueAndValidity();
        }
    }

    /**
     * Validierung bei Blur - Confirmed Password
     * Entspricht: validateConfirmPW(this) aus auth.js Line 127-133
     */
    onConfirmedPasswordBlur(): void {
        this.confirmedPasswordControl.markAsTouched();
        this.confirmPasswordForm.updateValueAndValidity();
    }

    /**
     * Toggle Password Visibility
     * Entspricht: togglePassword(icon) aus ui_helper.js Line 18-31
     */
    togglePasswordVisibility(field: 'password' | 'confirmed'): void {
        if (field === 'password') {
            this.showPassword = !this.showPassword;
        } else {
            this.showConfirmedPassword = !this.showConfirmedPassword;
        }
    }

    /**
     * Form Submission
     * Entspricht: confirmPasswordSubmit(event) aus auth.js Line 199-217
     */
    onSubmit(): void {
        if (this.confirmPasswordForm.invalid) {
            this.passwordControl.markAsTouched();
            this.confirmedPasswordControl.markAsTouched();
            return;
        }

        this.isSubmitting = true;

        // Entspricht: const data = { new_password: ..., confirm_password: ... }
        const passwords = {
            new_password: this.passwordControl.value.trim(),
            confirm_password: this.confirmedPasswordControl.value.trim()
        };

        // Entspricht: await postData(`password_confirm/${uid}/${token}/`, data);
        this.authService.confirmPasswordReset(this.uidb64, this.token, passwords).subscribe({
            next: () => {
                // Entspricht: showToastAndRedirect(false, ["Password successfully reset!"], "./login.html", TOAST_DURATION);
                this.toastService.showSuccess(['Password successfully reset!']);
                this.confirmPasswordForm.reset();

                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);

                this.isSubmitting = false;
            },
            error: (error: any) => {
                // Entspricht: const errorMessages = extractErrorMessages(result.data); showToastMessage(true, errorMessages);
                const errorMessages = this.extractErrorMessages(error.error);
                this.toastService.showError(errorMessages);
                this.isSubmitting = false;
            }
        });
    }

    /**
     * Error Messages extrahieren
     * Entspricht: extractErrorMessages() aus ui_helper.js Line 36-56
     */
    private extractErrorMessages(errorObject: any): string[] {
        let errorMessages: string[] = [];

        if (!errorObject) {
            return ['An error occurred'];
        }

        for (let key in errorObject) {
            if (errorObject.hasOwnProperty(key)) {
                const value = errorObject[key];
                if (typeof value === 'object' && value !== null) {
                    errorMessages = errorMessages.concat(this.extractErrorMessages(value));
                } else if (Array.isArray(value)) {
                    errorMessages = errorMessages.concat(value);
                } else {
                    errorMessages.push(value);
                }
            }
        }

        return errorMessages;
    }
}