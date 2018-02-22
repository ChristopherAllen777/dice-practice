using B2B.Dice.Api.Models;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace B2B.Dice.Api.Models
{
    internal class ProfileResult
    {
        public ProfileHits hits { get; set; }
    }

    public class ProfileHits
    {
        public string max_score;
        public int total;
        public List<ProfileHit> hits;
    }

    public class ProfileHit
    {
        public string _type;
        public string _id;
        public string _score;
        public Profile _source;

    }
}