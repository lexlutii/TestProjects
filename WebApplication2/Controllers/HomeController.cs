using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApp_product.Controllers
{
    public class HomeController : Controller
    {
        // GET api/values
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("_ContainerLayout");
        }
    }
}
