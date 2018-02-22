using B2B.Dice.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace B2B.Dice.Api
{
    public class ServiceCaller : IServiceCaller
    {

        public int size { get; set; }

        public int from { get; set; }

        public async Task<string> GetAdditionalDetails(string threadId, string step)
        {

            var uri = GetURI(step + CONSTANTS.diceUniversalSearch);
            var httpClient = new HttpClient();

            object query = new
            {
                match = new
                {
                    ThreadID = threadId
                }
            };

            var response = httpClient.PostAsJsonAsync(uri, new JsonObjectForPO { size = size, query = query }).Result;

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }
        public async Task<string> SelectiveSearchForIdentity(string id)
        {

            var uri = GetURI(CONSTANTS.diceUniversalSearch);
            var httpClient = new HttpClient();

            var search = new
            {
                _source = new List<string> { "Identity" },

                from = from,
                size = size,

                query = new
                {
                    match_phrase_prefix = new

                    {
                        Identity = id
                    }

                }
            };

            var response = httpClient.PostAsJsonAsync(uri, search).Result;

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> SearchForGivenInput()
        {
            var uri = GetURI(CONSTANTS.diceUniversalSearch);
            var httpClient = new HttpClient();

            var search = new { from = from, size = size, sort = new List<object> { new { Date = new { order = "desc" } } } };
            var response = httpClient.PostAsJsonAsync(uri, search).Result;

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> SearchForGivenInput(string id, string value, int total = 0)
        {

            var uri = GetURI(CONSTANTS.diceUniversalSearch);
            var httpClient = new HttpClient();

            var search = new
            {

                from = from,
                size = size,
                query = new
                {
                    multi_match = new
                    {
                        query = id,
                        fields = new List<string> { value }
                    }

                }
            };

            var response = httpClient.PostAsJsonAsync(uri, search).Result;

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> SearchForGivenInput(string startDate, string endDate, string customerNumber, List<string> pos, int total = 0, string threadID = "", string poNumber = "")
        {
            var uri = GetURI(CONSTANTS.diceUniversalSearch);
            var httpClient = new HttpClient();
            var queryObj = GetQueryObject(startDate, endDate, customerNumber, pos, total, threadID, poNumber);
            var response = httpClient.PostAsJsonAsync(uri, new
            {
                sort = new { Date = new { order = "desc" } },
                from = 0,
                size = total != 0 ? total : size,
                query = queryObj
            }).Result;
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        private object GetQueryObject(string startDate, string endDate, string customerNumber, List<string> pos, int total = 0, string threadID = "", string poNumber = "")
        {

            object queryObj;
            var phrasePrefix = !string.IsNullOrEmpty(customerNumber) || !string.IsNullOrEmpty(threadID) || !string.IsNullOrEmpty(poNumber);
            var must_not = new List<object>
                    {
                        new
                        {
                            match = new
                            {
                                Transaction = "Punchout"
                            }
                        }

                     };
            var sort = new SortField
            {
                Date = new OrderDate
                {
                    order = "desc"
                }
            };
            var must = new List<object>();

            if (!string.IsNullOrEmpty(customerNumber))
            {
                must.Add(new { match_phrase_prefix = new matchIdentity { Identity = customerNumber } });
            }
            if (!string.IsNullOrEmpty(threadID))
            {
                must.Add(new { match_phrase_prefix = new { ThreadID = threadID } });

            }
            if (!string.IsNullOrEmpty(poNumber))
            {
                must.Add(new { match_phrase_prefix = new matchPONumber { PONumber = poNumber } });
            }

            must.Add(new { range = new range { Date = new Date { gte = startDate, lte = endDate, time_zone = "+00:00" } } });

            queryObj = new queryWithBoolMust
            {

                boole = new booleWithMust
                {
                    must = must,
                    filter = new { terms = new { ThreadID = pos } },
                    must_not = must_not
                }
            };
            return queryObj;
        }

        public async Task<string> GetPurchaseOrdersAsync(string startDate, string endDate, string customerNumber)
        {
            var uri = GetURI(CONSTANTS.IncomingTransactionsGet);
            var httpClient = new HttpClient();
            var query = new object();

            if (!string.IsNullOrEmpty(customerNumber) && !string.IsNullOrEmpty(startDate))
            {


                query = new queryWithMatchAndRange
                {
                    boole = new boole
                    {
                        must = new List<object>
                        {
                            new { match_phrase_prefix= new { Identity=customerNumber} },
                            new { range= new {Date=new { gte=startDate,lte=endDate,time_zone="+00:00"} } }
                        }

                    }
                };
            }
            else if (!string.IsNullOrEmpty(startDate))
            {
                query = new
                {
                    range = new
                    {
                        Date = new
                        {
                            gte = startDate,
                            lte = endDate,
                            time_zone = "+00:00"
                        }
                    }

                };
            }
            else
            {
                query = new
                {
                    match_phrase_prefix = new
                    {
                        Identity = customerNumber
                    }
                };
            }


            var response = httpClient.PostAsJsonAsync(uri, new JsonObjectForPO { from = from, size = size, query = query }).Result;


            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> GetPurchaseOrdersAsync()
        {
            var uri = GetURI(CONSTANTS.IncomingTransactionsGet);
            var httpClient = new HttpClient();

            var query = new
            {
                sort = new
                {
                    Date = new
                    {
                        order = "Desc"
                    }
                }

            };
            var response = httpClient.PostAsJsonAsync(uri, query).Result;


            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> PostUserMetric(object metric)
        {
            var uri = GetURI(CONSTANTS.UserMetricsPost);
            var httpClient = new HttpClient();

            var response = httpClient.PostAsJsonAsync(uri, metric).Result;

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> SearchForUserProfile(string profileId)
        {
            var uri = GetURI(CONSTANTS.UserProfileSearch + "?q=ProfileID:" + profileId);
            var httpClient = new HttpClient();

            var response = httpClient.PostAsJsonAsync(uri, new object()).Result;

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return result;
        }

        public async Task<string> UpdateUserProfile(Profile profile, string recordId)
        {
            var httpClient = new HttpClient();

            if (!string.IsNullOrEmpty(recordId))
            {
                var uri = GetURI(CONSTANTS.UserProfile + "/" + recordId);
                var response = httpClient.PutAsJsonAsync(uri, profile).Result;
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadAsStringAsync();
                return result;
            }
            else
            {
                var uri = GetURI(CONSTANTS.UserProfile);
                var response = httpClient.PostAsJsonAsync(uri, profile).Result;
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadAsStringAsync();
                return result;
            }
        }

        public async Task<string> GetAsync(string id)
        {
            string result = string.Empty;
            var uri = GetURI(CONSTANTS.submittedpodetails);
            var httpClient = new HttpClient();
            var query = new
            {
                match = new
                {
                    PONumber = id
                }

            };

            var json = JsonConvert.SerializeObject(new { query = query });
            var response = httpClient.PostAsJsonAsync(uri, new { from = from, size = size, query = query }).Result;


            //will throw an exception if not successful
            response.EnsureSuccessStatusCode();

            result = await response.Content.ReadAsStringAsync();
            return result;
        }


        private string GetURI(string input)
        {
            return System.Configuration.ConfigurationManager.AppSettings[CONSTANTS.DiceEndPoint] + input;
        }

        public async Task<string> GetPOS(ExportToExcelInput input, List<string> searchFor = null)
        {
            string startDate = input.StartDate;
            string endDate = input.EndDate;
            string customerNumber = input.CustomerNumber;
            int size = input.Size;
            int page = input.Page;
            string threadID = input.ThreadId;
            string poNumber = input.PONumber;
            string sortcolumn = !string.IsNullOrEmpty(input.SortColumn) ? input.SortColumn.ToLower() : "";

            string result = string.Empty;
            var uri = GetURI(CONSTANTS.submittedpodetails);
            var httpClient = new HttpClient();
            object query;


            var phrasePrefix = !string.IsNullOrEmpty(customerNumber) || !string.IsNullOrEmpty(threadID) || !string.IsNullOrEmpty(poNumber);
            var must_not = new List<object>
                    {
                        new
                        {
                            match = new
                            {
                                Transaction = "Punchout"
                            }
                        }

                     };
            object sort;
            switch (sortcolumn)
            {
                case "threaid":
                    sort = new SortFieldWithThreadId
                    {
                        ThreadID = input.SortOrder
                    };
                    break;
                case "ponumber":
                    sort = new SortFieldWithPONumber
                    {
                        PONumber = input.SortOrder
                    };
                    break;
                default:
                    sort = new SortField
                    {
                        Date = new OrderDate
                        {
                            order = "desc"
                        }
                    };
                    break;
            }



            var must = new List<object>();
            var should = new List<object>();

            if (!string.IsNullOrEmpty(customerNumber))
            {
                must.Add(new { match_phrase_prefix = new matchIdentity { Identity = customerNumber } });
            }
            if (!string.IsNullOrEmpty(threadID))
            {
                must.Add(new { match = new { ThreadID = threadID } });

            }
            if (!string.IsNullOrEmpty(poNumber))
            {
                must.Add(new { match_phrase_prefix = new matchPONumber { PONumber = poNumber } });
            }

            must.Add(new { range = new range { Date = new Date { gte = startDate, lte = endDate, time_zone = "+00:00" } } });
            if (phrasePrefix)
            {
                query = new queryWithBoolMust
                {

                    boole = new booleWithMust
                    {
                        should = should,
                        must = must
                        //  must_not = must_not
                    }

                };
            }
            else
            {
                query = new querywithmustnotbool
                {

                    boole = new boolWithMustNot
                    {
                        must = must,
                        must_not = must_not
                    }

                };
            }


            var response = httpClient.PostAsJsonAsync(uri, new
            {
                _source = (searchFor != null) ? searchFor : new List<string> { "ThreadID", "ThreadId" },
                sort = new { Date = new { order = "desc" } },
                from = page,
                size = size,
                query = query
            }).Result;


            //will throw an exception if not successful
            response.EnsureSuccessStatusCode();

            result = await response.Content.ReadAsStringAsync();
            return result;
        }


    }



    internal class booleWithShould
    {

        [JsonProperty("bool")]
        public object boole { get; internal set; }
    }

    internal class querywithboolandFilter
    {
        [JsonProperty("bool")]
        public object boole { get; set; }

    }

    internal class querywithmustnotbool
    {
        [JsonProperty("bool")]
        public boolWithMustNot boole { get; set; }
    }

    internal class JsonObjectWithTwo
    {
        public int from { get; set; }
        public List<SortField> sort { get; set; }
        public int size { get; set; }
        [JsonProperty("query")]
        public object query { get; set; }

    }

    internal class SearchWithRange
    {
        public int size { get; set; }
        public SearchQuery query { get; set; }
    }


}