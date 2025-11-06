import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ForgotPasswordComponent } from './forgot-password';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let toastService: jasmine.SpyObj<ToastService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['requestPasswordReset']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ForgotPasswordComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with email control', () => {
        expect(component.forgotPasswordForm.get('email')).toBeTruthy();
    });

    it('should validate email format', () => {
        const emailControl = component.emailControl;

        emailControl.setValue('invalid-email');
        expect(emailControl.invalid).toBeTrue();

        emailControl.setValue('valid@email.com');
        expect(emailControl.valid).toBeTrue();
    });

    it('should not submit if form is invalid', () => {
        component.emailControl.setValue('');
        component.onSubmit();

        expect(authService.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('should call authService on valid submit', (done) => {
        authService.requestPasswordReset.and.returnValue(of({}));
        component.emailControl.setValue('test@example.com');

        component.onSubmit();

        setTimeout(() => {
            expect(authService.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
            done();
        }, 100);
    });
});