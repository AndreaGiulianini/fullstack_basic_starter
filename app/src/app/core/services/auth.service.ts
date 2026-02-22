import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap, catchError, of } from "rxjs";
import { environment } from "@env/environment";
import { Messages } from "@core/constants/messages.constants";
import { ApiResponse, extractErrorMessage } from "@core/models/api.models";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface Session {
  token: string;
  expiresAt: string;
}

export interface AuthData {
  user: User;
  session: Session;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signals for reactive state management
  private userSignal = signal<User | null>(null);
  private sessionSignal = signal<Session | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly user = this.userSignal.asReadonly();
  readonly session = this.sessionSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => !!this.userSignal());

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor() {
    this.initializeFromSession();
  }

  private initializeFromSession(): void {
    this.getSession().subscribe({
      error: () => {
        // No valid session, do nothing
      },
    });
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthData>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<ApiResponse<AuthData>>(`${this.apiUrl}/sign-up/email`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setAuthState(response.data.user, response.data.session);
            this.router.navigate(["/home"]);
          }
        }),
        catchError((error) => {
          this.errorSignal.set(
            extractErrorMessage(error, Messages.error.registrationFailed),
          );
          this.loadingSignal.set(false);
          throw error;
        }),
        tap(() => this.loadingSignal.set(false)),
      );
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthData>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<ApiResponse<AuthData>>(`${this.apiUrl}/sign-in/email`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setAuthState(response.data.user, response.data.session);
            this.router.navigate(["/home"]);
          }
        }),
        catchError((error) => {
          this.errorSignal.set(extractErrorMessage(error, Messages.error.loginFailed));
          this.loadingSignal.set(false);
          throw error;
        }),
        tap(() => this.loadingSignal.set(false)),
      );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/sign-out`, {}).pipe(
      tap(() => this.clearAuthState()),
      catchError(() => {
        this.clearAuthState();
        return of(null);
      }),
    );
  }

  getSession(): Observable<ApiResponse<AuthData> | null> {
    return this.http
      .get<ApiResponse<AuthData>>(`${this.apiUrl}/get-session`)
      .pipe(
        tap((response) => {
          if (response?.success && response.data) {
            this.userSignal.set(response.data.user);
            this.sessionSignal.set({
              token: "", // Token is in HttpOnly cookie
              expiresAt: response.data.session.expiresAt,
            });
          }
        }),
        catchError(() => {
          this.clearAuthState();
          return of(null);
        }),
      );
  }

  forgotPassword(
    email: string,
  ): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/forgot-password`,
      { email },
    );
  }

  resetPassword(
    token: string,
    newPassword: string,
  ): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/reset-password`,
      { token, newPassword },
    );
  }

  private setAuthState(user: User, session: Session): void {
    this.userSignal.set(user);
    this.sessionSignal.set(session);
  }

  private clearAuthState(): void {
    this.userSignal.set(null);
    this.sessionSignal.set(null);
    this.router.navigate(["/login"]);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  handleUnauthorized(): void {
    this.clearAuthState();
  }
}
