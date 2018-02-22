using System;

namespace B2B.Dice.Api.Models
{
    public class PurchaseOrder
    {
        public string PONumber;
        public float OrderAmount;
        public string Date;

        public DateTime OrderDate
        {
            get
            {
                DateTime dt = DateTime.MinValue;

                if (!string.IsNullOrEmpty(Date))
                {
                    DateTime.TryParse(Date, out dt);

                }
                return dt;
            }
        }


        public long CustomerNo { get; set; }

        //public Status Status { get; set; }
        public string status { get; set; }
        public string description { get; set; }
        public string BuyerPartNum { get; set; }
        public string ManufacturePartNum { get; set; }
        public string ItemDescription { get; set; }
        public string Currency { get; set; }
        public string BuyerExpectedPrice { get; set; }
        public string UnitOfMeasure { get; set; }
        public string OrderID { get; set; }
        public string OG_shippingChoice { get; set; }
        public string OG_PaymentType { get; set; }
        public string OrderNumber { get; set; }
        public string TrackingNumber { get; set; }
        public string EstimatedShipDateTime { get; set; }
        public string EstimatedDeliveryDateTime { get; set; }
        public string Quantity { get; set; }
        public string CompanyNumber { get; set; }
        public string ServiceTags { get; set; }

        public string dpId { get; set; }
        public string    CarrierName { get;  set; }
        public string ParentQuoteID { get;   set; }
        public string OrderStatusCode { get;  set; }
        public string POItemCount { get;  set; }
        public string TotalLineNum { get;  set; }

        public string Identity;

        public string POStatus;

        public string ThreadID;
        public string ProfileDescription;
        public string ItemLineNumber;

    }
}
