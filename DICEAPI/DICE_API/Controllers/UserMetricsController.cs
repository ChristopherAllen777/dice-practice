using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace B2B.Dice.Api.Controllers
{
    public class UserMetricsController : BaseController
    {
        IServiceCaller serviceCaller;
        public UserMetricsController()
        {
            serviceCaller = new ServiceCaller();
        }

        public Task<string> Post(object metric)
        {
            var response = serviceCaller.PostUserMetric(metric);
            return response;
        }
    }
}
