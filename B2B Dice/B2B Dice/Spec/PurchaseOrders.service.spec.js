"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var PurchaseOrders_service_1 = require("../app/PurchaseOrders/PurchaseOrders.service");
var mockResponse = {
    "PurchaseOrderNo": 1,
    "OrderAmount": 2584,
    "OrderDate": "08/1/2017",
    "CustomerNo": 1,
    "Status": {
        "ApplicationStep": 3,
        "ApplicationStatus": "Success",
        "FailureText": "",
        "LastUpdateTS": "08/2/2017 10:11:04 AM"
    }
};
describe('Testing Purchase Order Service', function () {
    var mockHttp;
    beforeEach(function () {
        mockHttp = { get: null };
        spyOn(mockHttp, 'get').and.returnValue(Observable_1.Observable.of({
            json: function () { return mockResponse; }
        }));
        testing_1.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                {
                    provide: http_1.Http,
                    useValue: mockHttp
                },
                PurchaseOrders_service_1.PurchaseOrdersService
            ]
        });
    });
    it('should get search results from json', testing_1.inject([PurchaseOrders_service_1.PurchaseOrdersService], function (purchaseOrderSrvc) {
        var expectedUrl = 'app/purchaseOrderNums.json';
        purchaseOrderSrvc.getPurchaseOrders(null, null, null, null)
            .subscribe(function (res) {
            expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
            expect(res).toEqual(mockResponse);
        });
    }));
    it('should get filtered result from json', testing_1.inject([PurchaseOrders_service_1.PurchaseOrdersService], function (purchaseOrderSrvc) {
        var expectedUrl = 'http://p1vmb2bls01.olqa.preol.dell.com:4000/api/purchaseorder?Id=1';
        purchaseOrderSrvc.getPurchaseOrderById('1')
            .subscribe(function (res) {
            expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
            expect(res).toEqual(mockResponse);
        });
        expectedUrl = 'http://p1vmb2bls01.olqa.preol.dell.com:4000/api/purchaseorder?Id=2';
        purchaseOrderSrvc.getPurchaseOrderById('2')
            .subscribe(function (res) {
            expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
            expect(res).toEqual(mockResponse);
        });
    }));
});
//# sourceMappingURL=PurchaseOrders.service.spec.js.map