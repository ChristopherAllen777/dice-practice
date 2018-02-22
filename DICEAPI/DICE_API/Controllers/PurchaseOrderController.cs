using B2B.Dice.Api.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace B2B.Dice.Api.Controllers
{

    public class PurchaseOrderController : BaseController
    {
        IServiceCaller serviceCaller;
        bool ifOnlyCustomer = false;

        public PurchaseOrderController()
        {
            serviceCaller = new ServiceCaller { size = 100 };

        }

        public List<string> Get()
        {            
            var response = serviceCaller.GetPurchaseOrdersAsync();
            var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);
            if (objResult != null && objResult.hits != null & objResult.hits.hits != null)
            {
              
                return objResult.hits.hits.Where(x => !string.IsNullOrEmpty(x._source.PONumber)).Select(x => x._source.PONumber).ToList();
            }
            else
                return new List<string>();
        }

        [HttpPost]
        public PurchaseOrdersWithTotal Post(ExportToExcelInput input)
        {
            //var response = serviceCaller.GetPOS(input,new List<string> { "PONumber"});
            //var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);
            //if (objResult != null && objResult.hits != null & objResult.hits.hits != null)
            //{

            //    return objResult.hits.hits.Where(x => !string.IsNullOrEmpty(x._source.PONumber)).Select(x => x._source.PONumber).ToList();
            //}
            //else
            //    return new List<string>();

            serviceCaller.size =input.Size ;
            serviceCaller.from = input.Page;
            PurchaseOrdersWithTotal result = new PurchaseOrdersWithTotal();
            int total;
            result.lst = GetList(input.StartDate,input.EndDate, input.CustomerNumber, out total);
            result.total = total;
            return result;
        }

        public PurchaseOrdersWithTotal Get(string startDate, string EndDate, string customerNumber, int size = 100, int page = 0)
        {
            serviceCaller.size = size;
            serviceCaller.from = page;
            PurchaseOrdersWithTotal result = new PurchaseOrdersWithTotal();
            int total;
            result.lst = GetList(startDate, EndDate, customerNumber, out total);
            result.total = total;
            return result;
        }
        private List<string> GetList(string startDate, string EndDate, string customerNumber, out int total)
        {
            var response = serviceCaller.GetPurchaseOrdersAsync(startDate, EndDate, customerNumber);
            var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);

            if (objResult != null && objResult.hits != null & objResult.hits.hits != null)
            {
                total = objResult.hits.total;
                if (!ifOnlyCustomer)
                    return objResult.hits.hits.Select(x => x._source.PONumber).ToList();
                else
                    return objResult.hits.hits.Where(x => x._source.CustomerNo.ToString().Contains(customerNumber)).Select(x => x._source.PONumber).ToList();
            }
            else
            {
                total = 0;
                return new List<string>();
            }
        }

        public PurchaseOrderWithTotal Get(string id)
        {
            PurchaseOrderWithTotal result = new PurchaseOrderWithTotal();
            PurchaseOrderStatusRetriever pos = new PurchaseOrderStatusRetriever();

            var lstresult = new List<PurchaseOrderProgressSteps>();
            var allResults = serviceCaller.SearchForGivenInput(id, "PONumber");
            var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(allResults.Result);

            if (objResult != null && objResult.hits != null & objResult.hits.hits != null)
            {
                int total = objResult.hits.total;
                allResults = serviceCaller.SearchForGivenInput(id, "PONumber", total);
                objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(allResults.Result);

                if (objResult != null && objResult.hits != null & objResult.hits.hits != null)
                {
                    var threadGroup = (from p in objResult.hits.hits.ToList()
                                       where p._source.PONumber == id
                                       group p by p._source.ThreadID into g
                                       select new { threadid = g.Key, POResult = g.ToList() }).ToList();

                    foreach (var item in threadGroup)
                    {
                        var lstOfItems = item.POResult;
                        var localResult = pos.GetServiceStatus(id, item.threadid, lstOfItems);
                        lstresult.Add(localResult);
                    }
                    lstresult.Where(x => x.ThreadID != null).ToList();
                    result.lst = lstresult;
                    result.total = objResult.hits.total;
                }
            }
            return result;
        }

    }

}
