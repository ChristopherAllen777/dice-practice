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
var StepStatus;
(function (StepStatus) {
    StepStatus[StepStatus["Completed"] = -1] = "Completed";
    StepStatus[StepStatus["NotStarted"] = 0] = "NotStarted";
    StepStatus[StepStatus["Failure"] = 1] = "Failure";
    StepStatus[StepStatus["InProgess"] = 2] = "InProgess";
    StepStatus[StepStatus["Successful"] = 3] = "Successful";
    StepStatus[StepStatus["Warning"] = 4] = "Warning";
    StepStatus[StepStatus["Hold"] = 5] = "Hold";
})(StepStatus || (StepStatus = {}));
var BusinessFlowComponent = (function () {
    function BusinessFlowComponent(poSrvc, trackingService, commonDataService, _http, metrics) {
        this.poSrvc = poSrvc;
        this.trackingService = trackingService;
        this.commonDataService = commonDataService;
        this._http = _http;
        this.metrics = metrics;
        this.purchaseOrder = null;
        this.poReposted = false;
        this.additionalDetails = null;
        this.noAdditionalDetails = false;
        this.warnings = [];
        this.stepName = '';
        this.stepStyle = {
            'float': 'left',
            'width': null,
            'height': 'auto',
            'overflow': 'auto'
        };
        this._po = null;
        this._disableDetails = null;
    }
    Object.defineProperty(BusinessFlowComponent.prototype, "po", {
        get: function () { return this._po; },
        set: function (po) {
            this._po = po;
            this.stepStyle.width = (100.00 / this._po.lstOfSteps.length) + '%';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BusinessFlowComponent.prototype, "disableDetails", {
        get: function () { return this._disableDetails; },
        set: function (disableDetails) {
            this._disableDetails = disableDetails;
        },
        enumerable: true,
        configurable: true
    });
    BusinessFlowComponent.prototype.ngOnInit = function () {
        this.processSteps();
    };
    BusinessFlowComponent.prototype.processSteps = function () {
        for (var i = this.po.lstOfSteps.length - 1; i >= 0; i--) {
            if (this.po.lstOfSteps[i].POStatus == StepStatus.Warning) {
                this.warnings.push(i);
                this.po.lstOfSteps[i].POStatus == StepStatus.Successful;
            }
            if ((i == this.po.lstOfSteps.length - 1 || this.po.lstOfSteps[i + 1].POStatus == StepStatus.NotStarted)
                && this.po.lstOfSteps[i].POStatus == StepStatus.Successful) {
                this.po.lstOfSteps[i].POStatus == StepStatus.Completed;
            }
        }
    };
    BusinessFlowComponent.prototype.repostPO = function (id) {
        this.metrics.sendMetric('Reposting purchase order')
            .subscribe(function () {
            //needed to make call
        });
        this.additionalDetails = false;
        this.poReposted = true;
    };
    BusinessFlowComponent.prototype.getAdditionalDetails = function (stepName) {
        var _this = this;
        this.metrics.sendMetric('Getting additional details for purchase order')
            .subscribe(function () {
            //needed to make call
        });
        var threadID = this.po.ThreadID;
        this.stepName = stepName;
        var poNum = this.po.PONumber;
        this.additionalDetails = null;
        this.noAdditionalDetails = false;
        this.poSrvc.getAdditionalDetails(stepName, threadID, poNum)
            .finally(function () {
            _this.metrics.sendMetric('Getting additional details for purchase order finished')
                .subscribe(function () {
                //needed to make call
            });
        })
            .subscribe(function (details) {
            if (details.length != 0) {
                _this.additionalDetails = {};
                _this.additionalDetails[stepName] = details;
            }
            else {
                _this.noAdditionalDetails = true;
            }
        });
    };
    BusinessFlowComponent.prototype.closeDetails = function () {
        this.additionalDetails = null;
    };
    //getStepTimestamp(stepID: number) {
    //    if (stepID > this.purchaseOrder.Status.ApplicationStep)
    //        return " ";
    //    var startTime = new Date(this.purchaseOrder.OrderDate).valueOf();
    //    var endTime = new Date(this.purchaseOrder.Status.LastUpdateTS).valueOf();
    //    var diff = endTime - startTime;
    //    var newTimeMS = ((diff / this.purchaseOrder.Status.ApplicationStep) * stepID)
    //    var newTime = new Date(startTime + newTimeMS)
    //    return newTime.toUTCString();
    //}
    BusinessFlowComponent.prototype.getStepTooltip = function (stepStatus) {
        switch (stepStatus) {
            case StepStatus.Warning:
                return "Warning";
            case StepStatus.Successful:
                return "Successful";
            case StepStatus.Completed:
                return "Successful";
            case StepStatus.NotStarted:
                return "Not Started";
            case StepStatus.InProgess:
                return "In Progess";
            case StepStatus.Failure:
                return "Failure";
            case StepStatus.Hold:
                return "Hold";
        }
    };
    BusinessFlowComponent.prototype.getWarningStatus = function (stepIndex) {
        return this.warnings.indexOf(stepIndex) != -1;
    };
    BusinessFlowComponent.prototype.setStatusColor = function (stepStatus) {
        return {
            complete: stepStatus == StepStatus.Completed,
            upcoming: stepStatus == StepStatus.NotStarted,
            successful: stepStatus == StepStatus.Successful,
            inProgress: stepStatus == StepStatus.InProgess,
            failed: stepStatus == StepStatus.Failure || stepStatus == StepStatus.Hold
        };
    };
    return BusinessFlowComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], BusinessFlowComponent.prototype, "po", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], BusinessFlowComponent.prototype, "disableDetails", null);
BusinessFlowComponent = __decorate([
    core_1.Component({
        selector: 'business-flow',
        templateUrl: './PurchaseOrders.BusinessFlow.component.html'
    }),
    __metadata("design:paramtypes", [PurchaseOrders_service_1.PurchaseOrdersService, TrackingInfo_service_1.TrackingInfoService,
        CommonData_service_1.CommonDataService, http_1.Http, MetricsService_service_1.MetricsService])
], BusinessFlowComponent);
exports.BusinessFlowComponent = BusinessFlowComponent;
//# sourceMappingURL=PurchaseOrders.BusinessFlow.component.js.map