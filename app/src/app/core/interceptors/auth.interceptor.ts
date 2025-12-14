import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { AuthService } from "@core/services/auth.service";

/**
 * HTTP interceptor that:
 * - Ensures credentials (cookies) are sent with requests
 * - Handles 401 responses by clearing auth state and redirecting to login
 *
 * Note: JWT token is now in HttpOnly cookie, so we don't need to manually add Authorization header
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Ensure credentials (cookies) are sent with the request
  const clonedRequest = req.clone({
    withCredentials: true,
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle unauthorized errors by clearing auth state
        authService.handleUnauthorized();
      }
      return throwError(() => error);
    }),
  );
};
