import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, timer, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
    User,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    PasswordResetRequest,
    PasswordResetConfirm
} from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiService = inject(ApiService);
    private router = inject(Router);

    // User State (BehaviorSubject = Observable mit aktuellem Wert)
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private refreshTimer?: any;

    /**
     * Login - setzt HttpOnly Cookies via Backend
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.apiService.post<LoginResponse>('/login/', credentials).pipe(
            tap(response => {
                this.currentUserSubject.next(response.user);
                this.startTokenRefresh();
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Register - erstellt neuen User
     */
    register(data: RegisterRequest): Observable<any> {
        return this.apiService.post('/register/', data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Logout - löscht Cookies & blacklisted Token
     */
    logout(): Observable<any> {
        return this.apiService.post('/logout/', {}).pipe(
            tap(() => {
                this.currentUserSubject.next(null);
                this.stopTokenRefresh();
                this.router.navigate(['/login']);
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Token Refresh - alle 50 Min (Token läuft 60 Min)
     */
    private startTokenRefresh(): void {
        this.stopTokenRefresh();

        this.refreshTimer = timer(50 * 60 * 1000, 50 * 60 * 1000)
            .pipe(
                switchMap(() => this.refreshToken())
            )
            .subscribe();
    }

    private refreshToken(): Observable<any> {
        return this.apiService.post('/token/refresh/', {}).pipe(
            tap(() => console.log('✅ Token erfolgreich erneuert')),
            catchError(err => {
                console.error('❌ Token-Refresh fehlgeschlagen', err);
                this.logout().subscribe();
                return throwError(() => err);
            })
        );
    }

    private stopTokenRefresh(): void {
        if (this.refreshTimer) {
            this.refreshTimer.unsubscribe();
        }
    }

    /**
     * Password Reset Request
     */
    requestPasswordReset(email: string): Observable<any> {
        return this.apiService.post('/password_reset/', { email }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Password Reset Confirm
     */
    confirmPasswordReset(
        uidb64: string,
        token: string,
        passwords: PasswordResetConfirm
    ): Observable<any> {
        return this.apiService.post(
            `/password_confirm/${uidb64}/${token}/`,
            passwords
        ).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Account Activation
     */
    activateAccount(uidb64: string, token: string): Observable<any> {
        return this.apiService.get(`/activate/${uidb64}/${token}/`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Check if user is authenticated
     */
    get isAuthenticated(): boolean {
        return this.currentUserSubject.value !== null;
    }

    /**
     * Get current user value
     */
    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Error Handler
     */
    private handleError(error: any) {
        let errorMessage = 'Ein Fehler ist aufgetreten';

        if (error.error?.detail) {
            errorMessage = error.error.detail;
        } else if (error.error?.email) {
            errorMessage = error.error.email[0];
        } else if (error.error?.password) {
            errorMessage = error.error.password[0];
        }

        console.error('Auth Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}