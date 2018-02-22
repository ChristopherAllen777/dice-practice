using System.Runtime.Serialization;

namespace B2B.Dice.Api.Models
{
    [DataContract]
    public class ExportToExcelInput
    {
        [DataMember]

        public string StartDate { get; set; }
        [DataMember]

        public string EndDate { get; set; }
        [DataMember]

        public string CustomerNumber { get; set; }

        [DataMember]

        public string PONumber { get; set; }
        [DataMember]
        public int Size { get; set; }
        [DataMember]
        public int Page { get; set; }
        [DataMember]

        public string ThreadId { get; set; }

        [DataMember]
        public string SortColumn { get; set; }

        [DataMember]
        public string SortOrder { get; set; }

        [DataMember]
        public bool AllowNullThreadID
        { get; set; }
    }
}