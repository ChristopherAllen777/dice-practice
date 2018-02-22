using B2B.Dice.Api.Models;
using System.Collections.Generic;

namespace B2B.Dice.Api.Controllers
{
    public interface IPurchaseOrderStatusRetriever
    {
        List<PurchaseOrderProgressSteps> GetServiceStatus(string id, string service);
        List<ProgressStep> GetSteps(List<Hit> lst);
        List<ProgressStepExcel> GetStepsForExcel(List<Hit> poResult,Hit sendPO);
    }
}