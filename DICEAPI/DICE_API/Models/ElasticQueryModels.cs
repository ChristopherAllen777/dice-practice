using Newtonsoft.Json;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace B2B.Dice.Api.Models
{


    public class GetCustomerResult
    {
        public List<ProgressStep> lstOfSteps { get; set; }

        public string Date { get; set; }
        public string PONumber { get; set; }
        public string ThreadID { get; set; }
        public string ProfileID { get; set; }
    }

    [DataContract]
    public class ProgressStepExcel
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string POStatus { get; set; }

        public ProgressStepExcel(string name, string postatus)
        {
            this.Name = name;
            this.POStatus = postatus;
        }
        public ProgressStepExcel(string name, List<string> postatus)
        {

            this.Name = name;
            if (postatus != null && postatus.Count > 0)
            {
                postatus.ForEach(x =>
                {
                    if (!string.IsNullOrEmpty(this.POStatus))
                    {
                        if (!this.POStatus.Contains(x))
                        {
                            this.POStatus += x + ";";
                        }
                    }
                    else
                    {
                        this.POStatus = x;
                    }
                });
            }
            else
            {
                this.POStatus = "";
            }
        }
    }
    public class GetExcelResult
    {
        public List<ProgressStepExcel> lstOfSteps { get; set; }

        public string Date { get; set; }
        public string PONumber { get; set; }
        public string ThreadID { get; set; }
        public string ProfileID { get; set; }
    }
    public class matchshow
    {
        public match match { get; set; }
    }

    internal class QueryWithMust : query
    {
        [JsonProperty("bool")]
        public boolInMust boole { get; set; }
    }

    internal class boolInMust
    {
        public List<matchshow> must { get; set; }
    }



    public class PurchaseOrderProgressSteps
    {
        public List<ProgressStep> lstOfSteps { get; set; }

        public string PONumber { get; set; }
        public string ThreadID { get; set; }
        public string ThreadId { get; set; }

        public string ProfileID { get; set; }
    }

    public class querywithbool
    {
        [JsonProperty("bool")]
        public boolWithMustNot boole { get; set; }
    }

    public class boolWithMustNot
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<object> must { get; set; }

        public List<object> must_not { get; set; }
    }

    public class matchOrRangeForMatch
    {
        public matchIdentity match_phrase_prefix { get; set; }
    }

    public class matchOrRangeForRange
    {
        public range range { get; set; }
    }

    public class boole
    {
        public List<object> must { get; set; }

    }
    public class booleWithMust
    {
        public List<object> must { get; internal set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]

        public List<object> should { get; internal set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<object> must_not { get; internal set; }

        public object filter { get; set; }
    }
    public class queryWithMatchAndRange : query
    {
        [JsonProperty("bool")]
        public boole boole { get; set; }
    }

    public class queryWithBoolMust : query
    {


        [JsonProperty("bool")]
        public booleWithMust boole { get; set; }

    }

    public class JsonObjectForPO
    {
        public JsonObjectForPO()
        {
            size = 100;
        }
        public object query { get; set; }
        public int size { get; set; }
        public int from { get; set; }

    }



    public class query
    {

    }


    public class GetIndividualPurchaseOrder : query
    {
        public match match { get; set; }

    }

    public class GetPurchaseOrdersQuery : query
    {
        public range range { get; set; }
    }
    public class JsonObjectWithSort
    {
        public List<SortField> sort { get; internal set; }
    }


    public class SortField
    {
        public OrderDate Date { get; set; }
    }
    public class SortFieldWithThreadId
    {
        public string ThreadID { get; set; }
    }
    public class SortFieldWithPONumber
    {
        public string PONumber { get; set; }
    }
    public class OrderDate
    {
        public string order { get; set; }
    }

    public class range
    {
        public Date Date { get; set; }
    }

    public class Date
    {
        public string time_zone { get; set; }

        public string lte { get; set; }
        public string gte { get; set; }
    }

    public class match { }

    public class matchPONumber : match
    {
        public string PONumber { get; set; }
    }
    public class matchThreadId : match
    {
        public string ThreadID { get; set; }
    }

    public class matchIdentity : match
    {
        public string Identity { get; set; }
    }

}