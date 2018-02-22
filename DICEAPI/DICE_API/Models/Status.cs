using System;

namespace B2B.Dice.Api.Models
{
    public class Status
    {
        public int ApplicationStep { get; set; }
        public string ApplicationStatus { get; set; }

        public string FailureText { get; set; }

        public DateTime LastUpdateTS { get; set; }

        public string TrackingNumber { get; set; }
    }


}