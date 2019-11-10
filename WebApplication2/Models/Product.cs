using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace WebApp_product
{

    [DataContract]
    public class Product
    {
        public enum SortType
        {
            name,
            nameDesc,
            price,
            priceDesc,
            unsorted
        }
        
        #region Constructs

        public Product(string name, string description, int price)
        {
            //todo дублировать валидацию из формы
            _Name = name;
            _Description = description;
            _Price = price;
        }

        #endregion                       
               
        

        #region Propertyes

        [DataMember]
        public long Id { get; set; }
        [DataMember]
        public string _Name { get; set; }
        public string _Description { get; set; }
        [DataMember]
        public int _Price { get; set; }

        #endregion



        #region Methods

        override public String ToString(){
            return _Name + "\";\"" + _Description + "\";\"" + _Price;
        }

        public override bool Equals(object obj)
        {
            Product o = (Product)obj;
            return _Name == o._Name && _Description == o._Description && _Price == o._Price;
        }

        static Product Parse(string val) {
            string[] value = val.Split("\";\"");
            Product entry = new Product(value[0], value[1], int.Parse(value[3])); 
            return entry;
        }

        internal static SortType parceSortType(string sortType)
        {
            
            for (int i = 0;i<(int)SortType.unsorted; i++) {
                if (((SortType)i).ToString() == sortType)
                    return ((SortType)i);
            }
            throw new FormatException("invalideSortType");
        }

        internal void setValye(Product updatedEntry)
        {
            _Name = updatedEntry._Name;
            _Description = updatedEntry._Description;
            _Price = updatedEntry._Price;
        }

        #endregion
    }
}
