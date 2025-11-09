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

