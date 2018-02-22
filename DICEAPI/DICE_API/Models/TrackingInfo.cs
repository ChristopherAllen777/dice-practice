using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace B2B.Dice.Api.Models
{
    public class TrackingInfo
    {
        public string TrackingNumber { get; set; }

        public DateTime ExpectedDeliveryDate { get; set; }

        public List<ShippingProgessStep> ProgressSteps { get; set; }
    }
}