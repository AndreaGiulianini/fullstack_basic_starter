import { AbstractControl } from "@angular/forms";

export const ValidationMessages = {
  required: (field: string) => `${capitalize(field)} is required`,
  email: "Invalid email format",
  minlength: (length: number) => `Minimum ${length} characters required`,
  passwordMismatch: "Passwords do not match",
} as const;

export function getFormFieldError(
  form: AbstractControl,
  field: string,
): string {
  const control = form.get(field);
  if (!control || !control.touched) return "";

  if (control.hasError("required")) return ValidationMessages.required(field);
  if (control.hasError("email")) return ValidationMessages.email;
  if (control.hasError("minlength")) {
    const minLength = control.getError("minlength").requiredLength;
    return ValidationMessages.minlength(minLength);
  }
  return "";
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
