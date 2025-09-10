import { toast } from "react-toastify";
import { ApiError, type ProblemDetails } from "./errorTypes";

export class ErrorService {
  /**
   * Parse error response and create appropriate error object
   */
  static async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && (contentType.includes("application/json") || contentType.includes("application/problem+json"))) {
        const problemDetails: ProblemDetails = await response.json();
        return new ApiError(problemDetails);
      }
    } catch (jsonError) {
      console.warn("Failed to parse error response as JSON:", jsonError);
    }

    const problemDetails: ProblemDetails = {
      status: response.status,
      detail: response.statusText || "An error occurred while processing your request",
      type: "about:blank"
    };

    return new ApiError(problemDetails);
  }

  /**
   * Handle error by showing appropriate toast notification
   */
  static handleError<TError = ApiError>(error: ApiError | TError): void {
    if (error instanceof ApiError) {
      this.handleApiError(error);
    } else {
      this.handleGenericError(error as Error);
    }
  }

  /**
   * Handle API errors with specific logic based on error type
   */
  private static handleApiError(error: ApiError): void {
    if (error.isValidationError()) {
      const validationMessages = error.getValidationMessages();
      const err = validationMessages.length > 0 ? validationMessages.join(", ") : error.getUserMessage();
      toast.error(err);
      return;
    }

    if (error.isUnauthorizedError()) {
      toast.error("You need to log in to perform this action");
      return;
    }

    if (error.isForbiddenError()) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    if (error.isNotFoundError()) {
      toast.error("The requested resource was not found");
      return;
    }

    if (error.isConflictError()) {
      toast.error(error.getUserMessage());
      return;
    }

    if (error.isServerError()) {
      toast.error("Server error occurred. Please try again later");
      console.error("Server error:", error);
      return;
    }

    // Fallback for other API errors
    toast.error(error.getUserMessage());
  }

  /**
   * Handle generic errors (network issues, etc.)
   */
  private static handleGenericError(error: Error): void {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      toast.error("Network error. Please check your connection");
      return;
    }

    if (error.message.includes("timeout")) {
      toast.error("Request timeout. Please try again");
      return;
    }

    // Fallback for unknown errors
    toast.error("An unexpected error occurred");
    console.error("Unexpected error:", error);
  }

  /**
   * Silent error handling - logs but doesn't show toast
   */
  static handleSilentError<TError = ApiError>(error: ApiError | TError): void {
    if (error instanceof ApiError) {
      console.error("API Error:", {
        status: error.status,
        title: error.title,
        detail: error.detail,
        type: error.type,
        validationErrors: error.validationErrors
      });
    } else {
      console.error("Error:", error);
    }
  }

  static shouldHandleSilently<TError = ApiError>(error: ApiError | TError): boolean {
    if (error instanceof ApiError && error.isUnauthorizedError()) {
      return true;
    }

    return false;
  }
}
