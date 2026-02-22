import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { Messages } from "@core/constants/messages.constants";
import { getFormFieldError } from "@core/constants/validation.constants";
import { extractErrorMessage } from "@core/models/api.models";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  loading = signal(false);
  error = signal<string | null>(null);
  submitted = signal(false);

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const { email } = this.forgotForm.getRawValue();
      this.authService.forgotPassword(email!).subscribe({
        next: () => {
          this.submitted.set(true);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(
            extractErrorMessage(err, Messages.error.failedToSendResetEmail),
          );
          this.loading.set(false);
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    return getFormFieldError(this.forgotForm, field);
  }
}
