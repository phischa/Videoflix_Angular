import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isSubmitting: boolean = false;

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmed_password: ['', [Validators.required]],
      privacy_policy: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Pre-fill email if coming from landing page
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.registerForm.patchValue({ email: params['email'] });
      }
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmed_password');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmed_password() {
    return this.registerForm.get('confirmed_password');
  }

  get privacy_policy() {
    return this.registerForm.get('privacy_policy');
  }

  // Check if passwords don't match (for error display)
  get passwordsDoNotMatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') &&
      this.confirmed_password?.touched || false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });

      // Show specific error messages
      if (!this.privacy_policy?.value) {
        this.errorMessage = 'Please accept the privacy policy to continue';
      } else {
        this.errorMessage = 'Please correct the errors in the form';
      }
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password, confirmed_password } = this.registerForm.value;

    this.authService.register({ email, password, confirmed_password }).subscribe({
      next: () => {
        // Show success message and redirect to login
        alert('Registration successful! Please check your email for activation link.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Registration failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
