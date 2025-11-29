import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  authService = inject(AuthService);

  name = "";
  email = "";
  password = "";
  confirmPassword = "";

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      return;
    }

    this.authService.clearError();
    this.authService
      .register({
        email: this.email,
        password: this.password,
        name: this.name || undefined,
      })
      .subscribe({
        error: () => {
          // Error is handled in service
        },
      });
  }
}
