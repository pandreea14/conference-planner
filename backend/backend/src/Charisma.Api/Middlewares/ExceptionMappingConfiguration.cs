using Charisma.Common.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Frozen;
using System.Collections.Generic;

namespace Charisma.Api.Middlewares;

/// <summary>
/// Configuration for mapping exceptions to HTTP status codes, titles, and problem types
/// </summary>
public static class ExceptionMappingConfiguration
{
    /// <summary>
    /// Exception mapping configuration with status code, title, and RFC problem type
    /// </summary>
    public record ExceptionMapping(int StatusCode, string Title, string ProblemType);

    /// <summary>
    /// Frozen dictionary for exception type lookups
    /// </summary>
    public static readonly FrozenDictionary<Type, ExceptionMapping> ExceptionMappings =
        new Dictionary<Type, ExceptionMapping>
        {
            // Validation Exceptions
            [typeof(FluentValidation.ValidationException)] = new(
                StatusCodes.Status400BadRequest,
                "Validation Error",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            ),
            [typeof(System.ComponentModel.DataAnnotations.ValidationException)] = new(
                StatusCodes.Status400BadRequest,
                "Validation Error",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            ),

            // Business Exceptions
            [typeof(BusinessRuleViolationException)] = new(
                StatusCodes.Status400BadRequest,
                "Business Rule Violation",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            ),
            [typeof(NotFoundException)] = new(
                StatusCodes.Status404NotFound,
                "Resource Not Found",
                "https://tools.ietf.org/html/rfc7231#section-6.5.4"
            ),
            [typeof(ConflictException)] = new(
                StatusCodes.Status409Conflict,
                "Conflict",
                "https://tools.ietf.org/html/rfc7231#section-6.5.8"
            ),
            [typeof(ForbiddenException)] = new(
                StatusCodes.Status403Forbidden,
                "Forbidden",
                "https://tools.ietf.org/html/rfc7231#section-6.5.3"
            ),

            // System Exceptions
            [typeof(UnauthorizedAccessException)] = new(
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                "https://tools.ietf.org/html/rfc7235#section-3.1"
            ),
            [typeof(NotImplementedException)] = new(
                StatusCodes.Status501NotImplemented,
                "Not Implemented",
                "https://tools.ietf.org/html/rfc7231#section-6.6.2"
            ),
            [typeof(TimeoutException)] = new(
                StatusCodes.Status408RequestTimeout,
                "Request Timeout",
                "https://tools.ietf.org/html/rfc7231#section-6.5.7"
            ),
            [typeof(ArgumentNullException)] = new(
                StatusCodes.Status400BadRequest,
                "Bad Request",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            ),
            [typeof(ArgumentException)] = new(
                StatusCodes.Status400BadRequest,
                "Bad Request",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            ),
            [typeof(InvalidOperationException)] = new(
                StatusCodes.Status400BadRequest,
                "Bad Request",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            )
        }.ToFrozenDictionary();

    /// <summary>
    /// Default mapping for unknown exceptions
    /// </summary>
    public static readonly ExceptionMapping DefaultMapping = new(
        StatusCodes.Status500InternalServerError,
        "An error occurred while processing your request",
        "https://tools.ietf.org/html/rfc7231#section-6.6.1"
    );

    /// <summary>
    /// Safe detail messages that don't expose sensitive information
    /// </summary>
    public static readonly FrozenDictionary<Type, string> SafeDetailMessages =
        new Dictionary<Type, string>
        {
            [typeof(FluentValidation.ValidationException)] = "One or more validation errors occurred.",
            [typeof(System.ComponentModel.DataAnnotations.ValidationException)] = "One or more validation errors occurred.",
            [typeof(UnauthorizedAccessException)] = "You are not authorized to perform this action.",
            [typeof(NotImplementedException)] = "This feature is not implemented.",
            [typeof(TimeoutException)] = "The request timed out.",
            [typeof(ArgumentNullException)] = "Required arguments are missing.",
            [typeof(ArgumentException)] = "The request contains invalid arguments.",
            [typeof(InvalidOperationException)] = "The requested operation is not valid in the current state."
        }.ToFrozenDictionary();

    /// <summary>
    /// Default safe detail message
    /// </summary>
    public static readonly string DefaultSafeDetailMessage = "An unexpected error occurred. Please try again later.";
}