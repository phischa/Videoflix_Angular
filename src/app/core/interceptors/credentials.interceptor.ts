import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor for Cookie-based Authentication
 * 
 * Sets withCredentials: true on ALL HTTP requests
 * → Browser automatically sends HttpOnly Cookies
 * → Important for JWT tokens in cookies!
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
    // Clone request and add withCredentials
    const clonedRequest = req.clone({
        withCredentials: true
    });

    // Continue to next handler
    return next(clonedRequest);
};