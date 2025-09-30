using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Charisma.Bff.Middlewares
{
    public static class JwtSignalRMiddleware
    {
        private const string AUTH_QUERY_STRING_KEY = "access_token";

        /// <summary>
        /// Middleware that extracts a bearer token from the query string (using the "access_token" key)
        /// and injects it into the Authorization header. This is necessary for SignalR connections,
        /// which cannot send authentication tokens via headers during the WebSocket handshake.
        /// Enables standard authentication handlers to process SignalR requests.
        /// </summary>
        public static void UseJwtSignalRAuthentication(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                if (string.IsNullOrWhiteSpace(context.Request.Headers.Authorization))
                {
                    try
                    {
                        if (context.Request.QueryString.HasValue 
                            && context.Request.Query.TryGetValue(AUTH_QUERY_STRING_KEY, out var token) 
                            && !string.IsNullOrWhiteSpace(token))
                        {
                            context.Request.Headers.Append(HeaderNames.Authorization, $"Bearer {token}");
                        }
                    }
                    catch
                    {
                        // If multiple headers it may throw an error. Ignore both.
                    }
                }

                await next.Invoke();
            });
        }
    }
}