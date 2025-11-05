import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast';
import { ToastService } from '@core/services/toast.service';

describe('ToastComponent', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let toastService: ToastService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToastComponent],
            providers: [ToastService]
        }).compileComponents();

        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        toastService = TestBed.inject(ToastService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display success toast', (done) => {
        toastService.showSuccess(['Test success message']);

        setTimeout(() => {
            fixture.detectChanges();
            expect(component.toasts.length).toBe(1);
            expect(component.toasts[0].type).toBe('success');
            expect(component.toasts[0].messages).toContain('Test success message');
            done();
        }, 100);
    });

    it('should display error toast', (done) => {
        toastService.showError(['Test error message']);

        setTimeout(() => {
            fixture.detectChanges();
            expect(component.toasts.length).toBe(1);
            expect(component.toasts[0].type).toBe('error');
            expect(component.toasts[0].messages).toContain('Test error message');
            done();
        }, 100);
    });

    it('should remove toast after 3 seconds', (done) => {
        toastService.showSuccess(['Test message']);

        setTimeout(() => {
            fixture.detectChanges();
            expect(component.toasts.length).toBe(1);
        }, 100);

        setTimeout(() => {
            fixture.detectChanges();
            expect(component.toasts.length).toBe(0);
            done();
        }, 3200);
    });
});