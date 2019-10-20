using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;


namespace WebApp_product
{
    public class JWT
    {
        enum Roles
        {
            user = 1,
            moderator = (1 << 1) & user,
            admin = (1 << 2) & moderator,
        }

        private const string SECRET_KEY = "401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";
        internal readonly static byte[] ENCODED_SECRET_KEY = Encoding.UTF8.GetBytes(SECRET_KEY);
        public const string VALIDE_ISSUER = "ExampleIssuer";
        public const string VALIDE_AUDIENCE = "ExampleAudience";
        public const int LIFETIME_MINUTES = 30;
        public const string AUTH_SCHEME = JwtBearerDefaults.AuthenticationScheme;

        static Dictionary<string, string> accounts = new Dictionary<string, string>();
        static Dictionary<string, Roles> userRoles = new Dictionary<string, Roles>();
        static Dictionary<string, Claim> userIds = new Dictionary<string, Claim>();

        static JWT()
        {
            accounts.Add("admin", "admin");
            userIds.Add("admin", new Claim("user_id", "57dc51a3389b30fed1b13f91"));
            userRoles.Add("admin", Roles.admin);
        }

        internal static object GetJWT(string login, string password)
        {
            if (!accounts.Contains(new KeyValuePair<string, string>(login, password)))
                return null;

            var handler = new JwtSecurityTokenHandler();
            var securityKey = new SymmetricSecurityKey(ENCODED_SECRET_KEY);
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var Validity_period = DateTime.UtcNow.AddMinutes(30);

            var identity = GetIdentity(login, password);
            var jwt = new JwtSecurityToken(
                issuer: VALIDE_ISSUER,
                audience: VALIDE_AUDIENCE,
                notBefore: DateTime.UtcNow,
                claims: identity.Claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(LIFETIME_MINUTES)),
                signingCredentials: signingCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var token = handler.CreateJwtSecurityToken(subject: identity,
                                                       signingCredentials: signingCredentials,
                                                       audience: VALIDE_AUDIENCE,
                                                       issuer: VALIDE_ISSUER,
                                                       expires: Validity_period,
                                                       notBefore: DateTime.UtcNow
                                                       );
            var testToken = handler.WriteToken(token);
            if (encodedJwt != testToken)
                testToken = null;
            var response = new
            {
                access_token = encodedJwt,
                validity_period = Validity_period,
                username = login
            };
            return response;
        }

        private static ClaimsIdentity GetIdentity(string username, string password)
        {
            if (!accounts.Contains(new KeyValuePair<string, string>(username, password)))
                return null;
            var person = new { Login = username, Password = password };
            if (person != null)
            {
                userRoles.TryGetValue(username, out Roles role);
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, person.Login),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, role.ToString())
                };
                ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
                return claimsIdentity;
            }

            // если пользователя не найдено
            return null;
        }
    }
}