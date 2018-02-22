using B2B.Dice.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace B2B.Dice.Api.Controllers
{
    public class ExportToExcelController : ApiController
    {
        POStatusResolver poStatusResolver;
        IServiceCaller serviceCaller;
        IPurchaseOrderStatusRetriever purchaseOrderStatusRetriever;

        public ExportToExcelController()
        {
            purchaseOrderStatusRetriever = new PurchaseOrderStatusRetriever();
            poStatusResolver = new POStatusResolver();
            serviceCaller = new ServiceCaller { size = 100 };
        }

        public ExportToExcelController(IServiceCaller _serviceCaller)
        {
            poStatusResolver = new POStatusResolver();
            serviceCaller = _serviceCaller;
        }

        [HttpGet]
        public string Get()
        { return "Test"; }



        [HttpPost]
        public ExcelResult Post(ExportToExcelInput input)
        {
            try
            {

                string startDate = input.StartDate;
                string endDate = input.EndDate;
                string customerNumber = input.CustomerNumber;
                int size = input.Size == 0 ? 100 : input.Size;
                int page = input.Page;
                string threadID = !(string.IsNullOrEmpty(input.ThreadId)) ? input.ThreadId : "";
                string poNumber = !(string.IsNullOrEmpty(input.PONumber)) ? input.PONumber : "";

                serviceCaller.size = size;
                serviceCaller.from = page;

                ExcelResult result = new ExcelResult();
                var lstResult = new List<GetExcelResult>();

                var pos = serviceCaller.GetPOS(input);
                var poNumbersSource = JsonConvert.DeserializeObject<PurchaseOrderResult>(pos.Result);
                var poNumbers = poNumbersSource.hits.hits.Where(x => x._source.ThreadID != null).Select(x => x._source.ThreadID).ToList();
                result.Total = poNumbersSource.hits.total;
                var response = serviceCaller.SearchForGivenInput(startDate, endDate, customerNumber, poNumbers, threadID: threadID);
                var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);
                if (objResult != null && objResult.hits != null & objResult.hits.hits != null)
                {
                    //int total = objResult.hits.total;
                    //response = serviceCaller.SearchForGivenInput(startDate, endDate, customerNumber, poNumbers, total);
                    //objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);
                    if (objResult != null && objResult.hits != null & objResult.hits.hits != null)
                    {
                        var group = (from p in objResult.hits.hits.ToList()

                                         //where string.IsNullOrEmpty(id) || p._source.Identity.Contains(id)
                                     group p by new { p._source.ThreadID, p._source.PONumber } into g
                                     select new { ThreadId = g.Key.ThreadID, PONumber = g.Key.PONumber, POResult = g.ToList() }).ToList();

                        foreach (var item in group)
                        {
                            if (!string.IsNullOrEmpty(input.PONumber))
                            {
                                if (!item.PONumber.Equals(input.PONumber, StringComparison.OrdinalIgnoreCase))
                                {
                                    break;
                                }
                            }


                            var selectedSendPurchaseOrder = item.POResult.Where(x => x._type == CONSTANTS.sendPurchaseOrderstatus).ToList();
                            var date = item.POResult.Max(x => x._source.Date);

                            if (selectedSendPurchaseOrder != null && selectedSendPurchaseOrder.Count > 0)
                            {
                                foreach (var sendPO in selectedSendPurchaseOrder)
                                {


                                    var lstOfSteps = purchaseOrderStatusRetriever.GetStepsForExcel(item.POResult.ToList(), sendPO);

                                    lstResult.Add(new GetExcelResult
                                    {

                                        lstOfSteps = lstOfSteps,
                                        PONumber = item.PONumber,
                                        ThreadID = item.ThreadId,
                                        Date = date
                                    });
                                }
                            }
                            else
                            {
                                var lstOfSteps = purchaseOrderStatusRetriever.GetStepsForExcel(item.POResult.ToList(), null);

                                lstResult.Add(new GetExcelResult
                                {

                                    lstOfSteps = lstOfSteps,
                                    PONumber = item.PONumber,
                                    ThreadID = item.ThreadId,
                                    Date = date
                                });
                            }
                        }
                        //result.Total = objResult.hits.total;
                        result.lst = lstResult;
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                return new ExcelResult { Message = ex.Message + Environment.NewLine + ex.StackTrace };
                //System.IO.File.AppendAllText(@"E:\inetpub\wwwroot\b2bdiceapiprod\bin\\ErrorText.txt", ex.Message + DateTime.Now + Environment.NewLine);
                // throw;
            }

        }

        private List<ProgressStep> GetSteps(List<Hit> poResult)
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

            var selected = poResult.Where(x => x._type == CONSTANTS.GCMPServiceStatus).ToList();
            var selectedB2BServices = poResult.Where(x => x._type == CONSTANTS.postatusfromb2bservicesstatus).ToList();
            var selectedSendPurchaseOrder = poResult.Where(x => x._type == CONSTANTS.sendPurchaseOrderstatus).ToList();
            var selectedSubmittedPODetails = poResult.Where(x => x._type == CONSTANTS.submittedpodetailsstatus).FirstOrDefault();
            var selectIncomingTransactions = poResult.Where(x => x._type == CONSTANTS.IncomingTransactionsLowerCase).FirstOrDefault();


            if (selected != null && selected.Count != 0)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, (selectIncomingTransactions != null ? POStatus.Successful : POStatus.NotStarted)));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, (selectedSubmittedPODetails != null) ? POStatus.Successful : POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, (selectedB2BServices != null) ? POStatus.Successful : POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.GCMP, (selected.Any(x => (!string.IsNullOrEmpty(x._source.status)) && x._source.status.Equals("H", StringComparison.OrdinalIgnoreCase))
                    ? POStatus.Successful : POStatus.InProgess)));

                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));

                return result;
            }

            if (selectedB2BServices != null && selectedB2BServices.Count != 0)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, selectedB2BServices.Any(x => (!string.IsNullOrEmpty(x._source.status)) && poStatusResolver.GetPOStatus(x._source.status) == POStatus.Successful)
                    ? POStatus.Successful : POStatus.InProgess));
                result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));

                return result;
            }


            if (selectedSendPurchaseOrder != null && selectedSendPurchaseOrder.Count != 0)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.InProgess));
                result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));
                return result;
            }


            if (selectedSubmittedPODetails != null)
            {
                result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.Successful));
                result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
                result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));
                return result;
            }


            result.Add(new ProgressStep(CONSTANTS.B2BDIRECT, POStatus.Successful));
            result.Add(new ProgressStep(CONSTANTS.SubmittedPO, POStatus.NotStarted));
            result.Add(new ProgressStep(CONSTANTS.B2BServices, POStatus.NotStarted));
            result.Add(new ProgressStep(CONSTANTS.GCMP, POStatus.NotStarted));
            result.Add(new ProgressStep(CONSTANTS.Shipping, POStatus.NotStarted));

            return result;
        }



    }


}
