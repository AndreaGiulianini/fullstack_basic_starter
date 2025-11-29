import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService, User } from "@core/services/auth.service";
import { UserService } from "@core/services/user.service";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  name = "";
  email = "";
  image = "";

  saving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.name = user.name ?? "";
      this.email = user.email;
      this.image = user.image ?? "";
    }
  }

  onSubmit(): void {
    const user = this.authService.user();
    if (!user) return;

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.userService
      .update(user.id, {
        name: this.name || undefined,
        email: this.email,
        image: this.image || undefined,
      })
      .subscribe({
        next: () => {
          this.successMessage.set("Profile updated successfully");
          this.saving.set(false);
          // Refresh session to get updated user data
          this.authService.getSession().subscribe();
        },
        error: (err) => {
          this.errorMessage.set(
            err.error?.error?.message ?? "Failed to update profile",
          );
          this.saving.set(false);
        },
      });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
