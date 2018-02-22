using B2B.Dice.Api.Controllers;
using B2B.Dice.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace B2B.Dice.Api
{
    public static class Extensions
    {
        public static void Add(this List<ProgressStep> steps, string name, POStatus postatus)
        {
            steps.Add(new ProgressStep(name, postatus));
        }
        public static void AddWithNoDuplicate (this List<PurchaseOrderProgressSteps> input, PurchaseOrderProgressSteps filter)
        {
            var selected  = input.Where(x => x.PONumber == filter.PONumber && x.ThreadID == filter.ThreadID).ToList();
            if (selected.Count==0)
            {
                input.Add(filter);
            }
            else
            {
                var defaultOne = selected.FirstOrDefault();
                int filterCount = filter.lstOfSteps.Count(x => x.POStatus == POStatus.Successful);
                int inputCount = defaultOne.lstOfSteps.Count(x => x.POStatus == POStatus.Successful);
                if (inputCount < filterCount)
                {
                    defaultOne.lstOfSteps = filter.lstOfSteps;
                }
            }
        }
            public static List<PurchaseOrderProgressSteps> Filter(this List<PurchaseOrderProgressSteps> input, List<PurchaseOrderProgressSteps> filter)
        {

            List<PurchaseOrderProgressSteps> result = new List<PurchaseOrderProgressSteps>();
            if (filter.Count > 0)
            {


                foreach (var item in input)
                {

                    foreach (var filterItem in filter)
                    {
                        if (item.PONumber == filterItem.PONumber && item.ThreadID == filterItem.ThreadID)
                        {
                            int filterCount = filterItem.lstOfSteps.Count(x => x.POStatus == POStatus.Successful);
                            int inputCount = item.lstOfSteps.Count(x => x.POStatus == POStatus.Successful);
                            if (inputCount > filterCount)
                            {
                                result.Add(item);
                            }
                            else if (filterCount > inputCount)
                            {
                                result.Add(filterItem);

                            }
                            else
                            {
                                result = filter;
                                break;
                            }
                        }
                        else
                        {
                            result.Add(item);
                        }

                        break;
                    }
                }
            }
            else
                result = input;

            return result;

            var lstOfFilterThreadIDs = filter.Select(x => x.ThreadID).ToList();
            foreach (var item in input)
            {
                if (!lstOfFilterThreadIDs.Contains(item.ThreadID))
                    result.Add(item);
                else
                {
                    var filterItem = filter.Where(x => x.ThreadID == item.ThreadID).FirstOrDefault();
                    int filterCount = filterItem.lstOfSteps.Count(x => x.POStatus == POStatus.Successful);
                    int inputCount = item.lstOfSteps.Count(x => x.POStatus == POStatus.Successful);
                    if (inputCount > filterCount)
                    {
                        result.Add(item);
                    }
                    else if (filterCount > inputCount)
                    {
                        result.Add(filterItem);

                    }
                }

            }
            if (filter.Count == 0)
            {
                return input;
            }
            return result;
        }
    }
}