using Charisma.Common.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NBB.Correlation;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Charisma.Api.Middlewares;

/// <summary>
/// Global exception handling middleware that converts exceptions to RFC 7807 Problem Details responses
/// </summary>
public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public GlobalExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlingMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleException(context, exception);
        }
    }

    private async Task HandleException(HttpContext context, Exception exception)
    {
        var correlationId = GetCorrelationId(context);
        LogException(exception, correlationId, context);

        var problemDetails = CreateProblemDetails(context, exception, correlationId);

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;

        var json = JsonSerializer.Serialize(problemDetails, JsonOptions);
        await context.Response.WriteAsync(json);
    }

    private void LogException(Exception exception, string correlationId, HttpContext context)
    {
        var logLevel = DetermineLogLevel(exception);
        var message = "Exception occurred during request processing";

        _logger.Log(logLevel, exception,
            "{Message} | CorrelationId: {CorrelationId} | Path: {Path} | Method: {Method} | UserId: {UserId}",
            message,
            correlationId,
            context.Request.Path,
            context.Request.Method,
            context.User?.Identity?.Name ?? "Anonymous");
    }

    private static LogLevel DetermineLogLevel(Exception exception) => exception switch
    {
        BusinessException => LogLevel.Warning,
        ArgumentException => LogLevel.Warning,
        UnauthorizedAccessException => LogLevel.Warning,
        FluentValidation.ValidationException => LogLevel.Information,
        _ => LogLevel.Error
    };

    private ProblemDetails CreateProblemDetails(HttpContext context, Exception exception, string correlationId)
    {
        var mapping = GetExceptionMapping(exception);
        var detail = GetExceptionDetail(exception);

        var problemDetails = new ProblemDetails
        {
            Status = mapping.StatusCode,
            Title = mapping.Title,
            Detail = detail,
            Instance = context.Request.Path,
            Type = mapping.ProblemType
        };

        // Add correlation ID for tracing
        problemDetails.Extensions["correlationId"] = correlationId;

        // Add timestamp for debugging
        problemDetails.Extensions["timestamp"] = DateTimeOffset.UtcNow;

        // Add error code if available
        AddErrorCode(problemDetails, exception);

        // Add validation errors if applicable
        AddValidationErrors(problemDetails, exception);

        // In development, add stack trace for debugging
        if (_environment.IsDevelopment())
        {
            problemDetails.Extensions["stackTrace"] = exception.StackTrace;
        }

        return problemDetails;
    }

    private static ExceptionMappingConfiguration.ExceptionMapping GetExceptionMapping(Exception exception)
    {
        var exceptionType = exception.GetType();
        if (ExceptionMappingConfiguration.ExceptionMappings.TryGetValue(exceptionType, out var mapping))
        {
            return mapping;
        }

        // Try base type matches for inheritance hierarchies
        var baseType = exceptionType.BaseType;
        while (baseType != null && baseType != typeof(object))
        {
            if (ExceptionMappingConfiguration.ExceptionMappings.TryGetValue(baseType, out var baseMapping))
            {
                return baseMapping;
            }
            baseType = baseType.BaseType;
        }

        return ExceptionMappingConfiguration.DefaultMapping;
    }

    private string GetExceptionDetail(Exception exception)
    {
        // In development, always show the actual message for debugging
        if (_environment.IsDevelopment())
            return exception.Message;

        // In production, use safe messages or business exception messages
        if (exception is BusinessException)
        {
            return exception.Message;
        }

        var exceptionType = exception.GetType();
        if (ExceptionMappingConfiguration.SafeDetailMessages.TryGetValue(exceptionType, out var safeMessage))
        {
            return safeMessage;
        }

        return ExceptionMappingConfiguration.DefaultSafeDetailMessage;
    }

    private static void AddValidationErrors(ProblemDetails problemDetails, Exception exception)
    {
        if (exception is not FluentValidation.ValidationException validationException)
            return;

        var errors = validationException.Errors
            .GroupBy(error => string.IsNullOrEmpty(error.PropertyName) ? "general" : error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.ErrorMessage).ToArray()
            );

        problemDetails.Extensions["errors"] = errors;
    }

    private static void AddErrorCode(ProblemDetails problemDetails, Exception exception)
    {
        if (exception is BusinessException businessException && !string.IsNullOrEmpty(businessException.Code))
        {
            problemDetails.Extensions["code"] = businessException.Code;
        }
    }

    private static string GetCorrelationId(HttpContext context)
    {
        var correlationId = CorrelationManager.GetCorrelationId();
        if (correlationId != null)
            return correlationId.ToString();

        // Check trace identifier from ASP.NET Core
        if (!string.IsNullOrEmpty(context.TraceIdentifier))
            return context.TraceIdentifier;

        // Generate new correlation ID as fallback
        return Guid.NewGuid().ToString();
    }
}