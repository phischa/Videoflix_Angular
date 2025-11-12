import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ActivateComponent } from './activate';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

describe('ActivateComponent', () => {
    let component: ActivateComponent;
    let fixture: ComponentFixture<ActivateComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let toastService: jasmine.SpyObj<ToastService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['activateAccount']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const activatedRouteSpy = {
            queryParams: of({ uid: 'test-uid', token: 'test-token' })
        };

        await TestBed.configureTestingModule({
            imports: [ActivateComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivateComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with processing status', () => {
        expect(component.activationStatus).toBe('processing');
    });

    it('should call authService.activateAccount on init with valid params', (done) => {
        authService.activateAccount.and.returnValue(of({ message: 'Success' }));

        fixture.detectChanges();

        setTimeout(() => {
            expect(authService.activateAccount).toHaveBeenCalledWith('test-uid', 'test-token');
            done();
        }, 100);
    });

    it('should show error if uid or token is missing', (done) => {
        const activatedRouteSpy = {
            queryParams: of({ uid: '', token: '' })
        };

        TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteSpy });
        fixture = TestBed.createComponent(ActivateComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.activationStatus).toBe('error');
            expect(toastService.showError).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should handle successful activation', (done) => {
        const successResponse = { message: 'Account activated!' };
        authService.activateAccount.and.returnValue(of(successResponse));

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.activationStatus).toBe('success');
            expect(component.activationMessage).toBe('Account activated!');
            expect(toastService.showSuccess).toHaveBeenCalledWith(['Account activated!']);
            done();
        }, 100);
    });

    it('should handle activation error', (done) => {
        const errorResponse = { error: { message: 'Invalid token' } };
        authService.activateAccount.and.returnValue(throwError(() => errorResponse));

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.activationStatus).toBe('error');
            expect(toastService.showError).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should navigate to login after successful activation', (done) => {
        authService.activateAccount.and.returnValue(of({ message: 'Success' }));

        fixture.detectChanges();

        setTimeout(() => {
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
            done();
        }, 3100);
    });

    it('should allow retry on error', (done) => {
        const errorResponse = { error: { message: 'Error' } };
        authService.activateAccount.and.returnValue(throwError(() => errorResponse));

        fixture.detectChanges();

        setTimeout(() => {
            expect(component.activationStatus).toBe('error');

            // Reset spy
            authService.activateAccount.calls.reset();
            authService.activateAccount.and.returnValue(of({ message: 'Success' }));

            // Retry
            component.retry();

            setTimeout(() => {
                expect(authService.activateAccount).toHaveBeenCalled();
                expect(component.activationStatus).toBe('success');
                done();
            }, 100);
        }, 100);
    });
});