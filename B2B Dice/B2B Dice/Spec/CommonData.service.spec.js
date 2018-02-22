"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var CommonData_service_1 = require("../app/Common/CommonData.service");
describe('Testing Common Data Service', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [CommonData_service_1.CommonDataService]
        });
    });
    it('should set/get selected PO', testing_1.inject([CommonData_service_1.CommonDataService], function (commonDataService) {
        commonDataService.setSelectedPO('123');
        expect(commonDataService.getSelectedPO()).toEqual('123');
    }));
    it('should set/get previous page', testing_1.inject([CommonData_service_1.CommonDataService], function (commonDataService) {
        var page = "testpreviouspage";
        commonDataService.setPreviousPage(page);
        expect(commonDataService.getPreviousPage()).toEqual(page);
    }));
});
//# sourceMappingURL=CommonData.service.spec.js.map