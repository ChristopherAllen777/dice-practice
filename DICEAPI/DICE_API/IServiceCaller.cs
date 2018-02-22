using B2B.Dice.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace B2B.Dice.Api
{
    public interface IServiceCaller
    {

        int size { get; set; }

        int from { get; set; }


        Task<string> SearchForGivenInput(string id, string value, int total = 0);

        Task<string> SearchForGivenInput();
        Task<string> GetPurchaseOrdersAsync();
        Task<string> GetPurchaseOrdersAsync(string startDate, string endDate, string customerNumber);

        Task<string> PostUserMetric(object metric);
        Task<string> GetAsync(string id);
        Task<string> SearchForGivenInput(string startDate, string endDate, string customerNumber, List<string> pos, int total = 0, string threadID = "", string poNumber = "");

        Task<string> SelectiveSearchForIdentity(string id);
        Task<string> GetAdditionalDetails(string threadId, string step);

        Task<string> SearchForUserProfile(string profileId);
        Task<string> UpdateUserProfile(Profile profile, string recordId);


        Task<string> GetPOS(ExportToExcelInput input, List<string> searchFor = null);

    }
}
