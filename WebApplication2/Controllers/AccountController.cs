using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApp_product.Controllers
{
    [Route ("login")]
    public class AccountController : Controller
    {

        private readonly IHttpContextAccessor _context;

        public AccountController(IHttpContextAccessor context)
        {
            _context = context;
        }

        [HttpGet("Login")]
        public ActionResult Login()
        {
            return View("_ContainerLayout");
        }

        [AllowAnonymous]
        [HttpPost("signin")]
        public ActionResult SignIn()
        {
            string userName = Request.Form["userName"];
            string password = Request.Form["password"];

            var tokenResponse = JWT.GetJWT(userName, password);
            
            if (tokenResponse != null)
            {
                Response.ContentType = "application/json";
                //await HttpContext.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
                return Json(tokenResponse, new JsonSerializerSettings { Formatting = Formatting.Indented });
            }
            else
                return Unauthorized();
            
        }

        [HttpPost("jwt")]
        public string LogOn() {
            object Person = Request.Body;
            string userName = Request.Form["userName"];
            string password = Request.Form["password"];
            return "get jwt worcs!";
        }
        
    }
}
