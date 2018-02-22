using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using B2B.Dice.Api.Controllers;
using System.Runtime.Serialization;

namespace B2B.Dice.Api.Models
{

    [DataContract]
    public class ProgressStep
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public POStatus POStatus { get; set; }

        public ProgressStep(string name, POStatus postatus)
        {
            this.Name = name;
            this.POStatus = postatus;
        }
    }

    public class ProgressStepBase
    {
    }

    public enum POStatus
    {
        NotStarted, Failure, InProgess, Successful,
        Warning,Hold
    }
}