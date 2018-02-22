using B2B.Dice.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace B2B.Dice.Api.Controllers
{
    public class UserProfileController : BaseController
    {
        IServiceCaller serviceCaller;
        public UserProfileController()
        {
            serviceCaller = new ServiceCaller();
        }

        [HttpGet]
        public Profile Get(string profileId)
        {
            var result = new Profile();

            var response = serviceCaller.SearchForUserProfile(profileId);
            var objResult = JsonConvert.DeserializeObject<ProfileResult>(response.Result);
            if (objResult != null && objResult.hits != null && objResult.hits.hits != null
                && objResult.hits.hits.Count > 0)
            {
                result = objResult.hits.hits[0]._source;
            }
            else
            {
                result.ProfileID = profileId;
                result.Role = "user";
                result.LastUpdate = DateTime.Now;
                result.DashboardUrls = new string[0];
                Post(result);
            }
            return result;
        }

        public Task<string> Post(Profile profile)
        {
            var recordId = "";
            var response = serviceCaller.SearchForUserProfile(profile.ProfileID);
            var objResult = JsonConvert.DeserializeObject<ProfileResult>(response.Result);
            if (objResult != null && objResult.hits != null && objResult.hits.hits != null
                && objResult.hits.hits.Count > 0)
            {
                recordId = objResult.hits.hits[0]._id;
            }

            response = serviceCaller.UpdateUserProfile(profile, recordId);
            return response;
        }
    }
}