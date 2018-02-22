using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace B2B.Dice.Api.Models
{
    public class Profile
    {
        public string ProfileID { get; set; }
        public DateTime LastUpdate { get; set; }
        public string Role { get; set; }
        public string[] DashboardUrls { get; set; }
    }
}