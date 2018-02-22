"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PurchaseOrders_service_1 = require("./PurchaseOrders.service");
var TrackingInfo_service_1 = require("../TrackingInfo/TrackingInfo.service");
var CommonData_service_1 = require("../Common/CommonData.service");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var MetricsService_service_1 = require("../Common/MetricsService.service");
var router_1 = require("@angular/router");
var PurchaseOrdersTrackComponent = (function () {
    function PurchaseOrdersTrackComponent(poSrvc, trackingService, router, commonDataService, _http, metrics) {
        var _this = this;
        this.poSrvc = poSrvc;
        this.trackingService = trackingService;
        this.router = router;
        this.commonDataService = commonDataService;
        this._http = _http;
        this.metrics = metrics;
        this.purchaseOrders = null;
        this.purchaseOrderNum = null;
        this.poReposted = false;
        this.additionalDetails = false;
        this.showResults = false;
        this.showNoResults = false;
        this.steps = null;
        this.trackingNumber = null;
        this.resultsLoading = false;
        this.shipped = false;
        this.navBarListener = null;
        this.router.routerState.root.queryParams
            .subscribe(function (params) {
            if (params['poNum']) {
                _this.purchaseOrderNum = params['poNum'];
                _this.trackPurchaseOrder(_this.purchaseOrderNum);
            }
        });
    }
    PurchaseOrdersTrackComponent.prototype.ngOnInit = function () {
        sessionStorage.setItem('currentPage', 'Track PO');
        this.metrics.sendMetric('Page loaded')
            .subscribe(function () {
            //needed to make call
        });
        this.commonDataService.setPageTitle('Track PO');
        this.commonDataService.pageChange();
        //this.navBarListener = this.commonDataService.onPoSearch.subscribe(() => {
        //    let selectedPo = this.commonDataService.getSelectedPO();
        //    if (selectedPo) {
        //        this.purchaseOrderNum = selectedPo;
        //        this.trackPurchaseOrder(this.purchaseOrderNum);
        //    }
        //})
    };
    //ngOnDestroy() {
    //    this.navBarListener.unsubscribe();
    //}
    PurchaseOrdersTrackComponent.prototype.clearPO = function () {
        this.purchaseOrderNum = '';
    };
    PurchaseOrdersTrackComponent.prototype.trackPurchaseOrder = function (id) {
        var _this = this;
        if (id != '') {
            this.metrics.sendMetric('Track purchase order started')
                .subscribe(function () {
                //needed to make call
            });
            this.poReposted = false;
            this.additionalDetails = false;
            this.trackingNumber = null;
            this.resultsLoading = true;
            this.poSrvc.getPurchaseOrderById(id)
                .finally(function () {
                _this.metrics.sendMetric('Track purchase order finished')
                    .subscribe(function () {
                    //needed to make call
                });
            })
                .subscribe(function (POs) {
                if (_this.validatePOs(POs.lst)) {
                    _this.purchaseOrders = POs.lst;
                    _this.showResults = true;
                    _this.showNoResults = false;
                }
                else {
                    _this.purchaseOrders = null;
                    _this.showNoResults = true;
                    _this.showResults = false;
                }
                _this.resultsLoading = false;
            });
        }
        else {
            this.showNoResults = true;
            this.showResults = false;
        }
    };
    PurchaseOrdersTrackComponent.prototype.validatePOs = function (POs) {
        var valid = true;
        if (POs.length == 0) {
            valid = false;
        }
        return valid;
    };
    return PurchaseOrdersTrackComponent;
}());
PurchaseOrdersTrackComponent = __decorate([
    core_1.Component({
        selector: 'purchase-orders-search',
        templateUrl: './PurchaseOrders.Track.component.html'
    }),
    __metadata("design:paramtypes", [PurchaseOrders_service_1.PurchaseOrdersService, TrackingInfo_service_1.TrackingInfoService, router_1.Router,
        CommonData_service_1.CommonDataService, http_1.Http, MetricsService_service_1.MetricsService])
], PurchaseOrdersTrackComponent);
exports.PurchaseOrdersTrackComponent = PurchaseOrdersTrackComponent;
//# sourceMappingURL=PurchaseOrders.Track.component.js.map