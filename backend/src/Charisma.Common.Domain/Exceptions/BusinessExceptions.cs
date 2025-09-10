using System;

namespace Charisma.Common.Domain.Exceptions
{
    /// <summary>
    /// Base class for all business exceptions
    /// </summary>
    public abstract class BusinessException : Exception
    {
        public string Code { get; }

        protected BusinessException(string message, string code = null) : base(message) 
        {
            Code = code;
        }
        protected BusinessException(string message, Exception innerException, string code = null) : base(message, innerException) 
        {
            Code = code;
        }
    }

    /// <summary>
    /// Thrown when a requested resource is not found
    /// </summary>
    public class NotFoundException : BusinessException
    {
        public NotFoundException(string message, string code = null) : base(message, code) { }
        public NotFoundException(string resourceName, object key, string code = null)
            : base($"{resourceName} with key '{key}' was not found", code) { }
    }

    /// <summary>
    /// Thrown when a business rule is violated
    /// </summary>
    public class BusinessRuleViolationException : BusinessException
    {
        public BusinessRuleViolationException(string message, string code = null) : base(message, code) { }
    }

    /// <summary>
    /// Thrown when there is a conflict with the current state of a resource
    /// </summary>
    public class ConflictException : BusinessException
    {
        public ConflictException(string message, string code = null) : base(message, code) { }
    }

    /// <summary>
    /// Thrown when access to a resource is forbidden
    /// </summary>
    public class ForbiddenException : BusinessException
    {
        public ForbiddenException(string message, string code = null) : base(message, code) { }
    }
}
