import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <header class="header">
        <div class="logo">Fullstack App</div>
        <nav>
          <a routerLink="/user" class="nav-link">Profile</a>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </nav>
      </header>

      <main class="main-content">
        <div class="welcome-card">
          <h1>Welcome{{ user()?.name ? ', ' + user()?.name : '' }}!</h1>
          <p class="email">{{ user()?.email }}</p>

          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">Account Status</span>
              <span class="stat-value" [class.verified]="user()?.emailVerified">
                {{ user()?.emailVerified ? 'Verified' : 'Unverified' }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Member Since</span>
              <span class="stat-value">{{ formatDate(user()?.createdAt) }}</span>
            </div>
          </div>

          <div class="actions">
            <a routerLink="/user" class="btn-primary">Edit Profile</a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
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

    .welcome-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      text-align: center;
    }

    h1 {
      margin: 0 0 0.5rem;
      color: #111827;
    }

    .email {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-item {
      padding: 1rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .stat-value.verified {
      color: #059669;
    }

    .actions {
      display: flex;
      justify-content: center;
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.2s, transform 0.2s;
    }

    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  `]
})
export class HomeComponent {
  private authService = inject(AuthService);

  user = this.authService.user;

  logout(): void {
    this.authService.logout().subscribe();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
