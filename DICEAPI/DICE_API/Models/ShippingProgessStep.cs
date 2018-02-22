using System;

namespace B2B.Dice.Api.Models
{
    public class ShippingProgessStep
    {
        public DateTime Date { get; set; }
        public string Status { get; set; }

        public string Location { get; set; }
    }

    public enum ShippingStatus
    {
        Delivered,
        Shipped,
        OutForDelivery,
        ArrivedAtPostOffice
    }
}