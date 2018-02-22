using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace B2B.Dice.Api.Models
{
    public class Search
    {
        public int size { get; set; }
        public SearchQuery query { get; set; }
        public int from { get;   set; }
    }

    public class SearchQuery
    {
        public virtual Multi_Match multi_match { get; set; }

    }

    public class SelectiveSearchQuery
    {
        public virtual match_phrase_prefix match_phrase_prefix { get; set; }

    }

    public class Multi_Match
    {
        public string query { get; set; }
        public object fields { get; set; }
    }

    public class SelectiveSearch 
    {
        public List<string> _source { get; set; }
        public  SelectiveSearchQuery query { get; set; }
        public int size { get; set; }
    }

}