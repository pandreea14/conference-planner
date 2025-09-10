// ProblemDetails structure based on RFC 7807
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown; // Allow additional properties
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly title: string;
  public readonly detail: string;
  public readonly type?: string;
  public readonly instance?: string;
  public readonly validationErrors?: Record<string, string[]>;
  public readonly problemDetails?: ProblemDetails;

  constructor(problemDetails: ProblemDetails) {
    const message = problemDetails.detail || problemDetails.title || "An error occurred";
    super(message);

    this.name = "ApiError";
    this.status = problemDetails.status || 500;
    this.title = problemDetails.title || "Error";
    this.detail = problemDetails.detail || message;
    this.type = problemDetails.type;
    this.instance = problemDetails.instance;
    this.validationErrors = problemDetails.errors;
    this.problemDetails = problemDetails;
  }

  isValidationError(): boolean {
    return this.status === 400 && (this.validationErrors != null || this.title === "Validation Error");
  }

  isNotFoundError(): boolean {
    return this.status === 404;
  }

  isUnauthorizedError(): boolean {
    return this.status === 401;
  }

  isForbiddenError(): boolean {
    return this.status === 403;
  }

  isConflictError(): boolean {
    return this.status === 409;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  getUserMessage(): string {
    if (this.isValidationError() && this.validationErrors) {
      const errors = Object.entries(this.validationErrors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ");
      return `Validation errors: ${errors}`;
    }

    return this.detail || this.title || "An unexpected error occurred";
  }

  getValidationMessages(): string[] {
    if (!this.validationErrors) return [];
    return Object.values(this.validationErrors)
      .flat()
      .filter((msg): msg is string => typeof msg === "string");
  }
}
