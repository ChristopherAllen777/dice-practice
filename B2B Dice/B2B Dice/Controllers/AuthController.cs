using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace B2B_Dice.Controllers
{
    public class AuthController : ApiController
    {
        [HttpGet]
        [Authorize]
        public string Get()
        {
            return User.Identity.Name;
        }
    }
}
