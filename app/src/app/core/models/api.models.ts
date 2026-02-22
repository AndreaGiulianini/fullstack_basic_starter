export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

import { Messages } from "@core/constants/messages.constants";

export function extractErrorMessage(
  error: unknown,
  fallback = Messages.error.generic as string,
): string {
  const err = error as {
    error?: {
      error?: { message?: string };
      errors?: Record<string, string[]>;
      title?: string;
    };
  };

  // Custom API error format: { error: { message: "..." } }
  if (err?.error?.error?.message) {
    return err.error.error.message;
  }

  // ASP.NET validation error format: { errors: { Field: ["msg1", "msg2"] } }
  if (err?.error?.errors) {
    const messages = Object.values(err.error.errors).flat();
    if (messages.length > 0) {
      return messages.join(". ");
    }
  }

  return fallback;
}
