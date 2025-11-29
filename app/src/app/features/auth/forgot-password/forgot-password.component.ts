import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  email = "";
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
        this.error.set(
          err.error?.error?.message ?? "Failed to send reset email",
        );
        this.loading.set(false);
      },
    });
  }
}
