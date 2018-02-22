using B2B.Dice.Api.Models;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace B2B.Dice.Api.Models
{
    internal class PurchaseOrderResult
    {
        public Hits hits { get; set; }
    }

    public class shards
    {

        public int total;

        public Hits hits { get; set; }

    }

    public class Hits
    {
        public string max_score;
        public int total;
        public List<Hit> hits;
    }

    public class Hit
    {
        public string _type;
        public string _score;
        public PurchaseOrder _source { get; set; }

    }

    public class CustomerResult
    {
        [DataMember]

        public List<GetCustomerResult> lst;
        [DataMember]

        public int Total { get; set; }
    }

    [DataContract]
    public class ExcelResult
    {
        [DataMember]

        public List<GetExcelResult> lst;
        [DataMember]

        public int Total { get; set; }

        [DataMember]
        public string Message { get; set; }
    }

    [DataContract]
    public class PurchaseOrderWithTotal
    {
        [DataMember]
        public List<PurchaseOrderProgressSteps> lst;
        [DataMember]
        public int total;
    }

    public class PurchaseOrdersWithTotal
    {
        [DataMember]

        public List<string> lst;
        [DataMember]

        public int total;
    }
}