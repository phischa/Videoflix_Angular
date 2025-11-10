import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmPasswordComponent } from './confirm-password';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

describe('ConfirmPasswordComponent', () => {
    let component: ConfirmPasswordComponent;
    let fixture: ComponentFixture<ConfirmPasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let toastService: jasmine.SpyObj<ToastService>;
    let router: jasmine.SpyObj<Router>;
    let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['confirmPasswordReset']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const activatedRouteSpy = {
            queryParams: of({ uid: 'test-uid', token: 'test-token' })
        };

        await TestBed.configureTestingModule({
            imports: [ConfirmPasswordComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmPasswordComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with password and confirmedPassword controls', () => {
        expect(component.confirmPasswordForm.get('password')).toBeTruthy();
        expect(component.confirmPasswordForm.get('confirmedPassword')).toBeTruthy();
    });

    it('should validate password minimum length', () => {
        const passwordControl = component.passwordControl;

        passwordControl.setValue('short');
        expect(passwordControl.invalid).toBeTrue();

        passwordControl.setValue('longpassword');
        expect(passwordControl.valid).toBeTrue();
    });

    it('should validate password match', () => {
        component.passwordControl.setValue('password123');
        component.confirmedPasswordControl.setValue('password456');
        component.confirmPasswordForm.updateValueAndValidity();

        expect(component.confirmedPasswordControl.hasError('passwordMismatch')).toBeTrue();

        component.confirmedPasswordControl.setValue('password123');
        component.confirmPasswordForm.updateValueAndValidity();

        expect(component.confirmedPasswordControl.hasError('passwordMismatch')).toBeFalse();
    });

    it('should not submit if form is invalid', () => {
        component.passwordControl.setValue('');
        component.onSubmit();

        expect(authService.confirmPasswordReset).not.toHaveBeenCalled();
    });

    it('should call authService on valid submit', (done) => {
        authService.confirmPasswordReset.and.returnValue(of({}));
        component.passwordControl.setValue('password123');
        component.confirmedPasswordControl.setValue('password123');

        component.onSubmit();

        setTimeout(() => {
            expect(authService.confirmPasswordReset).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should toggle password visibility', () => {
        expect(component.showPassword).toBeFalse();

        component.togglePasswordVisibility('password');
        expect(component.showPassword).toBeTrue();

        component.togglePasswordVisibility('password');
        expect(component.showPassword).toBeFalse();
    });
});