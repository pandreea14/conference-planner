# Charisma.Bff

Backend for Frontend service that acts as an authentication proxy and request router for the Charisma application.

## What it does

- **Authentication**: Validates JWT tokens from IdentityServer
- **Request Proxying**: Routes `/api/*` requests to Charisma.Api  
- **Header Injection**: Adds tenant, user, and correlation headers to downstream requests
- **Multi-tenancy**: Extracts and propagates tenant context from JWT claims

## Configuration

### Core Settings
```json
{
  "Identity": {
    "Authority": "https://sso-qa.charisma.online",
    "ApiName": "Charisma.Api"
  },
  "ReverseProxy": {
    "Routes": {
      "CharismaApi": {
        "ClusterId": "Charisma",
        "Match": { "Path": "/api/{**remainder}" }
      }
    },
    "Clusters": {
      "Charisma": {
        "Destinations": {
          "Api": { "Address": "http://localhost:5178/" }
        }
      }
    }
  }
}
```

## Endpoints

- `GET /readyz` - Health check (readiness)
- `GET /livez` - Health check (liveness)
- `GET /api/system/version` - System version (proxied to API)
- All other `/api/*` requests are proxied to Charisma.Api

## Request Flow

1. Client sends request to BFF
2. **ExceptionHandlingMiddleware** - Global error handling
3. **CORS** - Allow frontend origins
4. **Correlation** - Add correlation ID
5. **Tenant Middleware** - Extract tenant from headers/JWT
6. **Authentication** - Validate JWT token
7. **Authorization** - Check permissions
8. **ProxyAuthorizationMiddleware** - Add auth headers for downstream
9. **YARP Reverse Proxy** - Forward to Charisma.Api

## Headers Added to Downstream Requests

- `TenantId` - Tenant identifier
- `user-id` - User identifier (sub claim)
- `user-passport` - Full JWT claims as JSON

## Development

```bash
cd backend/src/Charisma.Bff
dotnet run
```

Runs on `http://localhost:5200`