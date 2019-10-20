using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebApp_product.Models
{
    public class ProductPageModel
    {
        public const int MAX_PAGE_LENGTH = 10;

        private int _id;
        public string _sortType;
        public IQueryable<Product> _entries;
        public int _currentPageNum;
        public int _pageCount;
        internal static ProductPageModel GetPageModel(int currentPageNum, AppDatabaseContext ctx, Product.SortType sortType, string searchName, int minPrice, int maxPrice)
        {
            
            var pageCount = ctx.Products.Count() / MAX_PAGE_LENGTH;
            if (ctx.Products.Count() % MAX_PAGE_LENGTH != 0)
                pageCount++;
            if (pageCount <= currentPageNum)
                return EMPTY_MODEL;
            ProductPageModel model = new ProductPageModel
            {
                _sortType = sortType.ToString(),
                _pageCount = pageCount,
                _currentPageNum = currentPageNum,
                _entries = ctx.GetSortedQuery(currentPageNum * MAX_PAGE_LENGTH, MAX_PAGE_LENGTH, sortType, searchName, minPrice, maxPrice)
            };

            return model;
        }
        internal static ProductPageModel GetPageModel(Product current)
        {
            ProductPageModel model = new ProductPageModel();
            var temp = new List<Product>
            {
                current
            };
            model._entries = temp.AsQueryable();
            return model;
        }

        static ProductPageModel EMPTY_MODEL = new ProductPageModel { _sortType = Product.SortType.name.ToString(), _pageCount = 0, _currentPageNum = 0, _entries = null, };

    }
    
}
