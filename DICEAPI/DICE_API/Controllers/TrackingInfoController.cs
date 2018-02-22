using B2B.Dice.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace B2B.Dice.Api.Controllers
{
    public class TrackingInfoController : ApiController
    {
        public TrackingInfo Get()
        {
            return SampleData();
        }

        private TrackingInfo SampleData()
        {
            return new TrackingInfo
            {
                TrackingNumber = "9400111899223050136873",
                ExpectedDeliveryDate = DateTime.Now.AddDays(2),
                ProgressSteps = new List<ShippingProgessStep>
                {
                    new ShippingProgessStep                {                    Date=DateTime.Now,Location="ROUND ROCK, TX 78664",Status=ShippingStatus.Delivered.ToString()                },
                    new ShippingProgessStep                {                    Date=DateTime.Now,Location="ROUND ROCK, TX 78664",Status=ShippingStatus.OutForDelivery.ToString()                },
                    new ShippingProgessStep                {                    Date=DateTime.Now.AddDays(-1),Location="ROUND ROCK, TX 78664",Status=ShippingStatus.Shipped.ToString()           }


                }
            };
        }
    }
}
