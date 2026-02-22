import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { getFormFieldError } from "@core/constants/validation.constants";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  registerForm = this.fb.group(
    {
      name: [""],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.clearError();
      const { email, password, name } = this.registerForm.getRawValue();
      this.authService
        .register({
          email: email!,
          password: password!,
          name: name || undefined,
        })
        .subscribe({
          error: () => {
            // Error is handled in service
          },
        });
    }
  }

  getErrorMessage(field: string): string {
    return getFormFieldError(this.registerForm, field);
  }

  get passwordMismatch(): boolean {
    return (
      this.registerForm.hasError("passwordMismatch") &&
      !!this.registerForm.get("confirmPassword")?.touched
    );
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

    if (password?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
