import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
    id: string;
    type: 'success' | 'error';
    messages: string[];
}

/**
 * Toast Service
 * 
 * Entspricht: showToastMessage() und getToastHTML() aus ui_helper.js
 * Verwaltet Toast-Nachrichten in der gesamten App
 */
@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<Toast>();
    public toasts$ = this.toastSubject.asObservable();

    /**
     * Zeigt Success Toast
     * Entspricht: showToastMessage(false, msg) aus ui_helper.js Line 65-75
     */
    showSuccess(messages: string[]): void {
        this.show('success', messages);
    }

    /**
     * Zeigt Error Toast
     * Entspricht: showToastMessage(true, msg) aus ui_helper.js Line 65-75
     */
    showError(messages: string[]): void {
        this.show('error', messages);
    }

    /**
     * Interner Show-Handler
     * Entspricht: showToastMessage() aus ui_helper.js
     */
    private show(type: 'success' | 'error', messages: string[]): void {
        const toast: Toast = {
            id: this.generateId(),
            type,
            messages: messages.length > 0 ? messages : [
                type === 'error' ? 'An error has occurred' : 'That worked!'
            ]
        };

        this.toastSubject.next(toast);
    }

    /**
     * Generiert eindeutige Toast-ID
     */
    private generateId(): string {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}