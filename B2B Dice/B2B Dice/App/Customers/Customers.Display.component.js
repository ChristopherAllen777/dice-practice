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
var CommonData_service_1 = require("../Common/CommonData.service");
var PurchaseOrders_service_1 = require("../PurchaseOrders/PurchaseOrders.service");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var MetricsService_service_1 = require("../Common/MetricsService.service");
var Excel_service_1 = require("../Common/Excel.service");
var Pager_service_1 = require("../Common/Pager.service");
var StepStatus;
(function (StepStatus) {
    StepStatus[StepStatus["Completed"] = -1] = "Completed";
    StepStatus[StepStatus["NotStarted"] = 0] = "NotStarted";
    StepStatus[StepStatus["Failure"] = 1] = "Failure";
    StepStatus[StepStatus["InProgess"] = 2] = "InProgess";
    StepStatus[StepStatus["Successful"] = 3] = "Successful";
    StepStatus[StepStatus["Warning"] = 4] = "Warning";
})(StepStatus || (StepStatus = {}));
var CustomersDisplayComponent = (function () {
    function CustomersDisplayComponent(poSrvc, commonDataService, _http, metrics, pagerService, router, excel) {
        this.poSrvc = poSrvc;
        this.commonDataService = commonDataService;
        this._http = _http;
        this.metrics = metrics;
        this.pagerService = pagerService;
        this.router = router;
        this.excel = excel;
        this.purchaseOrders = null;
        this.showResults = false;
        this.showNoResults = false;
        this.pager = {};
        this.page = 0;
        this.pageSize = 100;
        this.total = null;
        this.resultsLoading = false;
        this.exportLoading = false;
        this.filterListener = null;
        this.sortColumn = "";
        this.sortOrder = "";
        this.allowNullThreadID = false;
        this.counts = [5, 10, 25, 50, 100];
        this._filters = null;
    }
    Object.defineProperty(CustomersDisplayComponent.prototype, "filters", {
        get: function () { return this._filters; },
        set: function (filters) {
            this._filters = filters;
            this.setPage(1);
        },
        enumerable: true,
        configurable: true
    });
    CustomersDisplayComponent.prototype.ngOnInit = function () {
        var _this = this;
        sessionStorage.setItem('currentPage', 'Customer Search');
        this.metrics.sendMetric('Page loaded')
            .subscribe(function () {
            //needed to make call
        });
        this.resultsLoading = true;
        this.filterListener = this.commonDataService.onFilterChange.subscribe(function () {
            _this.filters = _this.commonDataService.getFilters();
        });
    };
    CustomersDisplayComponent.prototype.ngOnDestroy = function () {
        this.filterListener.unsubscribe();
    };
    CustomersDisplayComponent.prototype.updateNullThreadIDResults = function () {
        this.allowNullThreadID = !this.allowNullThreadID;
        this.getPurchaseOrders();
    };
    CustomersDisplayComponent.prototype.getPurchaseOrders = function () {
        var _this = this;
        this.metrics.sendMetric('Getting filtered list of purchase orders started')
            .subscribe(function () {
            //needed to make call
        });
        this.poSrvc.getPurchaseOrders(this.filters, this.page, this.pageSize, 'customer', this.sortColumn, this.sortOrder, this.allowNullThreadID)
            .finally(function () {
            _this.metrics.sendMetric('Getting filtered list of purchase orders finished')
                .subscribe(function () {
                //needed to make call
            });
        })
            .subscribe(function (POs) {
            if (POs.Total > 0) {
                _this.total = POs.Total;
                _this.purchaseOrders = POs.lst;
                _this.showResults = true;
                _this.showNoResults = false;
                // get pager object from service
                _this.pager = _this.pagerService.getPager(_this.total, _this.page, _this.pageSize);
            }
            else {
                _this.purchaseOrders = null;
                _this.showNoResults = true;
                _this.showResults = false;
            }
            _this.resultsLoading = false;
        });
    };
    CustomersDisplayComponent.prototype.loadPurchaseOrder = function (id) {
        var _this = this;
        this.metrics.sendMetric('Getting specific purchase order details started')
            .subscribe(function () {
            //needed to make call
        });
        this.poSrvc.getPurchaseOrderById(id)
            .finally(function () {
            _this.metrics.sendMetric('Getting specific purchase order details finished')
                .subscribe(function () {
                //needed to make call
            });
        })
            .subscribe(function (threads) {
            if (_this.validatePOs(threads)) {
                for (var _i = 0, threads_1 = threads; _i < threads_1.length; _i++) {
                    var thread = threads_1[_i];
                    _this.purchaseOrders.push(thread);
                }
            }
        });
    };
    CustomersDisplayComponent.prototype.validatePOs = function (POs) {
        var valid = true;
        if (POs.length == 0) {
            valid = false;
        }
        return valid;
    };
    CustomersDisplayComponent.prototype.setSort = function (sortCol) {
        if (this.sortColumn != sortCol) {
            this.sortColumn = sortCol;
            this.sortOrder = "asc";
        }
        else {
            if (this.sortOrder == "asc") {
                this.sortOrder = "desc";
            }
            else {
                this.sortOrder = "asc";
            }
        }
        console.log(this.sortColumn);
        console.log(this.sortOrder);
        this.getPurchaseOrders();
    };
    CustomersDisplayComponent.prototype.getStepTooltip = function (stepStatus) {
        switch (stepStatus) {
            case StepStatus.Warning:
                return "Successful";
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
        }
    };
    CustomersDisplayComponent.prototype.setStatusColor = function (stepStatus) {
        return {
            successful: stepStatus == StepStatus.Successful || stepStatus == StepStatus.Warning,
            inProgress: stepStatus == StepStatus.InProgess,
            failed: stepStatus == StepStatus.Failure
        };
    };
    //trackPO(po: string) {
    //    this.commonDataService.setSelectedPO(po);
    //    this.commonDataService.poSearch();
    //    this.router.navigate(['/track/purchase-orders']);
    //}
    CustomersDisplayComponent.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.page = page;
        this.getPurchaseOrders();
    };
    CustomersDisplayComponent.prototype.setPageSize = function (size) {
        this.pageSize = size;
        this.setPage(1);
    };
    CustomersDisplayComponent.prototype.exportToExcel = function () {
        var _this = this;
        this.exportLoading = true;
        this.poSrvc.getPurchaseOrders(this.filters, 1, 9999, 'excel', this.sortColumn, this.sortOrder, this.allowNullThreadID)
            .subscribe(function (POs) {
            if (POs.Total > 0) {
                var json = _this.reformatPOsAsJson(POs);
                _this.exportLoading = _this.excel.exportAsExcelFile(json, 'CustomerSearch');
            }
        });
    };
    CustomersDisplayComponent.prototype.reformatPOsAsJson = function (POs) {
        var json = [];
        for (var _i = 0, _a = POs.lst; _i < _a.length; _i++) {
            var po = _a[_i];
            var jsonObj = {};
            jsonObj["Date"] = po.Date;
            jsonObj["ProfileID"] = po.ProfiLeID;
            jsonObj["PO Number"] = po.PONumber;
            jsonObj["ThreadID"] = po.ThreadID;
            for (var _b = 0, _c = po.lstOfSteps; _b < _c.length; _b++) {
                var step = _c[_b];
                jsonObj[step.Name] = step.POStatus;
            }
            json.push(jsonObj);
        }
        return json;
    };
    return CustomersDisplayComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], CustomersDisplayComponent.prototype, "filters", null);
CustomersDisplayComponent = __decorate([
    core_1.Component({
        selector: 'customers-display',
        templateUrl: './Customers.Display.component.html'
    }),
    __metadata("design:paramtypes", [PurchaseOrders_service_1.PurchaseOrdersService, CommonData_service_1.CommonDataService,
        http_1.Http, MetricsService_service_1.MetricsService, Pager_service_1.PagerService,
        router_1.Router, Excel_service_1.ExcelService])
], CustomersDisplayComponent);
exports.CustomersDisplayComponent = CustomersDisplayComponent;
//# sourceMappingURL=Customers.Display.component.js.map