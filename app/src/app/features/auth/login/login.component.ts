import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.clearError();
      this.authService.login(this.loginForm.value as any).subscribe({
        error: () => {
          // Error is handled in service
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control || !control.touched) return "";

    if (control.hasError("required"))
      return `${this.capitalize(field)} is required`;
    if (control.hasError("email")) return "Invalid email format";
    if (control.hasError("minlength")) {
      const minLength = control.getError("minlength").requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    return "";
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
