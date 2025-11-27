import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Create Account</h1>

        @if (authService.error()) {
          <div class="error-message">
            {{ authService.error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name">Name (optional)</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="name"
              #nameInput="ngModel"
            />
          </div>

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

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              #confirmPasswordInput="ngModel"
              [class.invalid]="(confirmPasswordInput.touched && password !== confirmPassword)"
            />
            @if (confirmPasswordInput.touched && password !== confirmPassword) {
              <span class="field-error">Passwords do not match</span>
            }
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || password !== confirmPassword || authService.loading()"
            class="btn-primary"
          >
            @if (authService.loading()) {
              <span>Creating account...</span>
            } @else {
              <span>Register</span>
            }
          </button>
        </form>

        <div class="auth-links">
          <p>Already have an account? <a routerLink="/login">Login</a></p>
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
      color: #6b7280;
    }
  `]
})
export class RegisterComponent {
  authService = inject(AuthService);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      return;
    }

    this.authService.clearError();
    this.authService.register({
      email: this.email,
      password: this.password,
      name: this.name || undefined
    }).subscribe({
      error: () => {
        // Error is handled in service
      }
    });
  }
}
