using Charisma.Common.Domain.Constants;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Charisma.Api.Extensions
{
    public static class AuthenticationExtensions
    {
        public static void AddAuthentication(this IServiceCollection services, IConfigurationRoot configuration)
        {
            var identityIsEnabled = configuration.GetValue<bool>("Identity:Enabled", false);
            if (identityIsEnabled)
            {
                services.AddAuthentication("Bearer")
                    .AddIdentityServerAuthentication(options =>
                    {
                        options.Authority = configuration["Identity:Authority"];
                        options.RequireHttpsMetadata = false;
                        options.ApiName = configuration["Identity:ApiName"];
                    });
                return;
            }

            services.AddAuthentication(InternalAuthScheme.Name)
                .AddScheme<AuthenticationSchemeOptions, InternalApiAuthenticationHandler>(InternalAuthScheme.Name, null);
        }
    }

    internal struct InternalAuthScheme
    {
        public const string Name = "InternalApi";
    }

    public class InternalApiAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly ILogger<InternalApiAuthenticationHandler> _logger;

        public InternalApiAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory loggerFactory,
            ILogger<InternalApiAuthenticationHandler> logger,
            UrlEncoder encoder) : base(options, loggerFactory, encoder)
        {
            _logger = logger;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var userIdHeader = Context.Request.Headers[Authentication.Headers.UserId];
            _logger.LogDebug("Context.Request.Headers: {Headers}", Context.Request.Headers);

            if (!userIdHeader.Any())
                return Task.FromResult(AuthenticateResult.NoResult());

            var userId = userIdHeader.ToString();
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim("sub", userId)
            };

            var userPassportHeader = Context.Request.Headers[Authentication.Headers.UserPassport];
            if (userPassportHeader.Any())
            {
                var userPassportString = userPassportHeader.ToString();
                if (!string.IsNullOrWhiteSpace(userPassportString))
                {
                    var userPassport = JsonConvert.DeserializeObject<UserPassport>(userPassportString);
                    if (userPassport == null)
                    {
                        return Task.FromResult(AuthenticateResult.Fail("cannot decode user passport"));
                    }

                    claims.AddRange(userPassport.Claims);
                }
            }

            // create a new claims identity and return an AuthenticationTicket with the correct scheme
            var claimsIdentity = new ClaimsIdentity(claims, InternalAuthScheme.Name);
            var ticket = new AuthenticationTicket(new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties(), InternalAuthScheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }

    internal class UserPassport : Dictionary<string, object>
    {
        public string Sub => GetStandardClaim(JwtRegisteredClaimNames.Sub);

        public virtual IEnumerable<Claim> Claims
        {
            get
            {
                List<Claim> claims = new List<Claim>();
                string issuer = ClaimsIdentity.DefaultIssuer;

                // there is some code redundancy here that was not factored as this is a high use method. Each identity received from the host will pass through here.
                foreach (KeyValuePair<string, object> keyValuePair in this)
                {
                    if (keyValuePair.Value == null)
                    {
                        claims.Add(new Claim(keyValuePair.Key, string.Empty, JsonClaimValueTypes.JsonNull, issuer, issuer));
                        continue;
                    }

                    var claimValue = keyValuePair.Value as string;
                    if (claimValue != null)
                    {
                        claims.Add(new Claim(keyValuePair.Key, claimValue, ClaimValueTypes.String, issuer, issuer));
                        continue;
                    }

                    var jtoken = keyValuePair.Value as JToken;
                    if (jtoken != null)
                    {
                        AddClaimsFromJToken(claims, keyValuePair.Key, jtoken, issuer);
                        continue;
                    }

                    // in this case, the payload was most likely never serialized.
                    var objects = keyValuePair.Value as IEnumerable<object>;
                    if (objects != null)
                    {
                        foreach (var obj in objects)
                        {
                            claimValue = obj as string;
                            if (claimValue != null)
                            {
                                claims.Add(new Claim(keyValuePair.Key, claimValue, ClaimValueTypes.String, issuer, issuer));
                                continue;
                            }

                            jtoken = obj as JToken;
                            if (jtoken != null)
                            {
                                AddDefaultClaimFromJToken(claims, keyValuePair.Key, jtoken, issuer);
                                continue;
                            }

                            // DateTime claims require special processing. JsonConvert.SerializeObject(obj) will result in "\"dateTimeValue\"". The quotes will be added.
                            if (obj is DateTime dateTimeValue)
                                claims.Add(new Claim(keyValuePair.Key, dateTimeValue.ToUniversalTime().ToString("o", CultureInfo.InvariantCulture), ClaimValueTypes.DateTime,
                                    issuer, issuer));
                            else
                                claims.Add(new Claim(keyValuePair.Key, JsonConvert.SerializeObject(obj), GetClaimValueType(obj), issuer, issuer));
                        }

                        continue;
                    }

                    IDictionary<string, object> dictionary = keyValuePair.Value as IDictionary<string, object>;
                    if (dictionary != null)
                    {
                        foreach (var item in dictionary)
                            claims.Add(new Claim(keyValuePair.Key, "{" + item.Key + ":" + JsonConvert.SerializeObject(item.Value) + "}", GetClaimValueType(item.Value), issuer,
                                issuer));

                        continue;
                    }

                    // DateTime claims require special processing. JsonConvert.SerializeObject(keyValuePair.Value) will result in "\"dateTimeValue\"". The quotes will be added.
                    if (keyValuePair.Value is DateTime dateTime)
                        claims.Add(new Claim(keyValuePair.Key, dateTime.ToUniversalTime().ToString("o", CultureInfo.InvariantCulture), ClaimValueTypes.DateTime, issuer, issuer));
                    else
                        claims.Add(new Claim(keyValuePair.Key, JsonConvert.SerializeObject(keyValuePair.Value), GetClaimValueType(keyValuePair.Value), issuer, issuer));
                }

                return claims;
            }
        }

        private static void AddClaimsFromJToken(List<Claim> claims, string claimType, JToken jtoken, string issuer)
        {
            if (jtoken.Type == JTokenType.Object)
            {
                claims.Add(new Claim(claimType, jtoken.ToString(Formatting.None), JsonClaimValueTypes.Json, issuer, issuer));
            }
            else if (jtoken.Type == JTokenType.Array)
            {
                var jarray = jtoken as JArray;
                foreach (var item in jarray)
                {
                    switch (item.Type)
                    {
                        case JTokenType.Object:
                            claims.Add(new Claim(claimType, item.ToString(Formatting.None), JsonClaimValueTypes.Json, issuer, issuer));
                            break;

                        // only go one level deep on arrays.
                        case JTokenType.Array:
                            claims.Add(new Claim(claimType, item.ToString(Formatting.None), JsonClaimValueTypes.JsonArray, issuer, issuer));
                            break;

                        default:
                            AddDefaultClaimFromJToken(claims, claimType, item, issuer);
                            break;
                    }
                }
            }
            else
            {
                AddDefaultClaimFromJToken(claims, claimType, jtoken, issuer);
            }
        }

        private static void AddDefaultClaimFromJToken(List<Claim> claims, string claimType, JToken jtoken, string issuer)
        {
            JValue jvalue = jtoken as JValue;
            if (jvalue != null)
            {
                // String is special because item.ToString(Formatting.None) will result in "/"string/"". The quotes will be added.
                // Boolean needs item.ToString otherwise 'true' => 'True'
                if (jvalue.Type == JTokenType.String)
                    claims.Add(new Claim(claimType, jvalue.Value.ToString(), ClaimValueTypes.String, issuer, issuer));
                // DateTime claims require special processing. jtoken.ToString(Formatting.None) will result in "\"dateTimeValue\"". The quotes will be added.
                else if (jvalue.Value is DateTime dateTimeValue)
                    claims.Add(new Claim(claimType, dateTimeValue.ToUniversalTime().ToString("o", CultureInfo.InvariantCulture), ClaimValueTypes.DateTime, issuer, issuer));
                else
                    claims.Add(new Claim(claimType, jtoken.ToString(Formatting.None), GetClaimValueType(jvalue.Value), issuer, issuer));
            }
            else
                claims.Add(new Claim(claimType, jtoken.ToString(Formatting.None), GetClaimValueType(jtoken), issuer, issuer));
        }

        internal static string GetClaimValueType(object obj)
        {
            if (obj == null)
                return JsonClaimValueTypes.JsonNull;

            var objType = obj.GetType();

            if (objType == typeof(string))
                return ClaimValueTypes.String;

            if (objType == typeof(int))
                return ClaimValueTypes.Integer;

            if (objType == typeof(bool))
                return ClaimValueTypes.Boolean;

            if (objType == typeof(double))
                return ClaimValueTypes.Double;

            if (objType == typeof(long))
            {
                long l = (long)obj;
                if (l >= int.MinValue && l <= int.MaxValue)
                    return ClaimValueTypes.Integer;

                return ClaimValueTypes.Integer64;
            }

            if (objType == typeof(DateTime))
                return ClaimValueTypes.DateTime;

            if (objType == typeof(JObject))
                return JsonClaimValueTypes.Json;

            if (objType == typeof(JArray))
                return JsonClaimValueTypes.JsonArray;

            return objType.ToString();
        }

        internal string GetStandardClaim(string claimType)
        {
            if (TryGetValue(claimType, out object value))
            {
                if (value == null)
                    return null;

                if (value is string str)
                    return str;

                return System.Text.Json.JsonSerializer.Serialize(value);
            }

            return null;
        }
    }
}
