import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { getFormFieldError } from "@core/constants/validation.constants";

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
      const { email, password, rememberMe } = this.loginForm.getRawValue();
      this.authService
        .login({ email: email!, password: password!, rememberMe: rememberMe! })
        .subscribe({
          error: () => {
            // Error is handled in service
          },
        });
    }
  }

  getErrorMessage(field: string): string {
    return getFormFieldError(this.loginForm, field);
  }
}
