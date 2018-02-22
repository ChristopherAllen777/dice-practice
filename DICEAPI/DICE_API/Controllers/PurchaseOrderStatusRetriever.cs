using B2B.Dice.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace B2B.Dice.Api.Controllers
{
    public class PurchaseOrderStatusRetriever : IPurchaseOrderStatusRetriever
    {
        POStatusResolver poStatusResolver;
        public PurchaseOrderStatusRetriever()
        {
            poStatusResolver = new POStatusResolver();
        }

        public List<PurchaseOrderProgressSteps> lstOfPurchaseOrderProgressSteps { get; set; }

        public List<PurchaseOrderProgressSteps> GetServiceStatus(string id, string service)
        {
            lstOfPurchaseOrderProgressSteps = new List<PurchaseOrderProgressSteps>();
            string result = GetAsync(id, service).Result;
            var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(result);

            var group = (from p in objResult.hits.hits.ToList()
                         where p._source.PONumber == id
                         group p by p._source.ThreadID into g
                         select new { ThreadId = g.Key, POResult = g.ToList() }).ToList();


            foreach (var item in group)
            {
                var poProgressSteps = new PurchaseOrderProgressSteps();
                poProgressSteps.PONumber = id;
                poProgressSteps.ThreadID = item.ThreadId;
                var status = poStatusResolver.GetPOStatus(item.POResult, service);
                poProgressSteps.lstOfSteps = poStatusResolver.GetListOfProgressSteps(service, status);
                lstOfPurchaseOrderProgressSteps.Add(poProgressSteps);

            }

            return lstOfPurchaseOrderProgressSteps;

        }


        public PurchaseOrderProgressSteps GetServiceStatus(string PONumber, string threadid, List<Hit> lstOfHits)
        {
            var poProgressSteps = new PurchaseOrderProgressSteps();
            poProgressSteps.ThreadID = threadid;
            poProgressSteps.PONumber = PONumber;
            poProgressSteps.ProfileID = lstOfHits.Select(x => x._source.Identity).FirstOrDefault();
            poProgressSteps.lstOfSteps = GetSteps(lstOfHits);

            return poProgressSteps;
        }

        public List<ProgressStep> GetSteps(List<Hit> poResult)
        {
            List<ProgressStep> result = new List<ProgressStep>();
            List<string> allSteps = new List<string>
            {
                CONSTANTS.B2BDIRECT,
                CONSTANTS.SubmittedPO,
                CONSTANTS.B2BServices,
                CONSTANTS.GCMP,
                CONSTANTS.Shipping
            };

            var selected = poResult.Where(x => x._type == CONSTANTS.gcmpstatus).ToList();
            var selectedB2BServices = poResult.Where(x => x._type == CONSTANTS.postatusfromb2bservicesstatus).ToList();
            var selectedSendPurchaseOrder = poResult.Where(x => x._type == CONSTANTS.sendPurchaseOrderstatus).ToList();
            var selectedSubmittedPODetails = poResult.Where(x => x._type == CONSTANTS.submittedpodetailsstatus).FirstOrDefault();
            var selectIncomingTransactions = poResult.Where(x => x._type == CONSTANTS.IncomingTransactionsLowerCase).FirstOrDefault();
            var OrderTrackingForElastic = poResult.Where(x => x._type == CONSTANTS.OrderTrackingForElastic).ToList();

            POStatus dsastatus = POStatus.NotStarted;
            if (OrderTrackingForElastic.Count > 0)
            {
                dsastatus = POStatus.InProgess;
                if (OrderTrackingForElastic.Any(x => !string.IsNullOrEmpty(x._source.OrderNumber)))
                {
                    dsastatus = POStatus.Successful;
                }
            }

            if (dsastatus == POStatus.Successful)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.DSA, dsastatus));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));

                return result;
            }


            if (selected != null && selected.Count != 0)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.GCMP, (selected.Any(x => (!string.IsNullOrEmpty(x._source.status)) && x._source.status.Equals("R", StringComparison.OrdinalIgnoreCase))
                    ? POStatus.Successful : GetGCMPStatus(selected))));
                result.Add(new ProgressStep(CONSTANTS.DSA, dsastatus));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));

                return result;
            }

            if (selectedB2BServices != null && selectedB2BServices.Count != 0)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, selectedB2BServices.Any(x => (!string.IsNullOrEmpty(x._source.POStatus)) && poStatusResolver.GetPOStatus(x._source.POStatus) == POStatus.Successful)
                    ? POStatus.Successful : POStatus.InProgess));
                result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.DSA, dsastatus));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));

                return result;
            }


            if (selectedSendPurchaseOrder != null && selectedSendPurchaseOrder.Count != 0)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.InProgess));
                result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.DSA, dsastatus));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));
                return result;
            }


            if (selectedSubmittedPODetails != null)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.DSA, dsastatus));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));
                return result;
            }


            result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
            result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.NotStarted));
            result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.NotStarted));
            result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
            result.Add(new ProgressStep(CONSTANTS.DSA, dsastatus));
            result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));

            return result;
        }


        private POStatus GetGCMPStatus(List<Hit> selected)
        {
            foreach (var item in selected)
            {
                if (item._source.status == "H")
                {
                    return POStatus.Hold;
                }
                else if (item._source.status == "R")
                {
                    return POStatus.Successful;
                }
            }
            return POStatus.InProgess;
        }
        public string GetStatusMessage(List<Hit> selectedB2BServices)
        {
            return selectedB2BServices.Count > 0 ? selectedB2BServices.FirstOrDefault()._source.POStatus : "";
        }
        public List<ProgressStepExcel> GetStepsForExcel(List<Hit> poResult, Hit selectedSendPurchaseOrder)
        {
            List<ProgressStepExcel> result = new List<ProgressStepExcel>();
            var identityobj = poResult.Where(x => !(string.IsNullOrEmpty(x._source.Identity))).FirstOrDefault();
            var identity = (identityobj != null) ? identityobj._source.Identity : "";
            result.Add(new ProgressStepExcel("ProfileID", identity));
            List<string> allSteps = new List<string>
            {
                CONSTANTS.B2BDIRECT,
                CONSTANTS.SubmittedPO,
                CONSTANTS.B2BServices,
                CONSTANTS.GCMP,
                CONSTANTS.Shipping
            };

            var selected = poResult.Where(x => x._type == CONSTANTS.gcmpstatus).ToList();
            var selectedB2BServices = poResult.Where(x => x._type == CONSTANTS.postatusfromb2bservicesstatus).ToList();
            //var selectedSendPurchaseOrder = poResult.Where(x => x._type == CONSTANTS.sendPurchaseOrderstatus).ToList();
            var selectedSubmittedPODetails = poResult.Where(x => x._type == CONSTANTS.submittedpodetailsstatus);
            var selectIncomingTransactions = poResult.Where(x => x._type == CONSTANTS.IncomingTransactionsLowerCase).FirstOrDefault();
            var ogcollectionData = poResult.Where(x => x._type == CONSTANTS.OGINFOCOLLECTOR).ToList();
            var OrderTrackingForElastic = poResult.Where(x => x._type == CONSTANTS.OrderTrackingForElastic).ToList();
            string dpid = GetDPID(selectedB2BServices);
            string orderId = GetOrderID(selected);

            var b2bStatus = (selectedB2BServices != null && selectedB2BServices.Count > 0) ? "SUCCESSFUL" : GetB2BServiceStatus(selectedB2BServices).ToString();
            var poItemCount = (selectedB2BServices != null && selectedB2BServices.Count > 0 && selectedB2BServices.Any(x => !string.IsNullOrEmpty(x._source.POItemCount))) ? selectedB2BServices.FirstOrDefault(x => !string.IsNullOrEmpty(x._source.POItemCount))._source.POItemCount : "";
            var b2bStatusMessage = GetStatusMessage(selectedB2BServices);

            if (string.IsNullOrEmpty(b2bStatusMessage))
            {
                b2bStatusMessage = GetStatusMessage(selectedSubmittedPODetails.ToList());
            }

            result.Add(new ProgressStepExcel("DPID", dpid));

            if (selectedSendPurchaseOrder != null)
            {

                result.Add(new ProgressStepExcel(CONSTANTS.B2B, b2bStatus));
                result.Add(new ProgressStepExcel(CONSTANTS.B2BMESSAGE, b2bStatusMessage));
                result.AddRange(GetLineItemSteps(selectedSendPurchaseOrder));
                if (selected != null && selected.Count != 0)
                {
                    result.Add(new ProgressStepExcel("POItemCount", poItemCount));
                    result.Add(new ProgressStepExcel(CONSTANTS.GCMP, !string.IsNullOrEmpty(orderId) ? "Successful" : GetGCMPStatus(selected).ToString()));
                    result.Add(new ProgressStepExcel(CONSTANTS.GCMPREASON, GetGCMPReason(selected)));
                }
                else
                {
                    result.Add(new ProgressStepExcel("POItemCount", ""));

                    result.Add(new ProgressStepExcel(CONSTANTS.GCMP, "NotStarted"));
                    result.Add(new ProgressStepExcel(CONSTANTS.GCMPREASON, ""));
                }
                result.AddRange(GetOGCollectionInfo(ogcollectionData));
                result.AddRange(GetOrderTrackingInfor(OrderTrackingForElastic));
                return result;

            }


            if (selected != null && selected.Count != 0)
            {
                result.Add(new ProgressStepExcel(CONSTANTS.B2B, "Successful"));
                result.Add(new ProgressStepExcel(CONSTANTS.B2BMESSAGE, b2bStatusMessage));
                result.AddRange(FillEmptyLineItems());
                result.Add(new ProgressStepExcel("POItemCount", poItemCount));

                result.Add(new ProgressStepExcel(CONSTANTS.GCMP, !string.IsNullOrEmpty(orderId) ? "Successful" : GetGCMPStatus(selected).ToString()));
                result.Add(new ProgressStepExcel(CONSTANTS.GCMPREASON, GetGCMPReason(selected)));
                result.AddRange(GetOGCollectionInfo(ogcollectionData));
                result.AddRange(GetOrderTrackingInfor(OrderTrackingForElastic));

                return result;
            }

            if (selectedB2BServices != null && selectedB2BServices.Count != 0)
            {

                result.Add(new ProgressStepExcel(CONSTANTS.B2B, !string.IsNullOrEmpty(dpid) ? "Successful" : "InProgress"));
                result.Add(new ProgressStepExcel(CONSTANTS.B2BMESSAGE, b2bStatusMessage));
                result.AddRange(FillEmptyLineItems());
                result.Add(new ProgressStepExcel("POItemCount", poItemCount));

                result.Add(new ProgressStepExcel(CONSTANTS.GCMP, "NotStarted"));
                result.Add(new ProgressStepExcel(CONSTANTS.GCMPREASON, ""));
                result.AddRange(GetOGCollectionInfo(ogcollectionData));
                result.AddRange(GetOrderTrackingInfor(OrderTrackingForElastic));
                return result;

            }



            if (selectedSubmittedPODetails != null && selectedSubmittedPODetails.Count() != 0)
            {
                result.Add(new ProgressStepExcel(CONSTANTS.B2B, "InProgress"));
                result.Add(new ProgressStepExcel(CONSTANTS.B2BMESSAGE, b2bStatusMessage));

                result.AddRange(FillEmptyLineItems());
                result.Add(new ProgressStepExcel("POItemCount", poItemCount));

                result.Add(new ProgressStepExcel(CONSTANTS.GCMP, "NotStarted"));
                result.Add(new ProgressStepExcel(CONSTANTS.GCMPREASON, ""));
                result.AddRange(GetOGCollectionInfo(ogcollectionData));
                result.AddRange(GetOrderTrackingInfor(OrderTrackingForElastic));
                return result;
            }


            result.Add(new ProgressStepExcel(CONSTANTS.B2B, "InProgress"));
            result.Add(new ProgressStepExcel(CONSTANTS.B2BMESSAGE, ""));
            result.AddRange(FillEmptyLineItems());
            result.Add(new ProgressStepExcel("POItemCount", poItemCount));

            result.Add(new ProgressStepExcel(CONSTANTS.GCMP, "NotStarted"));
            result.Add(new ProgressStepExcel(CONSTANTS.GCMPREASON, ""));


            return result;
        }

        private List<ProgressStepExcel> GetLineItemSteps(Hit selectedSendPurchaseOrder)
        {
            List<ProgressStepExcel> result = new List<ProgressStepExcel>();
            result.Add(new ProgressStepExcel("Line Item Number", selectedSendPurchaseOrder._source.ItemLineNumber));
            result.Add(new ProgressStepExcel("TotalLineNum", selectedSendPurchaseOrder._source.TotalLineNum));

            result.Add(new ProgressStepExcel("ManufacturePartNumber", selectedSendPurchaseOrder._source.ManufacturePartNum));
            result.Add(new ProgressStepExcel("Supplier Part Num", selectedSendPurchaseOrder._source.ParentQuoteID));

            result.Add(new ProgressStepExcel("BuyerPartNumber", selectedSendPurchaseOrder._source.BuyerPartNum));
            result.Add(new ProgressStepExcel("Item Description", selectedSendPurchaseOrder._source.ItemDescription));
            result.Add(new ProgressStepExcel("Quantity", selectedSendPurchaseOrder._source.Quantity));
            result.Add(new ProgressStepExcel("PO Unit Price", selectedSendPurchaseOrder._source.BuyerExpectedPrice));

            return result;
        }

        private List<ProgressStepExcel> GetOGCollectionInfo(List<Hit> ogCollectionData)
        {
            List<ProgressStepExcel> result = new List<ProgressStepExcel>();

            if (ogCollectionData.Count > 0)
            {
                result.Add(new ProgressStepExcel("ShippingMethod", ogCollectionData.FirstOrDefault()._source.OG_shippingChoice));
                result.Add(new ProgressStepExcel("PaymentMethod", ogCollectionData.FirstOrDefault()._source.OG_PaymentType));
            }
            else
            {
                result.Add(new ProgressStepExcel("ShippingMethod", ""));
                result.Add(new ProgressStepExcel("PaymentMethod", ""));
            }
            return result;

        }

        private List<ProgressStepExcel> GetOrderTrackingInfor(List<Hit> OrderTrackingForElasticData)
        {
            List<ProgressStepExcel> result = new List<ProgressStepExcel>();

            if (OrderTrackingForElasticData != null && OrderTrackingForElasticData.Count > 0)
            {
                //Test comment
                result.Add(new ProgressStepExcel("Ship To Company Name", OrderTrackingForElasticData.Select(x => (x != null && x._source != null) ? x._source.CompanyNumber : "").ToList()));
                result.Add(new ProgressStepExcel("OrderNumber", OrderTrackingForElasticData.Select(x => (x._source != null) ? x._source.OrderNumber : "").ToList()));
                result.Add(new ProgressStepExcel("OrderStatusCode", OrderTrackingForElasticData.Select(x => (x._source != null) ? x._source.OrderStatusCode : "").ToList()));
                result.Add(new ProgressStepExcel("CarrierName", OrderTrackingForElasticData.Select(x => (x._source != null) ? x._source.CarrierName : "").ToList()));
                result.Add(new ProgressStepExcel("TrackingNumber", OrderTrackingForElasticData.Select(x => (x._source != null) ? x._source.TrackingNumber : "").ToList()));
                result.Add(new ProgressStepExcel("EstimatedShipDateTime", OrderTrackingForElasticData.Select(x => (x._source != null) ? x._source.EstimatedShipDateTime : "").ToList()));
                result.Add(new ProgressStepExcel("EstimatedDeliveryDateTime", OrderTrackingForElasticData.Select(x => (x._source != null) ? x._source.EstimatedDeliveryDateTime : "").ToList()));
                result.Add(new ProgressStepExcel("ServiceTags", OrderTrackingForElasticData.Select(x => (x._source != null) ? x._source.ServiceTags : "").ToList()));
            }
            else
            {
                result.Add(new ProgressStepExcel("Ship To Company Name", ""));
                result.Add(new ProgressStepExcel("OrderNumber", ""));
                result.Add(new ProgressStepExcel("OrderStatusCode", ""));

                result.Add(new ProgressStepExcel("CarrierName", ""));
                result.Add(new ProgressStepExcel("TrackingNumber", ""));
                result.Add(new ProgressStepExcel("EstimatedShipDateTime", ""));
                result.Add(new ProgressStepExcel("EstimatedDeliveryDateTime", ""));
                result.Add(new ProgressStepExcel("ServiceTags", ""));

            }
            return result;
        }

        private List<ProgressStepExcel> FillEmptyLineItems()
        {
            List<ProgressStepExcel> result = new List<ProgressStepExcel>();
            result.Add(new ProgressStepExcel("Line Item Number", ""));
            result.Add(new ProgressStepExcel("ManufacturePartNumber", ""));
            result.Add(new ProgressStepExcel("Supplier Part Num", ""));

            result.Add(new ProgressStepExcel("BuyerPartNumber", ""));
            result.Add(new ProgressStepExcel("PO Unit Price", ""));
            result.Add(new ProgressStepExcel("ShippingMethod", ""));
            result.Add(new ProgressStepExcel("PaymentMethod", ""));
            return result;
        }

        //private List<ProgressStepExcel> FillEmptyCollectionInfo()
        //{
        //    List<ProgressStepExcel> result = new List<ProgressStepExcel>();
        //    result.Add(new ProgressStepExcel("ShippingMethod", ""));
        //    result.Add(new ProgressStepExcel("PaymentMethod", ""));
        //    return result;
        //}

        //private List<ProgressStepExcel> FillEmptyTrackingInfo()
        //{
        //    List<ProgressStepExcel> result = new List<ProgressStepExcel>();
        //    result.Add(new ProgressStepExcel("OrderNumber", ""));
        //    result.Add(new ProgressStepExcel("TrackingNumber", ""));
        //    result.Add(new ProgressStepExcel("EstimatedShipDateTime", ""));
        //    result.Add(new ProgressStepExcel("EstimatedDeliveryDateTime", ""));
        //    return result;
        //}


        private string GetGCMPReason(List<Hit> selected)
        {

            return selected.FirstOrDefault()._source.description;
        }

        private string GetOrderID(List<Hit> selected)
        {
            if (selected.Count > 0)
            {


                var hit = selected.Where(x => (!string.IsNullOrEmpty(x._source.status)) && x._source.status.Equals("R", StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
                return (hit != null && hit._score != null) ? hit._source.dpId : "";
            }
            else
                return "";
        }

        private string GetDPID(List<Hit> selectedB2BServices)
        {
            foreach (var item in selectedB2BServices)
            {
                if (item._source.POStatus.Contains("Success"))
                {
                    return item._source.POStatus.Split(' ').LastOrDefault();
                }
            }
            return "";
        }

        public PurchaseOrderProgressSteps GetServiceStatus(string PONumber, string threadid, string service, List<Hit> lstOfHits)
        {
            var poProgressSteps = new PurchaseOrderProgressSteps();
            poProgressSteps.ThreadID = threadid;
            poProgressSteps.PONumber = PONumber;
            poProgressSteps.ProfileID = lstOfHits.Select(x => x._source.Identity).FirstOrDefault();
            poProgressSteps.lstOfSteps = new List<ProgressStep>();

            switch (service)
            {
                case CONSTANTS.GCMPServiceStatus:
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.SubmittedPO, POStatus.Successful);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BServices, POStatus.Successful);
                    if (lstOfHits.Any(x => x._source.status == "R"))
                    {
                        poProgressSteps.lstOfSteps.Add(CONSTANTS.GCMP, POStatus.Successful);
                    }
                    else
                    {
                        poProgressSteps.lstOfSteps.Add(CONSTANTS.GCMP, POStatus.InProgess);
                    }

                    poProgressSteps.lstOfSteps.Add(CONSTANTS.Shipping, POStatus.NotStarted);

                    break;
                case CONSTANTS.postatusfromb2bservicesstatus:
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.SubmittedPO, POStatus.Successful);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BServices, GetB2BServiceStatus(lstOfHits));
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.GCMP, POStatus.NotStarted);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.Shipping, POStatus.NotStarted);

                    break;
                case CONSTANTS.sendPurchaseOrderstatus:
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.SubmittedPO, POStatus.Successful);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BServices, POStatus.InProgess);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.GCMP, POStatus.NotStarted);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.Shipping, POStatus.NotStarted);
                    break;
                case CONSTANTS.submittedpodetailsstatus:
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                    if (lstOfHits.Where(x => x._type == CONSTANTS.submittedpodetailsstatus).Count() > 0)
                    {
                        poProgressSteps.lstOfSteps.Add(CONSTANTS.SubmittedPO, POStatus.Successful);
                    }
                    else
                    {
                        poProgressSteps.lstOfSteps.Add(CONSTANTS.SubmittedPO, POStatus.NotStarted);
                    }
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BServices, POStatus.NotStarted);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.GCMP, POStatus.NotStarted);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.Shipping, POStatus.NotStarted);
                    break;

                case CONSTANTS.IncomingTransactionsLowerCase:
                    if (lstOfHits.Where(x => x._type == CONSTANTS.IncomingTransactionsLowerCase).Count() > 0)
                    {
                        poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                    }
                    else
                    {
                        poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BDIRECT, POStatus.NotStarted);
                    }
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.SubmittedPO, POStatus.NotStarted);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.B2BServices, POStatus.NotStarted);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.GCMP, POStatus.NotStarted);
                    poProgressSteps.lstOfSteps.Add(CONSTANTS.Shipping, POStatus.NotStarted);
                    break;
                default:
                    break;
            }

            return poProgressSteps;
            //var result = new List<PurchaseOrderProgressSteps>();



            //foreach (var item in lstOfHits)
            //{
            //    var poProgressSteps = new PurchaseOrderProgressSteps();
            //    poProgressSteps.ThreadID = item.ThreadId;
            //    poProgressSteps.PONumber = PONumber;
            //    var status = poStatusResolver.GetPOStatus(item.POResult, service);
            //    poProgressSteps.lstOfSteps = poStatusResolver.GetListOfProgressSteps(service, status);
            //    result.Add(poProgressSteps);

            //}

            //return result;

        }

        private POStatus GetB2BServiceStatus(List<Hit> lstOfHits)
        {
            var lst = lstOfHits.Where(x => x._type == CONSTANTS.postatusfromb2bservicesstatus).ToList();
            if (lst.Count() > 0)
            {
                if (lst.Where(x => x._source.POStatus.Contains("Success")).Count() > 0)
                {
                    return POStatus.Successful;
                }
                else if (lst.Where(x => x._source.POStatus.Contains("validation")).Count() > 0 || lst.Where(x => x._source.POStatus.Contains("error")).Count() > 0)
                {
                    return POStatus.Failure;
                }
                else if (lst.Where(x => x._source.POStatus.Contains("warning")).Count() > 0)
                {
                    return POStatus.Warning;
                }

                return POStatus.InProgess;
            }
            else
            {
                return POStatus.NotStarted;
            }

        }

        private string GetURI(string input)
        {
            return System.Configuration.ConfigurationManager.AppSettings[CONSTANTS.DiceEndPoint] + input;
        }

        private async Task<string> GetAsync(string id, string input)
        {
            string result = string.Empty;
            var uri = GetURI(input);
            var httpClient = new HttpClient();
            query query = new GetIndividualPurchaseOrder
            {
                match = new matchPONumber
                {
                    PONumber = id
                }
            };
            var json = JsonConvert.SerializeObject(new JsonObjectForPO { query = query });
            var respo = httpClient.PostAsJsonAsync(uri, json).Result;
            var response = httpClient.PostAsJsonAsync(uri, new JsonObjectForPO { query = query }).Result;
            //will throw an exception if not successful
            response.EnsureSuccessStatusCode();
            result = await response.Content.ReadAsStringAsync();
            return result;
        }


    }


}
