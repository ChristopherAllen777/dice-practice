using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace B2B.Dice.Api.Models
{
    [DataContract]
    public class AdditionalDetails
    {
        internal string POItemCount;

        [DataMember]
        public string description { get; set; }
        [DataMember]
        public string threadID { get; set; }
        [DataMember]
        public string PONumber { get; set; }

        [DataMember]
        public string ProfileDescription { get; set; }

        [DataMember]
        public string POStatus { get; set; }


        [DataMember]
        public string Type { get; set; }
        [DataMember]

        public string ManufacturePartNum { get; internal set; }
        [DataMember]

        public string BuyerPartNum { get; internal set; }
        [DataMember]

        public string ItemDescription { get; internal set; }
        [DataMember]

        public string Currency { get; internal set; }
        [DataMember]

        public string BuyerExpectedPrice { get; set; }
        [DataMember]

        public string UnitOfMeasure { get; set; }
        [DataMember]

        public string OrderNumber { get; set; }
        [DataMember]

        public string Quantity { get; set; }
        [DataMember]

        public string OrderStatusCode { get; set; }
        [DataMember]


        public string TotalLineNum { get; set; }
        [DataMember]

        public string TrackingNumber { get; set; }
    }
}