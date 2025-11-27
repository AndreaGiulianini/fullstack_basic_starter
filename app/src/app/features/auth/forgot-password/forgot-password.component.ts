import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Reset Password</h1>

        @if (submitted()) {
          <div class="success-message">
            If an account with that email exists, a password reset link has been sent.
          </div>
          <div class="auth-links">
            <a routerLink="/login">Back to Login</a>
          </div>
        } @else {
          <p class="description">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          @if (error()) {
            <div class="error-message">
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
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

            <button
              type="submit"
              [disabled]="forgotForm.invalid || loading()"
              class="btn-primary"
            >
              @if (loading()) {
                <span>Sending...</span>
              } @else {
                <span>Send Reset Link</span>
              }
            </button>
          </form>

          <div class="auth-links">
            <a routerLink="/login">Back to Login</a>
          </div>
        }
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
      margin: 0 0 1rem;
      text-align: center;
      color: #333;
    }

    .description {
      text-align: center;
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    .success-message {
      background: #d1fae5;
      border: 1px solid #10b981;
      color: #059669;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
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

    input[type="email"] {
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
  `]
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  email = '';
  loading = signal(false);
  error = signal<string | null>(null);
  submitted = signal(false);

  onSubmit(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.submitted.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error?.message ?? 'Failed to send reset email');
        this.loading.set(false);
      }
    });
  }
}
