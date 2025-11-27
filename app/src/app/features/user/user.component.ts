import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="user-container">
      <header class="header">
        <div class="logo">Fullstack App</div>
        <nav>
          <a routerLink="/home" class="nav-link">Home</a>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </nav>
      </header>

      <main class="main-content">
        <div class="profile-card">
          <h1>Edit Profile</h1>

          @if (successMessage()) {
            <div class="success-message">
              {{ successMessage() }}
            </div>
          }

          @if (errorMessage()) {
            <div class="error-message">
              {{ errorMessage() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" #profileForm="ngForm">
            <div class="form-group">
              <label for="name">Name</label>
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
              <label for="image">Profile Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                [(ngModel)]="image"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div class="form-actions">
              <a routerLink="/home" class="btn-secondary">Cancel</a>
              <button
                type="submit"
                [disabled]="profileForm.invalid || saving()"
                class="btn-primary"
              >
                @if (saving()) {
                  <span>Saving...</span>
                } @else {
                  <span>Save Changes</span>
                }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .user-container {
      min-height: 100vh;
      background: #f3f4f6;
    }

    .header {
      background: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-link {
      color: #374151;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .nav-link:hover {
      background: #f3f4f6;
    }

    .btn-logout {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background: #fee2e2;
      border-color: #ef4444;
      color: #dc2626;
    }

    .main-content {
      padding: 2rem;
      display: flex;
      justify-content: center;
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }

    h1 {
      margin: 0 0 1.5rem;
      color: #111827;
      text-align: center;
    }

    .success-message {
      background: #d1fae5;
      border: 1px solid #10b981;
      color: #059669;
      padding: 0.75rem;
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

    input {
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

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-primary {
      flex: 1;
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

    .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 1rem;
      text-decoration: none;
      text-align: center;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #f3f4f6;
    }
  `]
})
export class UserComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  name = '';
  email = '';
  image = '';

  saving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.name = user.name ?? '';
      this.email = user.email;
      this.image = user.image ?? '';
    }
  }

  onSubmit(): void {
    const user = this.authService.user();
    if (!user) return;

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.userService.update(user.id, {
      name: this.name || undefined,
      email: this.email,
      image: this.image || undefined
    }).subscribe({
      next: () => {
        this.successMessage.set('Profile updated successfully');
        this.saving.set(false);
        // Refresh session to get updated user data
        this.authService.getSession().subscribe();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error?.message ?? 'Failed to update profile');
        this.saving.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
