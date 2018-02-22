using B2B.Dice.Api.Models;
using System.Collections.Generic;

namespace B2B.Dice.Api
{
    public class POStatusResolver
    {
        internal POStatus GetPOStatus(List<Hit> list, string service)
        {
            if (service != CONSTANTS.postatusfromb2bservices && list.Count > 0)
            {
                return POStatus.Successful;
            }
            foreach (var item in list)
            {
                if (GetPOStatus(item._source.POStatus) == POStatus.Successful)
                {
                    return POStatus.Successful;
                }
            }

            foreach (var item in list)
            {
                if (GetPOStatus(item._source.POStatus) == POStatus.Warning)
                {
                    return POStatus.Warning;
                }
            }
            if (list.Count > 0)
            {
                return POStatus.InProgess;
            }
            return POStatus.Failure;
        }


        internal POStatus GetPOStatus(string pOStatus)
        {
            if (pOStatus.Contains("Success") || pOStatus.Contains("already been processed"))
            {
                return POStatus.Successful;
            }
            else
            {
                if (pOStatus.ToLower().Contains("error") || pOStatus.ToLower().Contains("validation errors"))
                {
                    return POStatus.Failure;
                }
                if (pOStatus.ToLower().Contains("warning"))
                {
                    return POStatus.Warning;
                }

            }
            return POStatus.InProgess;
        }

        internal POStatus GetPOStatus(string service, string pOStatus, bool dataExists)
        {
            if (service != CONSTANTS.postatusfromb2bservices && dataExists)
            {
                return POStatus.Successful;
            }
            if (pOStatus.Contains("Success") || pOStatus.Contains("already been processed"))
            {
                return POStatus.Successful;
            }
            else
            {
                if (pOStatus.ToLower().Contains("error") || pOStatus.ToLower().Contains("validation errors"))
                {
                    return POStatus.Failure;
                }
                if (pOStatus.ToLower().Contains("warning"))
                {
                    return POStatus.Warning;
                }

            }
            return POStatus.InProgess;
        }

        internal List<ProgressStep> GetListOfProgressSteps(string service, string status)
        {
            return GetListOfProgressSteps(service, GetPOStatus(service, status, true));
        }

        internal List<ProgressStep> GetListOfProgressSteps(string service, POStatus status)
        {
            if (!service.Contains("_search"))
                service = service += "/_search";
            var lst = new List<ProgressStep>();
            switch (service)
            {
                case CONSTANTS.GCMPService:
                    lst.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                    lst.Add(CONSTANTS.SubmittedPO, POStatus.Successful);
                    lst.Add(CONSTANTS.B2BServices, POStatus.Successful);
                    lst.Add(CONSTANTS.GCMP, POStatus.InProgess);
                    lst.Add(CONSTANTS.Shipping, POStatus.NotStarted);
                    break;
                case CONSTANTS.postatusfromb2bservices:
                case CONSTANTS.sendPurchaseOrder:
                    switch (status)
                    {
                        case POStatus.NotStarted:
                            break;

                        default:
                            lst.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                            lst.Add(CONSTANTS.SubmittedPO, POStatus.Successful);
                            lst.Add(CONSTANTS.B2BServices, status);
                            lst.Add(CONSTANTS.GCMP, POStatus.NotStarted);
                            lst.Add(CONSTANTS.Shipping, POStatus.NotStarted);
                            break;
                    }
                    break;

                case CONSTANTS.submittedpodetails:
                    lst.Add(CONSTANTS.B2BDIRECT, POStatus.Successful);
                    lst.Add(CONSTANTS.SubmittedPO, status);
                    lst.Add(CONSTANTS.B2BServices, POStatus.NotStarted);
                    lst.Add(CONSTANTS.GCMP, POStatus.NotStarted);
                    lst.Add(CONSTANTS.Shipping, POStatus.NotStarted);
                    break;

                case CONSTANTS.IncomingTransactions:
                    lst.Add(CONSTANTS.B2BDIRECT, status);
                    lst.Add(CONSTANTS.SubmittedPO, POStatus.NotStarted);
                    lst.Add(CONSTANTS.B2BServices, POStatus.NotStarted);
                    lst.Add(CONSTANTS.GCMP, POStatus.NotStarted);
                    lst.Add(CONSTANTS.Shipping, POStatus.NotStarted);
                    break;
                default:
                    break;
            }
            return lst;
        }
    }
}