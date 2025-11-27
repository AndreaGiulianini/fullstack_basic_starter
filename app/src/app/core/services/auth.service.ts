import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap, catchError, of } from "rxjs";
import { environment } from "@env/environment";

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

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    session: Session;
  };
  message?: string;
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
  readonly isAuthenticated = computed(
    () => !!this.userSignal() && !!this.sessionSignal(),
  );
  readonly token = computed(() => this.sessionSignal()?.token ?? null);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = "auth_token";

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.sessionSignal.set({ token, expiresAt: "" });
      this.getSession().subscribe();
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/sign-up/email`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setAuthState(response.data.user, response.data.session);
            this.router.navigate(["/home"]);
          }
        }),
        catchError((error) => {
          this.errorSignal.set(
            error.error?.error?.message ?? "Registration failed",
          );
          this.loadingSignal.set(false);
          throw error;
        }),
        tap(() => this.loadingSignal.set(false)),
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/sign-in/email`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setAuthState(response.data.user, response.data.session);
            this.router.navigate(["/home"]);
          }
        }),
        catchError((error) => {
          this.errorSignal.set(error.error?.error?.message ?? "Login failed");
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

  getSession(): Observable<AuthResponse | null> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/get-session`).pipe(
      tap((response) => {
        if (response?.success && response.data) {
          this.userSignal.set(response.data.user);
          this.sessionSignal.update((s) => ({
            ...s!,
            expiresAt: response.data.session.expiresAt,
          }));
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
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email },
    );
  }

  resetPassword(
    token: string,
    newPassword: string,
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/reset-password`,
      { token, newPassword },
    );
  }

  private setAuthState(user: User, session: Session): void {
    this.userSignal.set(user);
    this.sessionSignal.set(session);
    localStorage.setItem(this.TOKEN_KEY, session.token);
  }

  private clearAuthState(): void {
    this.userSignal.set(null);
    this.sessionSignal.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(["/login"]);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Handle unauthorized (401) responses by clearing auth state
   * Called by auth interceptor when API returns 401
   */
  handleUnauthorized(): void {
    this.clearAuthState();
  }
}
