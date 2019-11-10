using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WebApp_product.Models;

namespace WebApp_product
{
    public class AppDatabaseContext : DbContext
    {

        public AppDatabaseContext(DbContextOptions<AppDatabaseContext> options) : base(options)
        {            
        }

        public DbSet<Product> Products { get; set; }

        public IQueryable<Product> GetSortedQuery(int startIndex, int length, Product.SortType sortType, string searchName, int minPrice, int maxPrice)
        {
            int count = Products.Count();
            if (count == 0)
                return Products;
            if (startIndex >=  count|| startIndex<0)
                throw new IndexOutOfRangeException();
            if (count - startIndex < length)
                length = count - startIndex;

            IQueryable<Product> products;

            #region GetSortParams
            
            Expression<Func<Product, object>> sortSelector;
            switch (sortType)
            {
                case Product.SortType.name:
                case Product.SortType.nameDesc:
                    sortSelector = c => c._Name;
                    break;
                case Product.SortType.price:
                case Product.SortType.priceDesc:
                    sortSelector = c => c._Price;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }


            #endregion

            if (searchName == null)
                searchName = "";
            Expression<Func<Product, bool>> filterSelector = 
                x => x._Name.StartsWith(searchName) && (x._Price >= minPrice) && (x._Price <= maxPrice);// 

            if ((((int)sortType)%2)!=0)
                products = Products.Where(filterSelector).OrderByDescending(sortSelector).Skip(startIndex).Take(length);//
            else
                products = Products.Where(filterSelector).OrderBy(sortSelector).Skip(startIndex).Take(length);//
            List<Product> lili = products.ToList();
            return products;
        }        
    }
}