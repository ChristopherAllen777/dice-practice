"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PurchaseOrders_service_1 = require("../app/PurchaseOrders/PurchaseOrders.service");
var PurchaseOrders_Track_component_1 = require("../app/PurchaseOrders/PurchaseOrders.Track.component");
var CommonData_service_1 = require("../app/Common/CommonData.service");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var MockPurchaseOrdersService = (function (_super) {
    __extends(MockPurchaseOrdersService, _super);
    function MockPurchaseOrdersService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.purchaseOrder = {
            "PONumber": "2",
            "ThreadID": 750,
            "lstOfSteps": [
                {
                    "Name": "test",
                    "POStatus": 2
                },
                {
                    "Name": "test",
                    "POStatus": 2
                }
            ]
        };
        return _this;
    }
    MockPurchaseOrdersService.prototype.getPurchaseOrderById = function (id) {
        return Observable_1.Observable.of(this.purchaseOrder).map(function (value) { return value; });
    };
    return MockPurchaseOrdersService;
}(PurchaseOrders_service_1.PurchaseOrdersService));
describe('Testing Purchase Order Component', function () {
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [PurchaseOrders_Track_component_1.PurchaseOrdersTrackComponent],
            providers: [PurchaseOrders_service_1.PurchaseOrdersService, CommonData_service_1.CommonDataService],
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule],
        });
        testing_1.TestBed.overrideComponent(PurchaseOrders_Track_component_1.PurchaseOrdersTrackComponent, {
            set: {
                providers: [{ provide: PurchaseOrders_service_1.PurchaseOrdersService, useClass: MockPurchaseOrdersService }],
                templateUrl: null,
                template: '<div *ngIf="purchaseOrder">' +
                    '<div id="PurchaseOrderNo">{{purchaseOrder.PurchaseOrderNo}}</div>' +
                    '<div id="OrderAmount">{{purchaseOrder.OrderAmount | currency}}</div>' +
                    '<div id="OrderDate">{{purchaseOrder.OrderDate}}</div>' +
                    '<div id="CustomerNo">{{purchaseOrder.CustomerNo}}</div>' +
                    '<div id="ApplicationStep">{{purchaseOrder.Status.ApplicationStep}}</div>' +
                    '<div id="ApplicationStatusid">{{purchaseOrder.Status.ApplicationStatus}}</div>' +
                    '<div id="FailureText" *ngIf="purchaseOrder.Status.FailureText">{{purchaseOrder.Status.FailureText}}</div>' +
                    '<div id="LastUpdateTS">{{purchaseOrder.Status.LastUpdateTS}}</div>' +
                    '</div>'
            }
        });
        fixture = testing_1.TestBed.createComponent(PurchaseOrders_Track_component_1.PurchaseOrdersTrackComponent);
        fixture.detectChanges();
    });
    it('Should get purchase order from service', testing_1.inject([PurchaseOrders_service_1.PurchaseOrdersService, CommonData_service_1.CommonDataService], function (injectService) {
        fixture.componentInstance.trackPurchaseOrder('1');
        fixture.whenStable()
            .then(function () {
            fixture.detectChanges();
            return fixture.whenStable();
        })
            .then(function () {
            var compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelector('PurchaseOrderNo').innerText).toEqual('2');
            expect(compiled.querySelector('OrderAmount').innerText).toEqual('750');
            expect(compiled.querySelector('OrderDate').innerText).toEqual('08/2/2017');
            expect(compiled.querySelector('CustomerNo').innerText).toEqual('1');
            expect(compiled.querySelector('ApplicationStep').innerText).toEqual('2');
            expect(compiled.querySelector('ApplicationStatus').innerText).toEqual('Failure');
            expect(compiled.querySelector('FailureText').innerText).toEqual('Connection timeout');
            expect(compiled.querySelector('LastUpdateTS').innerText).toEqual('08/2/2017 10:11:04 AM');
        });
    }));
});
//# sourceMappingURL=PurchaseOrders.Track.spec.js.map