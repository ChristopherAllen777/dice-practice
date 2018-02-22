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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var MetricsService_service_1 = require("../Common/MetricsService.service");
var PurchaseOrders_service_1 = require("../PurchaseOrders/PurchaseOrders.service");
require("rxjs/add/observable/of");
var FiltersComponent = (function () {
    function FiltersComponent(commonDataService, _http, metrics, poSrvc, router) {
        this.commonDataService = commonDataService;
        this._http = _http;
        this.metrics = metrics;
        this.poSrvc = poSrvc;
        this.router = router;
        this.showResults = false;
        this.noDisplaySelected = false;
        this.param = null;
        this.paramDisplay = null;
        this.paramVal = null;
        this.showCalender = false;
        this.showAutoComplete = true;
        this.arrayOfKeys = [];
        this.displayBrowse = false;
        this.displayCustomer = true;
        this.filters = {};
        this.params = [
            {
                "QueryName": "customerNumber",
                "DisplayName": "Profile ID"
            },
            {
                "QueryName": "startDate",
                "DisplayName": "Start Date"
            },
            {
                "QueryName": "endDate",
                "DisplayName": "End Date"
            },
            {
                "QueryName": "poNumber",
                "DisplayName": "PO Number"
            },
            {
                "QueryName": "threadID",
                "DisplayName": "Thread ID"
            }
        ];
    }
    FiltersComponent.prototype.ngOnInit = function () {
        sessionStorage.setItem('currentPage', 'Filter Control');
        this.metrics.sendMetric('Filter Control loaded')
            .subscribe(function () {
            //needed to make call
        });
        this.commonDataService.setPageTitle('Search');
        this.commonDataService.pageChange();
        this.prefillFilters();
        this.paramDisplay = "Profile ID";
        this.param = 'customerNumber';
        this.getPurchaseOrders();
    };
    FiltersComponent.prototype.prefillFilters = function () {
        for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
            var param = _a[_i];
            this.filters[param.QueryName] = null;
        }
    };
    FiltersComponent.prototype.setDisplay = function (display) {
        switch (display) {
            case 'browse':
                this.displayBrowse = true;
                this.displayCustomer = false;
                break;
            case 'customer':
                this.displayBrowse = false;
                this.displayCustomer = true;
                break;
        }
    };
    FiltersComponent.prototype.getPurchaseOrders = function () {
        if (this.displayBrowse || this.displayCustomer) {
            this.showResults = true;
            this.noDisplaySelected = false;
            this.commonDataService.setFilters(this.filters);
            this.commonDataService.filterChange();
        }
        else {
            this.showResults = false;
            this.noDisplaySelected = true;
        }
    };
    FiltersComponent.prototype.clearFilter = function () {
        this.paramVal = '';
    };
    FiltersComponent.prototype.setParamName = function (param) {
        this.param = param.QueryName;
        this.paramDisplay = param.DisplayName;
        this.paramVal = null;
        this.showCalender = false;
        this.showAutoComplete = false;
        if (this.param.toLowerCase().indexOf('date') != -1) {
            this.showCalender = true;
        }
        if (this.param == 'customerNumber') {
            this.showAutoComplete = true;
        }
    };
    FiltersComponent.prototype.handleEnter = function () {
        console.log(this.paramsContainValue());
        if (!this.paramsContainValue()) {
            this.addFilterParam();
        }
        else {
            this.getPurchaseOrders();
        }
    };
    FiltersComponent.prototype.paramsContainValue = function () {
        for (var _i = 0, _a = Object.keys(this.filters); _i < _a.length; _i++) {
            var key = _a[_i];
            console.log(key);
            console.log(this.filters[key]);
            if (this.filters[key] != null && this.filters[key].Value == this.paramVal) {
                return true;
            }
        }
        return false;
    };
    FiltersComponent.prototype.addFilterParam = function () {
        this.filters[this.param] = {
            "Value": this.paramVal,
            "DisplayName": this.paramDisplay
        };
        if (this.arrayOfKeys.indexOf(this.param) == -1) {
            this.arrayOfKeys.push(this.param);
        }
    };
    FiltersComponent.prototype.removeFilterParam = function (param) {
        this.filters[param] = null;
        var index = this.arrayOfKeys.indexOf(param);
        if (index != -1) {
            this.arrayOfKeys.splice(index, 1);
        }
    };
    FiltersComponent.prototype.autocompleteSource = function (keyword) {
        return this.poSrvc.getAutocomplete(keyword);
    };
    return FiltersComponent;
}());
FiltersComponent = __decorate([
    core_1.Component({
        selector: 'filters',
        templateUrl: './Filters.component.html'
    }),
    __metadata("design:paramtypes", [CommonData_service_1.CommonDataService, http_1.Http, MetricsService_service_1.MetricsService,
        PurchaseOrders_service_1.PurchaseOrdersService, router_1.Router])
], FiltersComponent);
exports.FiltersComponent = FiltersComponent;
//# sourceMappingURL=Filters.component.js.map