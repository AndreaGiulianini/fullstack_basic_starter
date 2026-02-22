import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { UserService } from "@core/services/user.service";
import { Messages } from "@core/constants/messages.constants";
import { getFormFieldError } from "@core/constants/validation.constants";
import { extractErrorMessage } from "@core/models/api.models";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  profileForm = this.fb.group({
    name: [""],
    email: ["", [Validators.required, Validators.email]],
    image: [""],
  });

  saving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.profileForm.patchValue({
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
      });
    }
  }

  onSubmit(): void {
    if (!this.profileForm.valid) return;

    const user = this.authService.user();
    if (!user) return;

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const { name, email, image } = this.profileForm.getRawValue();
    this.userService
      .update(user.id, {
        name: name || undefined,
        email: email!,
        image: image || undefined,
      })
      .subscribe({
        next: () => {
          this.successMessage.set(Messages.success.profileUpdated);
          this.saving.set(false);
          this.authService.getSession().subscribe();
        },
        error: (err) => {
          this.errorMessage.set(
            extractErrorMessage(err, Messages.error.failedToUpdateProfile),
          );
          this.saving.set(false);
        },
      });
  }

  getErrorMessage(field: string): string {
    return getFormFieldError(this.profileForm, field);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
