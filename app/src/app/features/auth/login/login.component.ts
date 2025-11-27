import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Login</h1>

        @if (authService.error()) {
          <div class="error-message">
            {{ authService.error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
              [class.invalid]="emailInput.invalid && emailInput.touched"
            />
            @if (emailInput.invalid && emailInput.touched) {
              <span class="field-error">Please enter a valid email</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="8"
              #passwordInput="ngModel"
              [class.invalid]="passwordInput.invalid && passwordInput.touched"
            />
            @if (passwordInput.invalid && passwordInput.touched) {
              <span class="field-error">Password must be at least 8 characters</span>
            }
          </div>

          <div class="form-group checkbox">
            <label>
              <input type="checkbox" name="rememberMe" [(ngModel)]="rememberMe" />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || authService.loading()"
            class="btn-primary"
          >
            @if (authService.loading()) {
              <span>Logging in...</span>
            } @else {
              <span>Login</span>
            }
          </button>
        </form>

        <div class="auth-links">
          <a routerLink="/forgot-password">Forgot password?</a>
          <p>Don't have an account? <a routerLink="/register">Register</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      margin: 0 0 1.5rem;
      text-align: center;
      color: #333;
    }

    .error-message {
      background: #fee2e2;
      border: 1px solid #ef4444;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group.checkbox {
      display: flex;
      align-items: center;
    }

    .form-group.checkbox label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    input[type="email"],
    input[type="password"],
    input[type="text"] {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input.invalid {
      border-color: #ef4444;
    }

    .field-error {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-links {
      margin-top: 1.5rem;
      text-align: center;
    }

    .auth-links a {
      color: #667eea;
      text-decoration: none;
    }

    .auth-links a:hover {
      text-decoration: underline;
    }

    .auth-links p {
      margin-top: 0.5rem;
      color: #6b7280;
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);

  email = '';
  password = '';
  rememberMe = false;

  onSubmit(): void {
    this.authService.clearError();
    this.authService.login({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    }).subscribe({
      error: () => {
        // Error is handled in service
      }
    });
  }
}
