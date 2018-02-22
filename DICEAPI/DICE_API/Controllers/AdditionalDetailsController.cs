using B2B.Dice.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace B2B.Dice.Api.Controllers
{
    public class AdditionalDetailsController : BaseController
    {
        IServiceCaller serviceCaller;
        public AdditionalDetailsController()
        {
            serviceCaller = new ServiceCaller();
        }
        public List<AdditionalDetails> Get(string threadID, string step, string PONumber = "")
        {
            var result = new List<AdditionalDetails>();
            serviceCaller.size = 100;

            switch (step)
            {
                case CONSTANTS.B2BServices:
                    result.AddRange(GetAdditionalDetails(threadID, CONSTANTS.postatusfromb2bservicesstatus));
                    result.AddRange(GetAdditionalDetails(threadID, CONSTANTS.sendPurchaseOrderstatus));
                    break;

                case CONSTANTS.SubmittedPO:
                    result.AddRange(GetAdditionalDetails(threadID, CONSTANTS.submittedpodetailsstatus));
                    break;
                case CONSTANTS.GCMP:
                    result.AddRange(GetAdditionalDetails(threadID, CONSTANTS.gcmpstatus));                    
                    break;
                case CONSTANTS.DSA:
                    result.AddRange(GetAdditionalDetails(threadID, CONSTANTS.OrderTrackingForElastic));
                    break;
                case CONSTANTS.Shipping:
                    break;
                default:
                    result.AddRange(GetAdditionalDetails(threadID, PONumber, CONSTANTS.IncomingTransactions));
                    break;
            }


            return result;
        }

        private List<AdditionalDetails> GetAdditionalDetails(string threadId, string step)
        {
            var result = new List<AdditionalDetails>();

            var response = serviceCaller.GetAdditionalDetails(threadId, step);
            var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);

            foreach (var item in objResult.hits.hits.Where(x => x._source.ThreadID == threadId))
            {
                result.Add(new AdditionalDetails
                {
                    threadID = item._source.ThreadID,
                    PONumber = item._source.PONumber,
                    OrderNumber = item._source.OrderNumber,
                    TrackingNumber = item._source.TrackingNumber,
                    TotalLineNum = item._source.TotalLineNum,
                    POItemCount = item._source.POItemCount,
                    OrderStatusCode = item._source.OrderStatusCode,
                    Quantity = item._source.Quantity,
                    description = item._source.description,
                    POStatus = item._source.POStatus,
                    ProfileDescription = item._source.ProfileDescription,

                    Type = item._type,
                    ManufacturePartNum = item._source.ManufacturePartNum,
                    BuyerPartNum = item._source.BuyerPartNum,
                    ItemDescription = item._source.ItemDescription,
                    Currency = item._source.Currency,
                    BuyerExpectedPrice = item._source.BuyerExpectedPrice,
                    UnitOfMeasure = item._source.UnitOfMeasure,
                });
            }
            return result;
        }

        private List<AdditionalDetails> GetAdditionalDetails(string threadId, string poNum, string step)
        {
            var result = new List<AdditionalDetails>();

            var response = serviceCaller.SearchForGivenInput(poNum, "PONumber");
            var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);

            foreach (var item in objResult.hits.hits.Where(x => x._source.ThreadID == threadId))
            {
                result.Add(new AdditionalDetails
                {
                    threadID = item._source.ThreadID,
                    PONumber = item._source.PONumber,

                    description = item._source.description,
                    POStatus = item._source.POStatus,
                    ProfileDescription = item._source.ProfileDescription,

                    Type = item._type,
                    ManufacturePartNum = item._source.ManufacturePartNum,
                    BuyerPartNum = item._source.BuyerPartNum,
                    ItemDescription = item._source.ItemDescription,
                    Currency = item._source.Currency,
                    BuyerExpectedPrice = item._source.BuyerExpectedPrice,
                    UnitOfMeasure = item._source.UnitOfMeasure,
                });
            }
            return result;
        }
    }


}
