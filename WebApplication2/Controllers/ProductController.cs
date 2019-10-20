using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nancy.Json;
using WebApp_product.Models;

namespace WebApp_product.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : Controller
    {
        private AppDatabaseContext _ctx;
        public ProductController(AppDatabaseContext ctx) => _ctx = ctx;

        [HttpGet("base/{pageIndex}")]
        [AllowAnonymous]
        public ActionResult GetPage(int pageIndex)
        {
            var keys = Request.Query.Keys;
            string sortType = Request.Query["sortType"];
            string searchName = Request.Query["searchName"];
            int minPrice, maxPrice;

            try { 
                minPrice = ParcePositiveNumber("minPrice", 0);
                maxPrice = ParcePositiveNumber("maxPrice", int.MaxValue);
            }
            catch(FormatException)
            {
                return StatusCode(452);
            }

            if (minPrice > maxPrice)
                return StatusCode(452);

            if (sortType == null)
                sortType = "name";

            ProductPageModel pageModel;
            try
            {
                Product.SortType SortType = Product.parceSortType(sortType);
                pageIndex--;
                pageModel = ProductPageModel.GetPageModel(pageIndex, _ctx, SortType, searchName, minPrice, maxPrice);
            }
            catch (FormatException)
            {
                return StatusCode(452);
            }
            catch (IndexOutOfRangeException)
            {
                return StatusCode(404);
            }
            return Json(pageModel);
        }

        private int ParcePositiveNumber( string paramName, int defaultValue)
        {
            int number = -1;
            number = defaultValue;
            string maxPriceString = Request.Query[paramName];
            if (maxPriceString != null && maxPriceString != "")
                number = int.Parse(maxPriceString);
            if (number < 0)
                number = defaultValue;
            return number;
        }

        [HttpGet("readSingle/{ID}")]
        [AllowAnonymous]
        public ActionResult GetProduct(int ID)
        {
            Product current = _ctx.Products.Find((long)ID);
            if (current == null)
                return StatusCode(404);

            var response = new
            {
                id = current.Id,
                name = current.Name,
                expandMore = current.ExpandMore,
                price = current.Price
            };
           
            return Json(response);
        }

        [HttpPost("update/{ID}")]
        [Authorize]
        public ActionResult UpdateProduct(long Id)
        {
            Product currentEntry;
            try { currentEntry = GetProductFromRequest(); }
            catch (FormatException) { return StatusCode(452); }



            var dbEntry = _ctx.Products.Where(e => e.Id == Id).FirstOrDefault();
            if (dbEntry == null)
                return StatusCode(404);
            if (_ctx.Products.Count(x => x.Equals(currentEntry))!=0)
            {
                var result = new JsonResult("Обновлённая запись совпадает с уже существующей");
                result.StatusCode = 452;
                return StatusCode(452);
            }

            dbEntry.setValye(currentEntry);
            _ctx.SaveChanges();
            return StatusCode(200);
        }
        
        [HttpPost("new_product")]
        [Authorize]
        public ActionResult AddProduct()
        {
            Product currentEntry;
            try{  currentEntry = GetProductFromRequest(); }
            catch (FormatException) { return StatusCode(452); }
            
            if (_ctx.Products.Count(x => x.Equals(currentEntry)) != 0) {
                var result = new JsonResult("Запись уже существует в базе данных");
                result.StatusCode = 452;
                return StatusCode(452);
            }

            _ctx.Products.Add(currentEntry);
            _ctx.SaveChanges();
            return StatusCode(201);
        }
        
        [HttpDelete("remove_product/{Id}")]
        [Authorize]
        public ActionResult DeleteProduct(long Id) {
            Product employe = _ctx.Products.Find(Id);
            if (employe != null)
            {
                _ctx.Products.Remove(employe);
                _ctx.SaveChanges();
                return StatusCode(200);
            }
            else return StatusCode(404);
        }

        private Product GetProductFromRequest()
        {
            Product currentEntry = null;
                string name = Request.Form["name"];
                string expandmore = Request.Form["expandmore"];
                int price = int.Parse(Request.Form["price"]);
                currentEntry = new Product(name, expandmore, price);
            
            return currentEntry;
        }

        private bool IsErrorResult(JsonResult jsonExceptionResult, Product product, out ActionResult errorResult)
        {
            errorResult = null;
            if (jsonExceptionResult != null)
                if (Startup.IS_DEVELOPMENT)
                    errorResult = jsonExceptionResult;
                else errorResult = StatusCode(500);
            else if (product == null)
                    errorResult = StatusCode(400);
            return errorResult != null;
        }
    }
}
