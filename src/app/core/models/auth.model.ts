// ============================================
// USER & AUTHENTICATION MODELS
// ============================================

export interface User {
    id: number;
    email: string;
    username: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmed_password: string;
}

export interface LoginResponse {
    detail: string;
    user: User;
    // Note: Tokens sind in HttpOnly Cookies, nicht im Response Body!
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    new_password: string;
    confirm_password: string;
}