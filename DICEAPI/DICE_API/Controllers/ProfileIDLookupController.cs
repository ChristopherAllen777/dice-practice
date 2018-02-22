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
    public class ProfileIDLookupController : BaseController
    {
        IServiceCaller serviceCaller;
        public ProfileIDLookupController()
        {
            serviceCaller = new ServiceCaller();
        }



        public List<string> Get(string Id)
        {
            var result = new List<string>();
            serviceCaller.size = 100;
           
            var response = serviceCaller.SelectiveSearchForIdentity(Id);
            var objResult = JsonConvert.DeserializeObject<PurchaseOrderResult>(response.Result);
            foreach (var item in objResult.hits.hits)
            {
                if (!result.Contains(item._source.Identity))
                {
                    result.Add(item._source.Identity);

                }
            }
            return result;
        }
    }
}
