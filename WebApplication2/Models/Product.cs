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

        public Product(string name, string expandMore, int price)
        {
            //todo дублировать валидацию из формы
            Name = name;
            ExpandMore = expandMore;
            Price = price;
        }

        #endregion                       
               
        

        #region Propertyes

        [DataMember]
        public long Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        public string ExpandMore { get; set; }
        [DataMember]
        public int Price { get; set; }

        #endregion



        #region Methods

        override public String ToString(){
            return Name + "\";\"" + ExpandMore + "\";\"" + Price;
        }

        public override bool Equals(object obj)
        {
            Product o = (Product)obj;
            return Name == o.Name && ExpandMore == o.ExpandMore && Price == o.Price;
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
            Name = updatedEntry.Name;
            ExpandMore = updatedEntry.ExpandMore;
            Price = updatedEntry.Price;
        }

        #endregion
    }
}
