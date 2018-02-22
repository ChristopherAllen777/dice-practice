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
var Subject_1 = require("rxjs/Subject");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var CommonDataService = (function () {
    function CommonDataService(_http) {
        this._http = _http;
        this._selectedPurchaseOrder = null;
        this._previousPage = null;
        this._filters = null;
        this._pageTitle = null;
        this.onPageChange = new Subject_1.Subject();
        this.onFilterChange = new Subject_1.Subject();
    }
    CommonDataService.prototype.setSelectedPO = function (po) {
        this._selectedPurchaseOrder = po;
    };
    CommonDataService.prototype.getSelectedPO = function () {
        return this._selectedPurchaseOrder;
    };
    CommonDataService.prototype.setPreviousPage = function (previousPage) {
        this._previousPage = previousPage;
    };
    CommonDataService.prototype.getPreviousPage = function () {
        return this._previousPage;
    };
    CommonDataService.prototype.setFilters = function (filters) {
        this._filters = filters;
    };
    CommonDataService.prototype.getFilters = function () {
        return this._filters;
    };
    CommonDataService.prototype.setPageTitle = function (pageTitle) {
        this._pageTitle = pageTitle;
    };
    CommonDataService.prototype.getPageTitle = function () {
        return this._pageTitle;
    };
    CommonDataService.prototype.pageChange = function () {
        this.onPageChange.next();
    };
    CommonDataService.prototype.filterChange = function () {
        this.onFilterChange.next();
    };
    return CommonDataService;
}());
CommonDataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], CommonDataService);
exports.CommonDataService = CommonDataService;
//# sourceMappingURL=CommonData.service.js.map