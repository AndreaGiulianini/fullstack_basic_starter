import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  authService = inject(AuthService);

  email = signal("");
  password = signal("");
  rememberMe = signal(false);

  onSubmit(): void {
    this.authService.clearError();
    this.authService
      .login({
        email: this.email(),
        password: this.password(),
        rememberMe: this.rememberMe(),
      })
      .subscribe({
        error: () => {
          // Error is handled in service
        },
      });
  }
}
