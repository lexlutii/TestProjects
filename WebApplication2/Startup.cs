using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace WebApp_product
{
    public class Startup
    {
        const string CONNECTION_STRING = "Data Source=George-PC\\SQLEXPRESS;Initial Catalog=WebApp_product.AppDatabaseContext;User ID=sa;Password=qwerty12345;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
        internal static bool IS_DEVELOPMENT = true;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDatabaseContext>(o => o.UseSqlServer(CONNECTION_STRING));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);


            services.AddMvcCore().AddAuthorization();


            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();


            var key = JWT.ENCODED_SECRET_KEY;

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = JWT.VALIDE_ISSUER,
                ValidateAudience = true,
                ValidAudience = JWT.VALIDE_AUDIENCE,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromSeconds(5)
            };

            services.AddAuthentication(options =>
                {
                    options.DefaultScheme = JWT.AUTH_SCHEME;
                    options.DefaultChallengeScheme = JWT.AUTH_SCHEME;
                }
            ).AddJwtBearer(JWT.AUTH_SCHEME, options =>
                {
                    options.TokenValidationParameters = tokenValidationParameters;
                    options.SaveToken = true;
                }
            );

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware();
            }
            else
            {
                app.UseHsts();
            }


            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "DefaultApi",
                    template: "api/{controller}/{action}");
                routes.MapSpaFallbackRoute("spa-fallback", new { controller = "Home", action = "Index" });
            });

        }
    }
}
