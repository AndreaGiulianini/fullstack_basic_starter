import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { AuthService } from "@core/services/auth.service";

/**
 * HTTP interceptor that:
 * - Adds the Bearer token to outgoing requests
 * - Handles 401 responses by clearing auth state and redirecting to login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        // Only handle 401 if we had a token (avoid redirect loops on login)
        authService.handleUnauthorized();
      }
      return throwError(() => error);
    }),
  );
};
