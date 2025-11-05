import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastService, Toast } from '@core/services/toast.service';

/**
 * Toast Component
 * 
 * Zeigt Toast-Nachrichten an (Success/Error)
 * Entspricht: showToastMessage() DOM-Manipulation aus ui_helper.js Line 65-75
 */
@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.html',
    styleUrl: './toast.scss'
})
export class ToastComponent implements OnInit, OnDestroy {
    private toastService = inject(ToastService);
    private destroy$ = new Subject<void>();

    toasts: Toast[] = [];

    ngOnInit(): void {
        // Subscribe to toast messages
        this.toastService.toasts$
            .pipe(takeUntil(this.destroy$))
            .subscribe(toast => {
                this.addToast(toast);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Fügt Toast hinzu und entfernt ihn nach 3 Sekunden
     * Entspricht: setTimeout(() => { toast.remove(); }, 3000); aus ui_helper.js Line 72-74
     */
    private addToast(toast: Toast): void {
        this.toasts.push(toast);

        // Entferne Toast nach 3000ms (TOAST_DURATION aus config.js)
        setTimeout(() => {
            this.removeToast(toast.id);
        }, 3000);
    }

    /**
     * Entfernt Toast aus Array
     */
    private removeToast(id: string): void {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }

    /**
     * Manuelles Schließen (optional)
     */
    closeToast(id: string): void {
        this.removeToast(id);
    }
}